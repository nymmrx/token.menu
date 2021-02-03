import { NextApiRequest as Req, NextApiResponse as Res } from "next";

import { WebSocketProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";

import erc20 from "../../../abi/erc20.contract.json";
import { isAddress } from "@ethersproject/address";

const YearnMetaAliasURL =
  "https://meta.yearn.network/tokens/token.aliases.json";

interface Alias {
  name: string;
  symbol: string;
  address: string;
}

async function fetchAlias(address: string): Promise<Alias> {
  const data = await fetch(YearnMetaAliasURL)
    .then((res) => res.json())
    .then((res) => res.map((alias: Alias) => [alias.address, alias]))
    .then((res) => Object.fromEntries(res));
  return data[address];
}

async function fetchImage(address: string): Promise<string> {
  return `https://meta.yearn.network/tokens/${address}/logo-128.png`;
}

export default async (req: Req, res: Res): Promise<void> => {
  const address = req.query.address as string;

  if (!isAddress(address)) {
    res.json({ message: `${address} is not an address.`, code: 400 });
    return;
  }

  const provider = new WebSocketProvider(process.env.WEB3_PROVIDER_WSS);
  const contract = new Contract(address, erc20, provider);

  const alias = await fetchAlias(address);
  const name = alias ? alias.name : await contract.name();
  const symbol = alias ? alias.symbol : await contract.symbol();
  const decimals = await contract.decimals();
  const image = await fetchImage(address);

  const token = { name, symbol, decimals, image, address };
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.json(token);
};
