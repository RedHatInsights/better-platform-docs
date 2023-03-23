import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import MDXProviderComponents from "../components/MDXProviderComponents";
import BaseLayout from "../components/layouts/BaseLayout";
import "@redhat-cloud-services/frontend-components/index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={MDXProviderComponents}>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </MDXProvider>
  );
}

export default MyApp;
