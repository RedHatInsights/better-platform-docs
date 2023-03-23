import React, { useEffect, useRef, useState, Suspense } from "react";
import PropTypes from "prop-types";
import { Card, CardBody } from "@patternfly/react-core";
import dynamic from "next/dynamic";
import classnames from "clsx";
import { createUseStyles } from "react-jss";
import ExpandablePanel from "./expandable-panel";
import { H2 } from "../MDXProviderComponents";
import { Language } from "prism-react-renderer";

const useStyles = createUseStyles({
  name: {
    "&:first-letter": {
      textTransform: "capitalize",
    },
  },
  exampleContainer: {
    widht: "100%",
  },
});

const ExampleComponent: React.FC<{
  language?: Language;
  source: string;
  name?: string;
  codeOnly: boolean;
}> = ({ language = "jsx", source, name, codeOnly }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [sourceCode, setSourceCode] = useState("");
  const classes = useStyles();

  useEffect(() => {
    import(`@docs/examples/${source}`).then((cmp) =>
      setComponent(() => cmp.default)
    );
    import(`!raw-loader!@docs/examples/${source}`).then((file) => {
      setSourceCode(file.default);
    });
  }, [source]);
  return (
    <div className={classes.exampleContainer}>
      <H2 className={classnames(classes.name)}>{name}</H2>
      {!codeOnly && Component && (
        <Card className="pf-u-mb-md">
          <CardBody>
            <Component />
          </CardBody>
        </Card>
      )}
      <ExpandablePanel
        language={language}
        codeOnly={codeOnly}
        source={source}
        sourceCode={sourceCode}
      />
    </div>
  );
};

export default ExampleComponent;
