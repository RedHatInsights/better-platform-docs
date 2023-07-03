import React, { PropsWithChildren } from "react";
import { Highlight, themes } from "prism-react-renderer";
import classnames from "clsx";
import type { Language } from "prism-react-renderer";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  pre: {
    maxWidth: "100vw",
    textAlign: "left",
    margin: "1em 0",
    padding: 16,
    overflow: "auto",
    borderRadius: 8,
    "& .token-line": {
      lineHeight: "1.3em",
      height: "1.3em",
    },
  },
});

const Pre: React.FC<
  PropsWithChildren<{
    className: string;
    style: React.CSSProperties;
  }>
> = ({ children, className, style, ...props }) => {
  const classes = useStyles();
  return (
    <pre
      {...props}
      style={style}
      className={classnames(classes.pre, className)}
    >
      {children}
    </pre>
  );
};

const CodeHighlight: React.FC<{ sourceCode: string; language: Language }> = ({
  sourceCode,
  language,
}) => {
  if (typeof sourceCode !== "string") {
    return <div>Loading</div>;
  }

  return (
    <Highlight
      theme={language ? themes.nightOwl : undefined}
      language={language}
      code={sourceCode.replace(/\n*$/, "")}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          <React.Fragment>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </React.Fragment>
        </Pre>
      )}
    </Highlight>
  );
};

export default CodeHighlight;
