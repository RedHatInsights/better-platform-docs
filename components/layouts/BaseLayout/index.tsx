import {
  Page,
  PageHeader,
  PageSidebar,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import Link from "next/link";
import classnames from "clsx";
import { PropsWithChildren, useState } from "react";
import { createUseStyles } from "react-jss";
import Image from "next/image";
import Navigation from "../../Navigation";
import useNavSchema from "../../Navigation/useNavSchema";
import TableOfContents from "../../table-of-contents";

const useStyles = createUseStyles({
  page: {
    height: "100vh !important",
  },
  logo: {
    width: 100,
  },
  platExGuy: {
    maxHeight: "100%",
  },
  content: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "calc(100% - 16px * 2)",
    display: "flex",
    flexDirection: "column",
  },
  tableOfContents: {
    display: "none",
  },
  "@media (min-width: 1200px)": {
    content: {
      width: 900,
    },
    tableOfContents: {
      display: "block",
    },
  },
  link: {
    textDecoration: "none",
    color: "var(--pf-global--BackgroundColor--100)",
  },
  footer: {
    height: "auto",
    background: "var(--pf-global--BackgroundColor--dark-100)",
  },
  contentWrapper: {
    flex: 1,
  },
});

const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [isNavOpen, setIsnavOpen] = useState(true);
  const classes = useStyles();
  const { section, items: navItems } = useNavSchema();
  const Header = (
    <PageHeader
      logo={
        <Link href="/" className={classes.logo}>
          <Image
            width={100}
            height={50}
            src="/docs/platform-docs/logo.svg"
            alt="logo"
          />
        </Link>
      }
      showNavToggle={navItems.length !== 0}
      isNavOpen={isNavOpen}
      logoComponent="div"
      onNavToggle={() => setIsnavOpen((prev) => !prev)}
    />
  );
  return (
    <Page
      sidebar={
        navItems.length > 0 ? (
          <PageSidebar
            isNavOpen={isNavOpen}
            nav={<Navigation section={section} items={navItems} />}
          />
        ) : undefined
      }
      className={classes.page}
      header={Header}
    >
      <Split style={{ minHeight: "76.9vh" }} hasGutter>
        <SplitItem isFilled>
          <div className={classnames("pf-u-p-md", classes.content)}>
            <Stack hasGutter>
              <StackItem id="docs-content">{children}</StackItem>
            </Stack>
          </div>
        </SplitItem>
        <SplitItem className={classes.tableOfContents}>
          <TableOfContents />
        </SplitItem>
      </Split>
    </Page>
  );
};

export default BaseLayout;
