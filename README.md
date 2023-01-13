# Covalent Integration

This example shows you how to fetch indexed NFT information about a wallet using [Covalent](https://www.covalenthq.com).

It loads all of a user's owned tokens by making an API request to the [Get token balances for address](https://www.covalenthq.com/docs/api/#/0/Get%20token%20balances%20for%20address/USD/1) endpoint. Using web3sdks's React SDK, we fetch the metadata about each ERC-721 NFT and display it in a list using the
[Web3sdksNftMedia](https://docs.web3sdks.com/react/react.web3sdksnftmedia) component.

## Tools:

- [**Covalent**](https://www.covalenthq.com/): Fetch tokens owned by the connected wallet.

- [**React SDK**](https://docs.web3sdks.com/react): enable users to connect and disconnect their wallets to our website.

- [**TypeScript SDK**](https://docs.web3sdks.com/typescript): Load contract and NFT metadata for the owned NFTs.

## Using This Repo

- Create a project using this example by running:

```bash
npx web3sdks create --template covalent
```

Get a free API key from [Covalent](https://www.covalenthq.com/) and add your API key in an environment variable called `COVALENT_API_KEY` in the `.env.local` file.

```bash
COVALENT_API_KEY=ckey_xxx
```

## Guide

Learn how this repo works below!

### Connecting to user's wallet

Our application is wrapped in the `Web3sdksProvider` component. Allowing us to use all of the React SDK's functionality such as connect and disconnect wallets.

```jsx
import { ChainId, Web3sdksProvider } from "@web3sdks/react";
import Head from "next/head";
import Web3sdksGuideFooter from "../components/guide/Web3sdksGuideFooter";
import Header from "../components/Header";
import "../styles/globals.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }) {
  return (
    <Web3sdksProvider desiredChainId={activeChainId}>
      <Component {...pageProps} />
    </Web3sdksProvider>
  );
}

export default MyApp;
```

Then we can use the hooks to connect to and access the connected wallet address on [index.js](./pages/index.js).

```jsx
// Wallet connection hooks from React SDK
const address = useAddress();
const connectWithMetamask = useMetamask();
```

### Loading Token Balances

Once the user has connected their wallet, we load their token balances by requesting data from the Covalent API.

Firstly, we make a fetch request to our Next.js API route:

```jsx
const req = await fetch("/api/get-wallet-data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify({
    address: address,
  }),
});
```

On the API route, we make a request for data about the `address` from the Covalent API, passing in our API Key as the authentication header.

```jsx
const apikey = process.env.COVALENT_API_KEY;

let headers = new Headers();
let authString = `${apikey}:`;
headers.set("Authorization", "Basic " + btoa(authString));

const URL = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?nft=true&no-nft-fetch=true`;

fetch(URL, { method: "GET", headers: headers })
  .then((res) => res.json())

  .then((response) => {
    console.log(response);
    res.status(200).json({
      tokens: response.data.items,
    });
  })

  .catch((error) => {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  });
```

As you can see we return that data as `json` back to the client once the data has been loaded, and store that in state on the client:

```jsx
// De-structure tokens out of the response JSON
const { tokens } = await req.json();
// Set the tokens in state.
setTokenData(tokens.filter((t) => t.type === "nft"));
```

Now we have the token balances of the connected wallet, we're ready to display them.

### Displaying NFTs

Firstly, we map over the different kinds of tokens returned from the API endpoint, filtering to ERC-721 NFTs.

```jsx
{
  tokenData
    ?.filter((t) => t.type === "nft")
    ?.filter((t) => t.supports_erc?.includes("erc721"))
    ?.map((nft, i) => <NftCardContainer nft={nft} key={i} />);
}
```

The `NftCardContainer` component uses the React SDK's [MediaRenderer](https://docs.web3sdks.com/react/react.mediarenderer) component to resolve the NFT's image from IPFS and display it:

```jsx
<MediaRenderer
  style={{ width: 128, height: 128, borderRadius: 16, padding: 4 }}
  src={nft.external_data.image}
  alt="A mp4 video"
/>
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/KX2tsh9A](https://discord.gg/KX2tsh9A).
