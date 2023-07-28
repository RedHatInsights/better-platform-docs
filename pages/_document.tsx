/* eslint-disable react/display-name */
import React, { Fragment } from "react";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { JssProvider, SheetsRegistry, createGenerateId } from "react-jss";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const registry = new SheetsRegistry();
    const generateId = createGenerateId();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) => (props: any) =>
          (
            <JssProvider registry={registry} generateId={generateId}>
              <App {...props} />
            </JssProvider>
          ),
      });
    const initialProps = await Document.getInitialProps(ctx);
    /**
     * Add JSS to initial render
     */
    return {
      ...initialProps,
      styles: (
        <Fragment>
          {initialProps.styles}
          <style id="ssr-style">{registry.toString()}</style>
        </Fragment>
      ),
    };
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://unpkg.com/@patternfly/patternfly@4.224.4/patternfly.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://unpkg.com/@patternfly/patternfly@4.224.4/patternfly-addons.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
