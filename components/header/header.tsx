import React, { Fragment, useState } from "react";
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
import Logo from "./logo";
import Search from "../search/search-input";
import dynamic from "next/dynamic";
import useWindowWidth from "../../hooks/useWindowWidth";
import HeaderLinks from "./HeaderLinks";
import { DocsBreadcrumb } from "./breadcrumb";
import { useRouter } from "next/router";

const DevelopmentDropdown = dynamic(
  () => import("../development-dropdown/development-dropdown"),
  {
    ssr: false,
  }
);
const DesignDropdown = dynamic(
  () => import("../design-dropdown/design-dropdown"),
  {
    ssr: false,
  }
);
const useStyles = createUseStyles({
  breadcrumbGroup: {
    gridColumn: "2 / span 2",
    gridRow: "3",
  },
});

const Header = () => {
  const classes = useStyles();
  const { md, lg, xxl } = useWindowWidth();
  const router = useRouter();
  const showBreadcrumbs = router.pathname === "/" ? false : true;

  return (
    <Fragment>
      <MastheadMain className="pf-u-pl-lg pf-u-pt-0 pf-u-pb-xs">
        <MastheadBrand
          className="pf-u-flex-shrink-0 pf-u-mr-lg"
          href="/platform-docs"
        >
          <Logo />
        </MastheadBrand>
        <Toolbar isFullHeight>
          <ToolbarContent>
            <ToolbarGroup
              className="pf-m-icon-button-group pf-u-ml-auto"
              visibility={{ "2xl": "hidden" }}
            >
              {!xxl && <HeaderLinks />}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
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
            <ToolbarGroup
              className="pf-u-flex-grow-1 pf-u-mr-0 pf-u-mr-md-on-2xl"
              variant="filter-group"
            >
              <Search />
            </ToolbarGroup>

            <ToolbarGroup
              className="pf-m-icon-button-group pf-u-ml-auto"
              visibility={{ default: "hidden", "2xl": "visible" }}
            >
              {lg && <HeaderLinks />}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
      {showBreadcrumbs && (
        <ToolbarGroup className={classes.breadcrumbGroup}>
          <DocsBreadcrumb />
        </ToolbarGroup>
      )}
    </Fragment>
  );
};

export default Header;
