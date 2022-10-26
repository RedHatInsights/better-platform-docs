import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import MDXProviderComponents from "../components/MDXProviderComponents";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={MDXProviderComponents}>
      <Component {...pageProps} />
    </MDXProvider>
  );
}

export default MyApp;
