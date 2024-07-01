const { Web3 } = require("web3");
const web3 = new Web3("https://eth.public-rpc.com");

const erc20_abi = require("./abi/erc20");

function get_abi_parameters(contract_abi, name, type) {
  let abi_parameters;

  const partial_abi = contract_abi.find(
    (abi) => abi.type === type && abi.name === name
  );

  if (partial_abi) {
    abi_parameters = partial_abi.inputs.map((param) => ({
      name: param.name,
      type: param.type,
      indexed: param.indexed,
    }));
  }

  return abi_parameters;
}

function get_hex_signature(text_signature) {
  return web3.eth.abi.encodeEventSignature(text_signature);
}

async function get_token_decimals(token_address) {
  const token_contract = new web3.eth.Contract(erc20_abi, token_address);

  let token_decimals;

  try {
    token_decimals = await token_contract.methods.decimals().call();
  } catch (error) {
    console.error(error);
  }

  return token_decimals;
}

async function get_token_pair_details(pool_address, pool_abi) {
  const pool_contract = new web3.eth.Contract(pool_abi, pool_address);

  let token0_address;
  let token1_address;
  let token0_decimals;
  let token1_decimals;
  let token0_symbol;
  let token1_symbol;

  try {
    [token0_address, token1_address] = await Promise.all([
      pool_contract.methods.token0().call(),
      pool_contract.methods.token1().call(),
    ]);

    [token0_decimals, token1_decimals] = await Promise.all([
      get_token_decimals(token0_address),
      get_token_decimals(token1_address),
    ]);

    [token0_symbol, token1_symbol] = await Promise.all([
      get_token_symbol(token0_address),
      get_token_symbol(token1_address),
    ]);
  } catch (error) {
    console.error(error);
  }

  return {
    token0_address: token0_address,
    token1_address: token1_address,
    token0_decimals: token0_decimals,
    token1_decimals: token1_decimals,
    token0_symbol: token0_symbol,
    token1_symbol: token1_symbol,
  };
}

async function get_token_symbol(token_address) {
  const token_contract = new web3.eth.Contract(erc20_abi, token_address);

  let token_symbol;

  try {
    token_symbol = await token_contract.methods.symbol().call();
  } catch (error) {
    console.error(error);
  }

  return token_symbol;
}

function truncate_number(num, decimal_places) {
  const factor = Math.pow(10, decimal_places);
  return Math.trunc(num * factor) / factor;
}

module.exports = {
  get_abi_parameters,
  get_hex_signature,
  get_token_decimals,
  get_token_pair_details,
  get_token_symbol,
  truncate_number,
};
