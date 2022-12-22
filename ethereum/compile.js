const path = require("path");
const solc = require("solc");

const fs = require("fs");

const buidPath = path.resolve(__dirname, "build");

// remove build directory
fs.rmSync(buidPath, { force: true, recursive: true });

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const output = solc.compile(source, 1).contracts;

// create a brand new "build" directory
if (!fs.existsSync(buidPath)) {
  fs.mkdirSync(buidPath, { recursive: true });
}

// loop over the output and write to a file each of them
for (let contract in output) {
  const contractName = contract.slice(1); // we strip out the first sign in contract name ':'
  const newPath = path.resolve(buidPath, contractName + ".json");
  const contractContent = JSON.stringify(output[contract], null, 2);
  fs.writeFileSync(newPath, contractContent);
}
