import type { FunctionComponent } from "react";
import type { AppProps } from "next/app";
import "../css/base.css";

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
