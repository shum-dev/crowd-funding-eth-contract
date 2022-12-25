const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
// const { interface, bytecode } = require("./compile");
const compiledFactory = require("./build/CampaignFactory.json");
// const compiledCampaign = require("./build/Campaign.json");

const SEPLOIA = "https://sepolia.infura.io/v3/1b6fce04300041e0afa3058d4d2d6936";

const provider = new HDWalletProvider(
  "unknown embark balcony yard elevator catch jazz health enrich away few rabbit",
  SEPLOIA
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("befor deploy: ", { accounts });

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Instance of the contract address: ", result.options.address);

  provider.engine.stop();
};

deploy();
