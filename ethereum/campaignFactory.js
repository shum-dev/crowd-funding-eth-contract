import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

const ADDRESS = "0x0824e41E006822F4EEEd6eed6877C2D6962Fe6cA";

export default new web3.eth.Contract(
  JSON.parse(campaignFactory.interface),
  ADDRESS
);
