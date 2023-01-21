const path = require("path");
const envPath = path.resolve(__dirname, "..", ".env");
require("dotenv").config({ path: envPath });

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const compiledFactory = require("./build/CampaignFactory.json");

const INFURA_SEPOLIA = process.env.NEXT_PUBLIC_INFURA_SEPOLIA;
const MNEMONIC = process.env.MNEMONIC;

const provider = new HDWalletProvider(MNEMONIC, INFURA_SEPOLIA);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("befor deploy: ", { accounts });

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Instance of the contract(address): ", result.options.address);

  provider.engine.stop();
};

deploy();
