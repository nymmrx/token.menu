import React from "react";

import { AppProps } from "next/app";

import { Web3ReactProvider } from "@web3-react/core";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";

import "../styles/globals.css";

function getLibrary(provider: ExternalProvider) {
  return new Web3Provider(provider);
}

function TokenApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
}

export default TokenApp;
