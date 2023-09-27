import React, { useEffect, useRef, useState } from "react";
import {
  Backdrop,
  Button,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  FlexItem,
  Gallery,
  Icon,
  MenuToggle,
  Panel,
  PanelMain,
  Popper,
  Sidebar,
  SidebarPanel,
  Split,
  SplitItem,
  Tabs,
  Tab,
  TabTitleText,
  Text,
  TextContent,
  SidebarContent,
  Title,
} from "@patternfly/react-core";
import PenToolIcon from "../Navigation/pen-tool";
import ExternalLinkAltIcon from "@patternfly/react-icons/dist/js/icons/external-link-alt-icon";
import sections from "../Navigation/sections/sections.json";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";
import { SectionType } from "../Navigation/SectionNavigation";
import Link from "next/link";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import classnames from "clsx";

const useStyles = createUseStyles({
  dropdownMenu: {
    "@media (min-width: 768px)": {
      height: "calc(100vh - 70px)",
      transform: "translate(0, 70px) !important",
    },
    "@media (max-width: 768px)": {
      height: "calc(100vh - 118px)",
      transform: "translate(0, 118px) !important",
    },
  },
  menuToggle: {
    "--pf-c-menu-toggle--after--BorderBottomWidth": "0 !important",
    "--pf-c-menu-toggle--before--BorderBottomColor": "transparent !important",
  },
  panel: {
    "@media (max-width: 768px)": {
      tabs: {
        background: "var(--pf-global--BackgroundColor--200)",
        borderBottom:
          "var(--pf-global--BorderWidth--sm) solid var(--pf-global--BorderColor--dark-100)",
      },
      sidebarPanel: {
        boxShadow: "none",
      },
      sidebarContent: {
        overflow: "auto",
      },
    },
  },
  sidebar: {
    "--pf-c-sidebar__panel--md--FlexBasis": "20rem",
    "--pf-c-sidebar__panel--BackgroundColor":
      "var(--pf-global--BackgroundColor--200)",
  },
  sidebarPanel: {
    alignSelf: "stretch",
    boxShadow: "inset -4px 0 4px -4px rgba(0, 0, 0, 0.16)",
  },
  sidebarContent: {
    overflow: "auto",
  },
  tabs: {
    "--pf-c-tabs__link--PaddingRight": "var(--pf-global--spacer--md)",
    "--pf-c-tabs__link--PaddingLeft": "var(--pf-global--spacer--md)",
    "--pf-c-tabs__item--m-current__link--after--BorderColor": "transparent",
    "--pf-c-tabs__item--m-current__link--Color":
      "var(--pf-global--link--Color)",
    "--pf-c-tabs__item--m-current__link--BackgroundColor": "#fff",
    "--pf-c-tabs--m-vertical--MaxWidth": "100%",
    "--pf-c-tabs--m-vertical__list--before--BorderColor": "transparent",
    "--pf-c-tabs--m-vertical__link--PaddingTop": "var(--pf-global--spacer--sm)",
    "--pf-c-tabs--m-vertical__link--PaddingBottom":
      "var(--pf-global--spacer--sm)",
    "--pf-c-tabs__link--after--BorderLeftWidth":
      "var(--pf-c-tabs__link--after--BorderWidth)",
    "& .pf-c-tabs__item:hover, & .pf-c-tabs__item:focus": {
      "& button": {
        backgroundColor: "var(--pf-global--BackgroundColor--100)",
        color: "var(--pf-global--primary-color--200)",
      },
    },
    "& .pf-c-tabs__item.pf-m-current": {
      "--pf-c-tabs__link--BackgroundColor":
        "var(--pf-global--BackgroundColor--100)",
    },
  },
  card: {
    "--pf-c-card--first-child--PaddingTop": "var(--pf-global--spacer--md)",
    "& a:hover": {
      textDecoration: "none",
    },
  },
});

const TabWrapper = ({
  title,
  eventKey,
}: {
  title: React.ReactNode;
  eventKey: string;
}) => {
  const tabRef = useRef<HTMLButtonElement>(null);
  return <Tab ref={tabRef} title={title} eventKey={eventKey} />;
};

