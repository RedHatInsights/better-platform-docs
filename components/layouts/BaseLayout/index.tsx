import {
  Card,
  CardBody,
  Masthead,
  Page,
  PageSection,
  PageSectionVariants,
  PageSidebar,
  Sidebar,
  SidebarContent,
  SidebarPanel,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { PropsWithChildren, useState, useRef } from "react";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import Navigation from "../../Navigation";
import useNavSchema from "../../Navigation/useNavSchema";
import TableOfContents from "../../table-of-contents";
import { useRouter } from "next/router";
import Header from "../../header/header";
import Footer from "../../footer/Footer";

const useStyles = createUseStyles({
  masthead: {
    "--pf-c-masthead__main--before--Right": "0",
  },
  page: {
    height: "100vh !important",
  },
  sidebar: {
    height: "100vh",
    overflow: "auto",
  },
});

const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const classes = useStyles();
  const { section, items: navItems } = useNavSchema();
  const { route, basePath } = useRouter();
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
      header={
        <Masthead
          className={clsx("pf-u-p-0", classes.masthead)}
          display={{ sm: "stack", "2xl": "inline" }}
        >
          <Header />
        </Masthead>
      }
      groupProps={{
        stickyOnBreakpoint: { default: "top" },
      }}
      additionalGroupedContent={
        navItems.length > 0 && !"Note: Hidden until RHCLOUD-28585 is done" ? (
          <PageSection variant={PageSectionVariants.light} isWidthLimited>
            <TextContent>
              <Text component="h1">Section name</Text>
              <Text component="p">Section Description</Text>
            </TextContent>
          </PageSection>
        ) : undefined
      }
    >
      {route !== "/" ? (
        <Sidebar
          id="content-wrapper"
          className={classes.sidebar}
          isPanelRight
          hasGutter
        >
          <SidebarPanel
            variant="sticky"
            className="pf-u-background-color-200 pf-u-pl-lg pf-u-pl-0-on-lg"
          >
            <TableOfContents />
          </SidebarPanel>
          <SidebarContent id="docs-content">
            <PageSection className="pf-u-pl-0">
              <Card>
                <CardBody>{children}</CardBody>
              </Card>
            </PageSection>
          </SidebarContent>
        </Sidebar>
      ) : (
        children
      )}
      <Footer />
    </Page>
  );
};

export default BaseLayout;
