import type { AppProps } from "next/app";
import ErrorPage from "next/error";

import { Layout } from "../components/layout";

import "semantic-ui-css/semantic.min.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  const { error } = pageProps;
  return error ? (
    <ErrorPage statusCode={error.statusCode} title={error.message} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