type Section = {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
};

const DesignDropdown = () => {
  const [selectedService, setSelectedService] = useState<Section | undefined>(
    Object.values(sections)[0]
  );
  const [activeTabKey, setActiveTabKey] = useState(Object.keys(sections)[0]);
  const [isExpanded, setIsExpanded] = useState();
  const [] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const onToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setIsOpen(!isOpen);
  };
  const classes = useStyles();

  const toggle = (
    <MenuToggle
      className={classnames(classes.menuToggle, "pf-m-full-height")}
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
    >
      <Icon className="pf-u-m-sm" isInline>
        <PenToolIcon width="22" height="22" />
      </Icon>
      Design
    </MenuToggle>
  );

  return (
    <Popper
      trigger={toggle}
      appendTo={document.body}
      isVisible={isOpen}
      popper={
        <div
          ref={menuRef}
          className={classnames(classes.dropdownMenu, "pf-u-w-100")}
        >
          <Backdrop>
            <Panel
              variant="raised"
              className={classnames(
                classes.panel,
                "pf-c-dropdown__menu pf-u-p-0 pf-u-w-100"
              )}
            >
              <PanelMain>
                <Sidebar className={classes.sidebar}>
                  <SidebarPanel
                    className={classnames(
                      classes.sidebarPanel,
                      "pf-l-flex pf-u-flex-direction-column"
                    )}
                  >
                    <Tabs
                      inset={{
                        default: "insetNone",
                      }}
                      activeKey={activeTabKey}
                      onSelect={(_ev, tabKey) => {
                        setSelectedService(sections[tabKey as SectionType]);
                        setActiveTabKey(tabKey as string);
                      }}
                      isVertical
                      expandable={{
                        default: "expandable",
                        md: "nonExpandable",
                      }}
                      isExpanded={isExpanded}
                      toggleText={activeTabKey}
                      role="region"
                      className={classnames(
                        classes.tabs,
                        "pf-u-p-md pf-u-pr-0 pf-u-w-100"
                      )}
                    >
                      {Object.entries(sections).map(([key, section]) => (
                        <TabWrapper
                          eventKey={key}
                          key={key}
                          title={<TabTitleText>{section.title}</TabTitleText>}
                        />
                      ))}
                    </Tabs>
                  </SidebarPanel>
                  <SidebarContent className={classes.sidebarContent}>
                    <Card className={classes.card} isPlain>
                      <CardHeader className="pf-u-pr-xs pf-u-pr-md-on-md">
                        <Title headingLevel="h2">
                          {selectedService?.title}
                        </Title>
                        <CardActions>
                          <Button
                            variant="plain"
                            aria-label="Close menu"
                            onClick={() => setIsOpen(!isOpen)}
                          >
                            <TimesIcon />
                          </Button>
                        </CardActions>
                      </CardHeader>
                      <CardBody>
                        <Gallery hasGutter>
                          {selectedService?.items.map((item, key) => (
                            <Link key={key} href={item.href}>
                              <Card
                                isFullHeight
                                isFlat
                                isSelectableRaised
                                onClick={() => setIsOpen(!isOpen)}
                              >
                                {" "}
                                <CardBody>
                                  <Split>
                                    <SplitItem className="pf-m-fill">
                                      {item.title}
                                    </SplitItem>
                                    <SplitItem>
                                      <Icon
                                        className="pf-u-ml-sm chr-c-icon-external-link"
                                        isInline
                                      >
                                        <ExternalLinkAltIcon />
                                      </Icon>
                                    </SplitItem>
                                  </Split>
                                  <TextContent className="pf-u-pt-md">
                                    <Text
                                      component="small"
                                      className="pf-u-color-100"
                                    >
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipiscing elit, sed do eiusmod tempor.
                                    </Text>
                                  </TextContent>
                                </CardBody>
                              </Card>
                            </Link>
                          ))}
                        </Gallery>
                      </CardBody>
                    </Card>
                  </SidebarContent>
                </Sidebar>
              </PanelMain>
            </Panel>
          </Backdrop>
        </div>
      }
    />
  );
};

export default DesignDropdown;
