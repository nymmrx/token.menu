import React from "react";
import styled from "styled-components";

export const Dotted = styled.span<{ interactive?: boolean }>`
  border-bottom: 1px dotted;
  ${({ interactive }) => interactive && "cursor: pointer;"}
`;

interface AnchorProps {
  dotted?: boolean;
}

export const Anchor = styled.a<AnchorProps>`
  ${({ dotted }) => dotted && "border-bottom: 1px dotted;"}
`;

export interface AddressProps
  extends AnchorProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  address: string;
}

export function Address({ address, ...rest }: AddressProps): JSX.Element {
  return <Anchor {...rest} href={`https://etherscan.io/address/${address}`} />;
}
