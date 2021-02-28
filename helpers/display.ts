import { isAddress } from "@ethersproject/address";

export const EthAddressLength = 42;

export function displayAddress(address: string): string {
  if (!isAddress(address)) return address;
  const one = address.slice(0, 6);
  const two = address.slice(EthAddressLength - 4, EthAddressLength);
  return `${one}...${two}`;
}
