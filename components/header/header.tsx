import React, { Fragment } from "react";
import {
  Button,
  Icon,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import { useRouter } from "next/router";
import Image from "next/image";
import Logo from "./logo";
import DesignDropdown from "../design-dropdown/design-dropdown";
import DevelopmentDropdown from "../development-dropdown/development-dropdown";
import ExternalLinkAltIcon from "@patternfly/react-icons/dist/js/icons/external-link-alt-icon";
import GithubIcon from "@patternfly/react-icons/dist/js/icons/github-icon";

const useStyles = createUseStyles({
  icon: {
    "--pf-c-icon__content--Color": "var(--pf-global--palette--black-100)",
  },
  toolbarItem: {
    borderLeft: "1px solid var(--pf-global--BorderColor--200)",
    borderRight: "1px solid var(--pf-global--BorderColor--200)",
  },
  link: {
    "--pf-c-content--a--Color": "var(--pf-global--palette--black-100)",
    "--pf-c-content--a--hover--Color": "var(--pf-global--palette--black-100)",
    "--pf-c-content--a--hover--TextDecoration": "none",
  },
});

const Header = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <MastheadMain className="pf-u-pl-lg pf-u-pt-0 pf-u-pb-xs">
        <MastheadBrand className="pf-u-flex-shrink-0 pf-u-mr-lg">
          <Logo />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent className="pf-u-mx-md pf-u-mx-0-on-2xl">
        <Toolbar isFullHeight>
          <ToolbarContent>
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <DevelopmentDropdown />
              </ToolbarItem>
              <ToolbarItem>
                <DesignDropdown />
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup className="pf-m-align-right pf-m-spacer-md">
              <ToolbarItem className={clsx("pf-u-px-xl", classes.toolbarItem)}>
                <TextContent className={classes.link}>
                  <Text
                    component="a"
                    href="https://consoledot.pages.redhat.com/docs/dev/index.html"
                  >
                    ConsoleDot Documentation
                    <Icon className="pf-u-ml-sm" size="sm" isInline>
                      <ExternalLinkAltIcon />
                    </Icon>
                  </Text>
                </TextContent>
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  component="a"
                  variant="plain"
                  href="https://github.com/RedHatInsights/better-platform-docs"
                >
                  <GithubIcon />
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Fragment>
  );
};

export default Header;
