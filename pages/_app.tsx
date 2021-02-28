import "../node_modules/normalize.css/normalize.css";
import "../styles/globals.css";

import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";

function getLibrary(provider: ExternalProvider) {
  return new Web3Provider(provider);
}

const theme = {};

function TokenApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Web3ReactProvider>
  );
}

export default TokenApp;
