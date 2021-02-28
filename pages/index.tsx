import Connection from "components/Connection";
import Head from "next/head";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

const Page = styled.div`
  padding: 0 1rem;
`;

const TokenList = styled.ul`
  margin: 0;
  padding: 1rem 0;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  li:not(:last-child) {
    flex: 1 0 auto;
  }
`;

const TokenIcon = styled.img`
  padding: 0.3rem;
`;

export interface TokenList {
  name: string;
  timestamp: Date;
  version: Version;
  keywords: string[];
  tokens: Token[];
  logoURI: string;
}

export interface Token {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

const TokenList1InchUrl = "https://cdn.furucombo.app/furucombo.tokenlist.json";

function Home(): JSX.Element {
  const { data } = useSWR<TokenList>(TokenList1InchUrl);
  return (
    <Page>
      <Head>
        <title>Token Menu</title>
      </Head>
      <h1>👨‍🍳 Token Menu</h1>
      <Connection />
      <TokenList>
        {data &&
          data.tokens.map((token, i) => (
            <li key={i}>
              <TokenIcon width="64" height="64" src={token.logoURI} />
            </li>
          ))}
      </TokenList>
    </Page>
  );
}

export default Home;
