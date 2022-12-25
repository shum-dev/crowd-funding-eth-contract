const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factoryContract;
let campaignContract;
let campaignAddress;

const MINIMUM_CONTRIBUTION = "100";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factoryContract = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factoryContract.methods
    .createCampaign(MINIMUM_CONTRIBUTION)
    .send({ from: accounts[0], gas: "1000000" });

  const deployedCampaigns = await factoryContract.methods
    .getDeployedCampaigns()
    .call();

  [campaignAddress] = deployedCampaigns;

  campaignContract = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factoryContract.options.address);
    assert.ok(campaignContract.options.address);
  });

  it("marks caller/sender as the campaign manager", async () => {
    const manager = await campaignContract.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as contributor", async () => {
    // this method is payable so we send some value with transaction
    await campaignContract.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });

    const isContributor = await campaignContract.methods
      .contributors(accounts[1])
      .call();

    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaignContract.methods
        .contribute()
        .send({ value: MINIMUM_CONTRIBUTION - 1, from: accounts[1] });

      assert.fail();
    } catch (err) {
      assert(err.code !== "ERR_ASSERTION");
    }
  });

  it("allows a manager to make a payment request", async () => {
    const description = "Buy batteries";

    await campaignContract.methods
      .createRequest(description, "900", accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    const request = await campaignContract.methods.requests(0).call();

    assert.equal(description, request.description);
    assert.equal(accounts[1], request.recipient);

    try {
      await campaignContract.methods
        .createRequest(description, "900", accounts[1])
        .send({ from: accounts[2], gas: "1000000" });
    } catch (err) {
      assert(err);
    }
  });

  it("processes requests", async () => {
    await campaignContract.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaignContract.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await campaignContract.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    let balanceBefore = await web3.eth.getBalance(accounts[1]);
    balanceBefore = web3.utils.fromWei(balanceBefore, "ether");
    balanceBefore = parseFloat(balanceBefore);

    await campaignContract.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    // get balance in wei as string
    let balanceAfter = await web3.eth.getBalance(accounts[1]);
    balanceAfter = web3.utils.fromWei(balanceAfter, "ether");
    balanceAfter = parseFloat(balanceAfter);

    console.log({ balanceBefore, balanceAfter });

    assert(balanceAfter > balanceBefore);
    assert(balanceAfter > 104);
  });
});
