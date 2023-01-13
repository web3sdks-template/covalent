import { ChainId, Web3sdksProvider } from "@web3sdks/react";
import Head from "next/head";
import Web3sdksGuideFooter from "../components/guide/Web3sdksGuideFooter";
import "../styles/globals.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }) {
  return (
    <Web3sdksProvider desiredChainId={activeChainId}>
      <Head>
        <title>web3sdks Covalent Integration</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="web3sdks Covalent integration to load a users NFTs and load the metadata about them using web3sdks."
        />
        <meta
          name="keywords"
          content="web3sdks covalent template, covalent example, covalent"
        />
      </Head>
      <Component {...pageProps} />
      <Web3sdksGuideFooter />
    </Web3sdksProvider>
  );
}

export default MyApp;
