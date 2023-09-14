import type { NextPage } from "next";
import Head from "next/head";
import {
  Button,
  PageSection,
  TextContent,
  Text,
  Hint,
  HintTitle,
  HintBody,
  Icon,
  SearchInput,
} from "@patternfly/react-core";
import Link from "next/link";
import SectionNavigation from "../components/Navigation/SectionNavigation";
import type {
  NavRecord,
  SectionType,
  SectionItem,
} from "../components/Navigation/SectionNavigation";
import { FilterIcon } from "@patternfly/react-icons/dist/esm/icons";
import TableOfContents from "../components/table-of-contents";
import { createUseStyles } from "react-jss";
import classnames from "clsx";
import sections from "../components/Navigation/sections/sections.json";
import { useEffect, useState } from "react";

const useStyles = createUseStyles({
  banner: {
    backgroundImage:
      "url(https://console.redhat.com/apps/frontend-assets/platform-doc/ExternalDocsSiteBackground.svg)",
  },
  banner_content: {
    maxWidth: "1000px",
    margin: "auto",
  },
  icon: {
    position: "absolute",
    marginLeft: "var(--pf-global--spacer--sm)",
    marginTop: "var(--pf-global--spacer--sm)",
    zIndex: "2",
  },
  filter: {
    width: "360px",
    "& svg": {
      display: "none",
    },
  },
  search_wrapper: {
    position: "relative",
    width: "360px",
    margin: "auto",
  },
  tableOfContent: {
    display: "none",
  },
});

const filterItems = (searchBy: string, items: SectionItem[]) =>
  items.some(({ groups, groupTitle, title }) => {
    const findInTitle = title?.toLowerCase().includes(searchBy as string);
    const findInGroupTitle = groupTitle
      ?.toLowerCase()
      .includes(searchBy as string);
    const foundInGroups = (groups || [])?.some(({ title }) =>
      title.toLowerCase().includes(searchBy as string)
    );
    return findInTitle || findInGroupTitle || foundInGroups;
  });

const filterNavigations = (searchBy: string, navigations: NavRecord[]) =>
  navigations.filter((navItem) => {
    return Object.entries(navItem).some(
      ([key, items]) =>
        key
          .split("-")
          .join(" ")
          .includes(searchBy as string) || filterItems(searchBy, items)
    );
  });

const Home: NextPage = () => {
  const [navigations, setNavigations] = useState<NavRecord[]>([]);
  const [searchBy, setSearchBy] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchAllNavs = async () => {
      const allNavs = await Promise.all(
        Object.entries(sections).flatMap(
          ([key, { items }]: [string, { items: { href: string }[] }]) =>
            items.reduce<Promise<NavRecord>>(async (acc, { href }) => {
              const schema = await import(
                `../components/Navigation/schemas${href}`
              );
              return {
                [key]: [
                  ...((await acc)[key as SectionType] || []),
                  ...(schema.default as SectionItem[]),
                ],
              };
            }, Promise.resolve({}))
        )
      );
      setNavigations(allNavs);
    };
    fetchAllNavs();
  }, []);
  const classes = useStyles();
  return (
    <div>
      <Head>
        <title>Hybrid cloud console developer documentation</title>
        <meta name="description" content="HCC developer documentation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <PageSection
          isFilled={false}
          className={classes.banner}
          hasShadowBottom
        >
          <div className={classes.banner_content}>
            <TextContent className="pf-u-text-align-center pf-u-mb-md">
              <Text component="h1" className="pf-u-pt-xl">
                Welcome to the Platform internal docs site!
              </Text>
              <Text component="p" className="pf-u-pt-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
              </Text>
            </TextContent>
            <Hint className="pf-u-mb-2xl">
              <HintTitle>News and announcements</HintTitle>
              <HintBody>
                React router v6 upgrade HMR available in development
              </HintBody>
            </Hint>
          </div>
        </PageSection>
        <PageSection id="docs-content">
          <TextContent className="pf-u-pt-md pf-u-text-align-center">
            <Text component="h1">Search through all documentation</Text>
          </TextContent>
          <div className={classes.search_wrapper}>
            <Icon className={classes.icon}>
              <FilterIcon />
            </Icon>
            <SearchInput
              className={classnames(classes.filter, "pf-u-mt-md pf-u-mb-xl")}
              data-ouia-component-id="app-filter-search"
              placeholder="Find documentation ..."
              onChange={(value) => setSearchBy(value.toLowerCase())}
            />
          </div>
          <SectionNavigation
            navigations={filterNavigations(
              searchBy || "",
              navigations
            ).flatMap<SectionType>(
              (item) => Object.keys(item) as SectionType[]
            )}
          />
          <div className={classes.tableOfContent}>
            <TableOfContents />
          </div>
        </PageSection>
      </main>
    </div>
  );
};

export default Home;
