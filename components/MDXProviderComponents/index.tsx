/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {
  Button,
  Card,
  CardBody,
  CardHeader,
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
import Image from "next/image";
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
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

function addLinkAnchor(
  Component: React.FC<PropsWithChildren<{ className?: string }>>
): React.FC<PropsWithChildren<{ className?: string }>> {
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

const A: React.FC<
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
  <Card
    isPlain
    style={{
      background: "white",
      marginTop: "15px",
    }}
  >
    <CardHeader>
      <Title
        className={clsx(className, "pf-u-mb-lg")}
        headingLevel="h1"
        {...props}
      />
    </CardHeader>
  </Card>
));

export const H2 = addLinkAnchor(({ className, ...props }) => (
  <Card
    isPlain
    style={{
      background: "white",
    }}
  >
    <CardHeader>
      <Title
        className={clsx(className, "pf-u-mb-md pf-u-mt-md")}
        headingLevel="h2"
        {...props}
      />
    </CardHeader>
  </Card>
));

export const H3 = addLinkAnchor(({ className, ...props }) => (
  <Card
    isPlain
    style={{
      background: "white",
    }}
  >
    <CardHeader>
      <Title
        className={clsx(className, "pf-u-mb-md pf-u-mt-md")}
        headingLevel="h3"
        {...props}
      />
    </CardHeader>
  </Card>
));
export const H4 = addLinkAnchor(({ className, ...props }) => (
  <Card isPlain style={{ background: "white" }}>
    <CardHeader>
      <Title
        className={clsx(className, "pf-u-mb-md pf-u-mt-md")}
        headingLevel="h4"
        {...props}
      />
    </CardHeader>
  </Card>
));
export const Table: React.FC = (props) => {
  const classes = useTableStyles();
  return (
    <Card className={clsx("pf-u-mb-lg", classes.card)}>
      <CardBody>
        <table className="pf-c-table pf-m-grid-md" {...props} />
      </CardBody>
    </Card>
  );
};

const Code: React.FC<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
> = ({ children, className }) =>
  /language-(\w+)/.exec(className || "") ? (
    <Card
      isPlain
      style={{
        background: "white",
      }}
    >
      <CardBody style={{ paddingTop: "0px" }}>
        <CodeHighlight
          language={(className ? className.split("-").pop() : "") as Language}
          sourceCode={children as string}
        />
      </CardBody>
    </Card>
  ) : (
    <code>{children}</code>
  );

const Li: React.FC<PropsWithChildren> = ({ children }) => (
  <TextListItem component={TextListItemVariants.li}>{children}</TextListItem>
);

const OrderedList: React.FC<PropsWithChildren> = ({ children }) => (
  <Card isPlain style={{ background: "white", boxShadow: "none" }}>
    <CardBody style={{ paddingTop: "0px" }}>
      <TextContent>
        <TextList component={TextListVariants.ol}>{children}</TextList>
      </TextContent>
    </CardBody>
  </Card>
);

export const UnorderedList: React.FC<PropsWithChildren> = ({ children }) => (
  <Card style={{ background: "white", boxShadow: "none" }}>
    <CardBody style={{ paddingTop: "0px" }}>
      <TextContent>
        <TextList component={TextListVariants.ul}>{children}</TextList>
      </TextContent>
    </CardBody>
  </Card>
);

export const Paragraph: React.FC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <Card
    isPlain
    style={{
      background: "white",
    }}
  >
    <CardBody style={{ paddingTop: "0px" }}>
      <TextContent className={className}>
        <Text component={TextVariants.p}>{children}</Text>
      </TextContent>
    </CardBody>
  </Card>
);

export const Img: React.FC<
  PropsWithChildren<{ src?: string; alt?: string }>
> = ({ src, alt, ...props }) => {
  const { basePath } = useRouter();
  return (
    <Image
      src={`${basePath}${src}`}
      width={Number.MAX_SAFE_INTEGER}
      height={Number.MAX_SAFE_INTEGER}
      alt={alt || ""}
      {...props}
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
