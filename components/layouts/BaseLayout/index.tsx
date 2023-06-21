import {
  Icon,
  Hint,
  HintTitle,
  Gallery,
  HintBody,
  Text,
  TextContent,
  Page,
  PageHeader,
  PageSection,
  PageSectionVariants,
  PageSidebar,
  SearchInput,
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
import FilterIcon from "@patternfly/react-icons/dist/js/icons/filter-icon";

import Navigation from "../../Navigation";
import useNavSchema from "../../Navigation/useNavSchema";
import TableOfContents from "../../table-of-contents";
import Landing from "./Landing";

const useStyles = createUseStyles({
  page: {
    height: "100vh !important",
  },
  banner: {
    backgroundImage:
      "url(https://console.redhat.com/apps/frontend-assets/platform-doc/ExternalDocsSiteBackground.svg)",
  },
  banner_content: {
    maxWidth: "1300px",
  },
  icon: {
    paddingLeft: "10px",
    Top: "60px",
    zIndex: "2",
  },
  filter: {
    maxWidth: "360px",
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
          <Image width={100} height={50} src="/logo.svg" alt="logo" />
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
      <PageSection isFilled={false} className={classes.banner}>
        <div className={classes.banner_content}>
          <TextContent>
            <Text component="h1" className="pf-u-pt-xl">
              Welcome to the Platform Experience internal docs site!
            </Text>
            <Text component="p" className="pf-u-pt-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
            </Text>
          </TextContent>
          <Hint className="pf-u-m-2xl">
            <HintTitle>News and announcements</HintTitle>
            <HintBody>
              React router v6 upgrade HMR available in development
            </HintBody>
          </Hint>
        </div>
      </PageSection>
      <PageSection
        id="docs-content"
        padding={{ default: "noPadding", md: "padding", lg: "padding" }}
      >
        <TextContent className="pf-u-pt-md pf-u-text-align-center">
          <Text component="h1">All PlatEx documentation</Text>
        </TextContent>
        <Icon className={classes.icon}>
          <FilterIcon />
        </Icon>
        <SearchInput
          className={classnames(
            classes.filter,
            "pf-u-mt-md pf-u-mb-xl pf-u-m-auto"
          )}
          data-ouia-component-id="app-filter-search"
          placeholder="Find documentation ..."
        />

        {children}
        <TableOfContents />
      </PageSection>
    </Page>
  );
};

export default BaseLayout;
