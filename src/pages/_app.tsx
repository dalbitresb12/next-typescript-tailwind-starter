import type { ReactElement } from "react";
import type { AppProps } from "next/app";
import "../css/base.css";

const MyApp = ({ Component, pageProps }: AppProps): ReactElement | null => {
  return <Component {...pageProps} />;
};

export default MyApp;
