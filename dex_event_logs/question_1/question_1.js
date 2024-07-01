const { Web3 } = require("web3");
const web3 = new Web3("https://eth.public-rpc.com");

const uniswap_v2_pool_abi = require("../../lib/abi/uniswap_v2_pool");
const {
  swap_event_text_signature,
  usdc_weth_pool_address,
} = require("../../lib/constants");
const {
  get_hex_signature,
  get_token_pair_details,
} = require("../../lib/utils");

get_token_pair_details(usdc_weth_pool_address, uniswap_v2_pool_abi).then(
  (res) => {
    console.log(
      `Token0 address: ${res.token0_address}\nToken1 address: ${res.token1_address}\n`
    );
    console.log(
      `Token0 symbol: ${res.token0_symbol}\nToken1 symbol: ${res.token1_symbol}\n`
    );
  }
);

console.log(
  `\nCanonical event signature: ${get_hex_signature(
    swap_event_text_signature
  )}\n`
);
