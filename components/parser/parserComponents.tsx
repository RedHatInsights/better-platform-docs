import parse, { HTMLReactParserOptions, domToReact } from "html-react-parser";
import { Fragment } from "react";
import {
  H1,
  H2,
  H3,
  H4,
  A,
  Table,
  Code,
  Li,
  OrderedList,
  UnorderedList,
  Paragraph,
  Img,
} from "../MDXProviderComponents";
import CodeHighlight from "../MDXProviderComponents/code-highlight";
import { useRouter } from "next/router";

const componentMapper: {
  [key: string]: React.ElementType<any> | React.ComponentType<any>;
} = {
  div: "div",
  a: A,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  code: Code,
  li: Li,
  ol: OrderedList,
  ul: UnorderedList,
  p: Paragraph,
  td: "td",
  tr: "tr",
  th: "th",
  tbody: "tbody",
  thead: "thead",
  img: ({ src, ...rest }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();
    const section = router.pathname.split("/").slice(1);
    const currSection = section.shift() || "";
    const currNav = section.shift() || "";
    return <Img {...rest} src={`/${currSection}/${currNav}/${src}`} />;
  },
  table: Table,
};

const replace: HTMLReactParserOptions["replace"] = (options) => {
  const { children, type, name, attribs } = options as any;
  // remove all global HTML tags
  if (type === "directive") {
    return <></>;
  }
  if (type === "style") {
    return <></>;
  }
  if (type === "tag" && name === "html") {
    return (
      <>
        {domToReact(children, {
          replace,
        })}
      </>
    );
  }
  if (type === "tag" && name === "head") {
    return <></>;
  }
  if (type === "tag" && name === "body") {
    return <>{domToReact(children, { replace })}</>;
  }

  // Replace HTML elements with components
  if (type === "tag" && componentMapper[name]) {
    const Component = componentMapper[name];
    return (
      <Component {...attribs}>
        {domToReact(children, {
          replace,
        })}
      </Component>
    );
  }
  if (type === "tag" && name === "pre") {
    const sourceCode = (
      children as { children: { data: string }[]; type: string; data: string }[]
    )
      .map((child) =>
        child.type === "text"
          ? child.data
          : child.children.map((child) => child.data)
      )
      .flat()
      .join("\n");

    return <CodeHighlight language={attribs.class} sourceCode={sourceCode} />;
  }

  return children;
};

function parseInternal(
  html: string,
  publicPath: string,
  parseOption?: HTMLReactParserOptions
) {
  const jsx = parse(html, {
    replace,
  });

  return jsx;
}

export default parseInternal;
