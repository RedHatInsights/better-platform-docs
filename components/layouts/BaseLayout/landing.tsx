import React from 'react';
import {
  Hint,
  HintTitle,
  HintBody,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import classnames from "clsx";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  banner: {
   backgroundImage: "url(https://console.redhat.com/apps/frontend-assets/platform-doc/ExternalDocsSiteBackground.svg)"
  },
  banner_content: {
   maxWidth: "1500px !important",
  },
});

const Landing = () => {
  const classes = useStyles();
  return (
    <PageSection isFilled={false} className={classes.banner}>
      <div className={classes.banner_content}>
        <TextContent>
          <Text component="h1" className="pf-u-pt-xl">
            Welcome to the Platform Experience internal docs site!
          </Text>
          <Text component="p" className="pf-u-pt-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
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
  )
};

export default Landing;