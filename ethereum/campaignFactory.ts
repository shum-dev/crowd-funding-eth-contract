import web3 from "./web3";
import { Contract } from "web3-eth-contract/types";
import campaignFactory from "./build/CampaignFactory.json";

const ADDRESS = "0x0824e41E006822F4EEEd6eed6877C2D6962Fe6cA";

type TransactionArgsNonPayable = {
  from: string;
};

type TransactionArgsPayable = {
  from: string;
  value: string;
};

type TransactionA = {
  call: () => Promise<unknown>;
};

type TransactionB = {
  send: (args: TransactionArgsNonPayable) => Promise<unknown>;
};

type TransactionC = {
  send: (args: TransactionArgsPayable) => Promise<unknown>;
};

type FactoryMethods = {
  createCampaign: (minimum: string) => TransactionB;
  getDeployedCampaigns: () => TransactionA;
};

type FactoryContract = Omit<Contract, "methods"> & { methods: FactoryMethods };

export default new web3.eth.Contract(
  JSON.parse(campaignFactory.interface),
  ADDRESS
) as FactoryContract;
