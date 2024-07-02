const { Web3 } = require("web3");
const web3 = new Web3("https://polygon-rpc.com");

const erc20_abi = require("../lib/abi/erc20");
const { mana_token_address_polygon } = require("../lib/constants");

async function total_supply(token_abi, token_address) {
  const token_contract = new web3.eth.Contract(token_abi, token_address);
  let token_decimals;
  let total_supply_without_decimals;
  let total_supply;

  try {
    total_supply_without_decimals = await token_contract.methods
      .totalSupply()
      .call();

    token_decimals =
      BigInt(10) ** (await token_contract.methods.decimals().call());

    total_supply = total_supply_without_decimals / token_decimals;
  } catch (e) {
    console.error(e);
  }

  return total_supply.toLocaleString();
}

total_supply(erc20_abi, mana_token_address_polygon).then((res) =>
  console.log(`\nTotal supply of MANA token on Polygon Mainnet: ${res}\n`)
);
