import { Contract } from "web3-eth-contract/types";
import web3 from "./web3";
import campaign from "./build/Campaign.json";

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
  requests: (index: number) => TransactionA;
  manager: () => TransactionA;
  minimumContribution: () => TransactionA;
  contributersCount: () => TransactionA;
  contribute: () => TransactionC;
  createRequest: (
    description: string,
    value: string,
    recipient: string
  ) => TransactionB;
  approveRequest: (index: number) => TransactionB;
  finalizeRequest: (index: number) => TransactionB;
  getSummary: () => TransactionA;
  getRequestsCount: () => TransactionA;
};

type CampaignContract = Omit<Contract, "methods"> & { methods: FactoryMethods };

export default (address: string) => {
  return new web3.eth.Contract(
    JSON.parse(campaign.interface),
    address
  ) as CampaignContract;
};
