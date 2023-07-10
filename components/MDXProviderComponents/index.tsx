/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {
  Button,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  TextVariants,
  Title,
} from "@patternfly/react-core";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import { LinkIcon } from "@patternfly/react-icons";
import Link from "next/link";
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from "react";
import CodeHighlight from "../example-component/code-highlight";
import { Language } from "prism-react-renderer";
import { useRouter } from "next/router";

const useStyles = createUseStyles({
  anchor: {
    display: "flex",
    alignItems: "center",
    color: "inherit",
    textDecoration: "none",
    "&:hover $anchorIcon": {
      display: "inline-block !important",
    },
  },
  anchorIcon: {
    display: "none !important",
    padding: "0px !important",
    margin: "0px !important",
    marginLeft: "4px !important",
  },
  code: {
    textWrap: "wrap",
  },
  table: {
    "& th": {
      textTransform: "capitalize",
    },
    "& td:not(:first-child)": {
      wordBreak: "break-all",
    },
  },
});

function addLinkAnchor(
  Component: React.FC<PropsWithChildren<{ className?: string }>>
): React.FC<PropsWithChildren<{ className?: string }>> {
  return ({ className, ...props }) => {
    const classes = useStyles();
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
        <Component
          data-toc-ref={text}
          className={clsx(className, "docs-content-link")}
          {...props}
        >
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

export const A: React.FC<
  Omit<
    PropsWithChildren<
      React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >
    >,
    "ref"
  >
> = ({ children, href, target, ...props }) => (
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
export const Table: React.FC<{ className?: string }> = ({
  className,
  ...props
}) => {
  const classes = useStyles();
  return (
    <table
      {...props}
      className={clsx("pf-c-table pf-m-grid-md", classes.table)}
    />
  );
};

export const Code: React.FC<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
> = ({ children, className }) => {
  const classes = useStyles();
  return /language-(\w+)/.exec(className || "") ? (
    <CodeHighlight
      language={(className ? className.split("-").pop() : "") as Language}
      sourceCode={children as string}
    />
  ) : (
    <code className={classes.code}>{children}</code>
  );
};

export const Li: React.FC<PropsWithChildren> = ({ children }) => (
  <TextListItem component={TextListItemVariants.li}>{children}</TextListItem>
);

export const OrderedList: React.FC<PropsWithChildren> = ({ children }) => (
  <TextContent>
    <TextList component={TextListVariants.ol}>{children}</TextList>
  </TextContent>
);

export const UnorderedList: React.FC<PropsWithChildren> = ({ children }) => (
  <TextContent>
    <TextList component={TextListVariants.ul}>{children}</TextList>
  </TextContent>
);

export const Paragraph: React.FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <TextContent className={className}>
    <Text component={TextVariants.p}>{children}</Text>
  </TextContent>
);

export const Img: React.FC<
  PropsWithChildren<{ src?: string; alt?: string }>
> = ({ children, src, alt, ...props }) => {
  const { basePath } = useRouter();
  return (
    <img
      alt={alt || ""}
      {...props}
      src={`${basePath}/${src}`.replaceAll("//", "/")}
    />
  );
};

const MDXProviderComponents = {
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
