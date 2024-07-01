const { Web3 } = require("web3");

const web3 = new Web3("https://polygon-rpc.com");

const token_address = "0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4";

const erc20_abi = [
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

async function total_supply(erc20_abi, token_address) {
  const token_contract = new web3.eth.Contract(erc20_abi, token_address);
  let token_decimals;
  let total_supply_without_decimals;
  let total_supply;

  try {
    total_supply_without_decimals = await token_contract.methods.totalSupply().call();
    token_decimals = BigInt(10) ** (await token_contract.methods.decimals().call());
    total_supply = total_supply_without_decimals / token_decimals;

    console.log(
      "Total supply of MANA token on Polygon Mainnet: ",
      total_supply.toLocaleString()
    );
  } catch (e) {
    console.error(e);
  }
}

total_supply(erc20_abi, token_address);
