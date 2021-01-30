import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";

import clsx from "clsx";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

import { Contract } from "@ethersproject/contracts";
import { isAddress } from "@ethersproject/address";

import erc20 from "../../abi/erc20.contract.json";

import styles from "../../styles/add.module.css";

async function fetchAlias(address) {
  const data = await fetch(
    "https://meta.yearn.network/tokens/token.aliases.json"
  )
    .then((res) => res.json())
    .then((res) => res.map((alias) => [alias.address, alias]))
    .then((res) => Object.fromEntries(res));
  return data[address];
}

export default function Add() {
  const router = useRouter();
  const { address, redirect } = router.query;
  const { library, active, activate } = useWeb3React();

  const { width, height } = useWindowSize();

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const image = useMemo(
    () => `https://meta.yearn.network/tokens/${address}/logo-128.png`,
    [address]
  );

  const redirectUrl = useMemo(() => redirect && decodeURIComponent(redirect), [
    redirect,
  ]);

  const connect = useCallback(async () => {
    if (!active) {
      const injected = new InjectedConnector({
        supportedChainIds: [1],
      });
      setLoading(true);
      await activate(injected);
      setLoading(false);
    }
  }, [active, activate]);

  const addToken = useCallback(async () => {
    if (active) {
      setLoading(true);
      const contract = new Contract(address, erc20, library);
      const alias = await fetchAlias(address);
      const name = alias ? alias.name : await contract.name();
      const symbol = alias ? alias.symbol : await contract.symbol();
      const decimals = await contract.decimals();
      const token = { name, symbol, decimals, image, address };
      const response = await library.provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: { ...token },
        },
      });
      setLoading(false);
      setComplete(response);
      if (response && redirectUrl) {
        setTimeout(() => {
          window.location = redirectUrl;
        }, 5000);
      }
    }
  }, [active, address, image, library, redirectUrl]);

  if (!isAddress(address)) {
    return (
      <div className={styles.center}>
        <p>{address} is not a valid address</p>
      </div>
    );
  }

  return (
    <div>
      {complete && (
        <Confetti
          recycle={false}
          gravity={0.4}
          run={complete}
          width={width}
          height={height}
        />
      )}
      <div className={styles.center}>
        <img className={clsx(loading && styles.rotate)} src={image} />
        {!active && !complete && (
          <button
            disabled={loading}
            className={styles.button}
            onClick={connect}
          >
            Connect metamask
          </button>
        )}
        {active && !complete && (
          <button
            disabled={loading}
            className={styles.button}
            onClick={addToken}
          >
            Add token
          </button>
        )}
        {complete && redirect && <p>Redirecting you in 5 seconds...</p>}
      </div>
    </div>
  );
}
