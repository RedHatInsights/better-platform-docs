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
import ExternalLinkAltIcon from "@patternfly/react-icons/dist/js/icons/external-link-alt-icon";
import GithubIcon from "@patternfly/react-icons/dist/js/icons/github-icon";
import { createUseStyles } from "react-jss";
import { Fragment } from "react";
import clsx from "clsx";
import useWindowWidth from "../../hooks/useWindowWidth";

const useStyles = createUseStyles({
  icon: {
    "--pf-c-icon__content--Color": "var(--pf-global--palette--black-100)",
  },
  link: {
    "--pf-c-content--a--Color": "var(--pf-global--palette--black-100)",
    "--pf-c-content--a--hover--Color": "var(--pf-global--palette--black-100)",
    "--pf-c-content--a--hover--TextDecoration": "none",
  },
  toolbarItem: {
    borderLeft: "1px solid var(--pf-c-masthead--item-border-color--base)",
    borderRight: "1px solid var(--pf-c-masthead--item-border-color--base)",
  },
});

const HeaderLinks = () => {
  const classes = useStyles();
  const { sm } = useWindowWidth();
  return (
    <Fragment>
      <ToolbarItem
        className={clsx("pf-u-px-sm pf-u-px-xl-on-md", classes.toolbarItem)}
      >
        <TextContent className={classes.link}>
          <Text
            component="a"
            href="https://consoledot.pages.redhat.com/docs/dev/index.html"
            target="_blank"
          >
            {sm && "ConsoleDot Documentation"}
            {!sm && "Documentation"}
            <Icon className="pf-u-ml-sm" iconSize="sm" isInline>
              <ExternalLinkAltIcon />
            </Icon>
          </Text>
        </TextContent>
      </ToolbarItem>
      <ToolbarItem className="pf-u-px-lg-on-md">
        <Button
          component="a"
          variant="plain"
          href="https://github.com/RedHatInsights/better-platform-docs"
          target="_blank"
        >
          <GithubIcon />
        </Button>
      </ToolbarItem>
    </Fragment>
  );
};

export default HeaderLinks;
