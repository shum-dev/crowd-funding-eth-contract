import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

const ADDRESS = "0x4C3788310dDbAe5D154BD11E52D632656e638F51";

export default new web3.eth.Contract(
  JSON.parse(campaignFactory.interface),
  ADDRESS
);
