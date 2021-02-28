import { isAddress } from "@ethersproject/address";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const TokenIcon = styled.img<{ rotate: boolean }>`
  animation: ${({ rotate }) =>
    rotate ? "rotation 2s linear infinite" : "none"};
`;

const Button = styled.button`
  display: block;
  margin: 1em 0;
  width: 100%;
`;

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

function Add(): JSX.Element {
  const router = useRouter();
  const { address, redirect } = router.query as {
    address: string;
    redirect: string;
  };

  const { data: token, error } = useSWR(
    address && `/api/info/${address}`,
    fetcher
  );

  const { library, active, activate } = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const redirectUrl = useMemo(() => redirect && decodeURIComponent(redirect), [
    redirect,
  ]);

  const connect = useCallback(async () => {
    if (!active) {
      const injected = new InjectedConnector({
        supportedChainIds: [1],
      });
      await activate(injected);
    }
  }, [active, activate]);

  const addToken = useCallback(async () => {
    if (active && token) {
      setLoading(true);
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
          window.location.href = redirectUrl;
        }, 3000);
      }
    }
  }, [active, library, redirectUrl, token]);

  if (!isAddress(address)) {
    return (
      <Center>
        <p>{address} is not a valid address.</p>
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <p>{error.message}</p>
      </Center>
    );
  }

  return (
    <Center>
      {token && <TokenIcon rotate={loading} src={token.image} />}
      {!active && !complete && (
        <Button disabled={loading} onClick={connect}>
          Connect metamask
        </Button>
      )}
      {active && !complete && token && (
        <Button disabled={loading} onClick={addToken}>
          Add token
        </Button>
      )}
      {complete && redirect && <p>Redirecting you in 3 seconds...</p>}
    </Center>
  );
}

export default Add;
