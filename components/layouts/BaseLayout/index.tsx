import {
  Page,
  PageHeader,
  PageSection,
  PageSidebar,
  Sidebar,
  SidebarContent,
  SidebarPanel,
} from "@patternfly/react-core";
import Link from "next/link";
import classnames from "clsx";
import { PropsWithChildren, useState } from "react";
import { createUseStyles } from "react-jss";
import Image from "next/image";
import Navigation from "../../Navigation";
import useNavSchema from "../../Navigation/useNavSchema";
import TableOfContents from "../../table-of-contents";
import { useRouter } from "next/router";

const useStyles = createUseStyles({
  page: {
    height: "100vh !important",
  },
  logo: {
    width: 100,
  },
  sidebar: {
    height: "100vh",
    overflow: "auto",
  },
  tableOfContents: {
    display: "none",
  },
});

const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [isNavOpen, setIsnavOpen] = useState(true);
  const classes = useStyles();
  const { section, items: navItems } = useNavSchema();
  const { route, basePath } = useRouter();
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
      {route !== "/" ? (
        <Sidebar className={classes.sidebar} isPanelRight hasGutter>
          <SidebarPanel
            variant="sticky"
            className="pf-u-background-color-200 pf-u-pl-lg pf-u-pl-0-on-lg"
          >
            <TableOfContents />
          </SidebarPanel>
          <SidebarContent id="docs-content">
            <PageSection>{children}</PageSection>
          </SidebarContent>
        </Sidebar>
      ) : (
        children
      )}
    </Page>
  );
};

export default BaseLayout;
