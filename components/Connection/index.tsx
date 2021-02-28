import { Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Address } from "components/Typography";
import { displayAddress } from "helpers/display";
import React, { useCallback, useEffect, useState } from "react";

const InjectedConfiguration = { supportedChainIds: [1] };

function Connection(): JSX.Element {
  const { active, activate, account, library } = useWeb3React<Provider>();
  const [name, setName] = useState(account);
  const connect = useCallback(async () => {
    if (!active) {
      const injected = new InjectedConnector(InjectedConfiguration);
      await activate(injected);
    }
  }, [active, activate]);
  useEffect(() => {
    if (account && library) {
      setName(account);
      library.lookupAddress(account).then((name) => name && setName(name));
    }
  }, [account, library]);

  if (!active) {
    return <button onClick={connect}>Connect to metamask</button>;
  }
  return (
    <p>
      <span>Connected as </span>
      <Address dotted address={account}>
        {displayAddress(name)}
      </Address>
    </p>
  );
}

export default Connection;
