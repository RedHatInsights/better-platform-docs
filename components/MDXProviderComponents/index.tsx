/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  CardBody,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  TextVariants,
  Title,
} from "@patternfly/react-core";
import type { Components } from "@mdx-js/react/lib/index";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import { LinkIcon } from "@patternfly/react-icons";
import Link, { LinkProps } from "next/link";
import Image from "next/image";
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
  TableHTMLAttributes,
} from "react";
import CodeHighlight from "../example-component/code-highlight";
import { Language } from "prism-react-renderer";
import { useRouter } from "next/router";

const useAnchorStyles = createUseStyles({
  anchorIcon: {
    display: "none !important",
    padding: "0px !important",
    margin: "0px !important",
    marginLeft: "4px !important",
  },
  anchor: {
    display: "flex",
    alignItems: "center",
    color: "inherit",
    textDecoration: "none",
    "&:hover $anchorIcon": {
      display: "inline-block !important",
    },
  },
});

type NoRefProps<P = unknown> = Omit<PropsWithChildren<P>, "ref">;

function addLinkAnchor(
  Component: React.FC<NoRefProps<{ className?: string }>>
): (props: NoRefProps<{ className?: string }>) => React.JSX.Element {
  return ({ className, ...props }) => {
    const classes = useAnchorStyles();
    if (typeof props?.children !== "undefined") {
      /**
       * We know the title is always either a string or a element with a string child.
       */
      const text =
        typeof props?.children === "string" ||
        typeof props?.children === "number" ||
        typeof props?.children === "boolean" ||
        props?.children === null
          ? props.children
          : (props?.children as any)?.props?.children || "";
      const anchor = text.replace(/\s/gm, "");
      return (
        <Component className={clsx(className, "docs-content-link")} {...props}>
          <a id={anchor} className={classes.anchor} href={`#${anchor}`}>
            {props.children}
            <Button
              className={classes.anchorIcon}
              component="span"
              variant="plain"
            >
              <LinkIcon />
            </Button>
          </a>
        </Component>
      );
    }

    return <Component {...props} />;
  };
}

const useTableStyles = createUseStyles({
  card: {
    overflowY: "auto",
  },
});

const A = ({
  children,
  href,
  target,
  ...props
}: NoRefProps<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
>) => (
  <Link href={href || "#"} {...props}>
    {children}
  </Link>
);

export const H1 = addLinkAnchor(({ className, ...props }) => (
  <Title
    className={clsx(className, "pf-u-mb-lg")}
    headingLevel="h1"
    {...props}
  />
));

export const H2 = addLinkAnchor(({ className, ...props }) => (
  <Title
    className={clsx(className, "pf-u-mb-md pf-u-mt-md")}
    headingLevel="h2"
    {...props}
  />
));

export const H3 = addLinkAnchor(({ className, ...props }) => (
  <Title
    className={clsx(className, "pf-u-mb-md pf-u-mt-md")}
    headingLevel="h3"
    {...props}
  />
));
export const H4 = addLinkAnchor(({ className, ...props }) => (
  <Title
    className={clsx(className, "pf-u-mb-md pf-u-mt-md")}
    headingLevel="h4"
    {...props}
  />
));
export const Table = (
  props: DetailedHTMLProps<
    TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >
) => {
  const classes = useTableStyles();
  return (
    <Card className={clsx("pf-u-mb-lg", classes.card)}>
      <CardBody>
        <table className="pf-c-table pf-m-grid-md" {...props} />
      </CardBody>
    </Card>
  );
};

const Code = ({
  children,
  className,
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) =>
  /language-(\w+)/.exec(className || "") ? (
    <CodeHighlight
      language={(className ? className.split("-").pop() : "") as Language}
      sourceCode={children as string}
    />
  ) : (
    <code>{children}</code>
  );

const Li = ({ children }: PropsWithChildren) => (
  <TextListItem component={TextListItemVariants.li}>{children}</TextListItem>
);

const OrderedList = ({ children }: PropsWithChildren) => (
  <TextContent>
    <TextList component={TextListVariants.ol}>{children}</TextList>
  </TextContent>
);

export const UnorderedList = ({ children }: PropsWithChildren) => (
  <TextContent>
    <TextList component={TextListVariants.ul}>{children}</TextList>
  </TextContent>
);

export const Paragraph = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <TextContent className={className}>
    <Text component={TextVariants.p}>{children}</Text>
  </TextContent>
);

export const Img = ({
  src,
  alt,
  ...props
}: PropsWithChildren<{ src?: string; alt?: string }>) => {
  return (
    <Image
      src={`/docs/platform-docs${src}`}
      width={Number.MAX_SAFE_INTEGER}
      height={Number.MAX_SAFE_INTEGER}
      alt={alt || ""}
      {...props}
    />
  );
};

const MDXProviderComponents: Components = {
  a: A,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  table: Table,
  code: Code,
  li: Li,
  ol: OrderedList,
  ul: UnorderedList,
  p: Paragraph,
  img: Img,
};

export default MDXProviderComponents;
