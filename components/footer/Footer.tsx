import React from "react";
import {
  Flex,
  Icon,
  PageSection,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import { useRouter } from "next/router";
import Image from "next/image";

const useStyles = createUseStyles({
  icon: {
    "--pf-c-icon__content--Color": "var(--pf-global--palette--black-500)",
    "--pf-c-icon__content--FontSize": "2.5em",
    "&:hover": {
      "--pf-c-icon__content--Color": "var(--pf-global--palette--black-400)",
    },
  },
  content: {
    "--pf-c-content--a--Color": "var(--pf-global--Color--light-300)",
    "--pf-c-content--a--hover--Color": "var(--pf-global--Color--light-100)",
  },
});

const Footer = () => {
  const { route, basePath } = useRouter();
  const classes = useStyles();
  return (
    <React.Fragment>
      <PageSection className="pf-u-mt-auto pf-u-p-lg pf-m-no-fill pf-u-mt-auto pf-u-background-color-dark-100">
        <Flex
          role="contentinfo"
          className="pf-m-column pf-m-row-on-lg pf-u-justify-content-space-between"
        >
          <a
            href="https://www.redhat.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pf-l-flex"
          >
            <Image
              width={110}
              height={55}
              src={`${basePath}/logo.svg`}
              alt="Redhat logo"
              className="pf-u-ml-sm-on-lg pf-u-mt-xs"
            />
          </a>
          <Flex className="pf-m-column pf-u-align-self-flex-start">
            <TextContent
              className={clsx(
                "pf-l-flex pf-m-column pf-m-row-on-md",
                classes.content
              )}
            >
              <Text component="a" href="https://console.redhat.com">
                console.redhat.com
              </Text>
              <Text
                component="a"
                className="pf-u-ml-lg-on-lg"
                href="https://www.patternfly.org"
              >
                Patternfly
              </Text>
              <Text
                component="a"
                className="pf-u-ml-lg-on-lg"
                href="https://consoledot.pages.redhat.com"
              >
                Github
              </Text>
            </TextContent>
          </Flex>
        </Flex>
      </PageSection>
    </React.Fragment>
  );
};

export default Footer;
