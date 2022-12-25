import Web3 from "web3";

const INFURA_SEPLOIA =
  "https://sepolia.infura.io/v3/1b6fce04300041e0afa3058d4d2d6936";

let web3;

if (typeof window !== "undefined" && window.ethereum !== "undefined") {
  // we are on the browser and Metamask is running
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // we are on the server OR the user is not running Metamask
  const provider = new Web3.providers.HttpProvider(INFURA_SEPLOIA);
  web3 = new Web3(provider);
}

export default web3;
