const { Web3 } = require("web3");
const web3 = new Web3("https://eth.public-rpc.com");

const pool_abi = require("../../lib/abi/uniswap_v2_pool");
const {
  get_abi_parameters,
  get_token_pair_details,
  truncate_number,
} = require("../../lib/utils");
const {
  swap_event_text_signature,
  usdc_weth_pool_address,
} = require("../../lib/constants");

const tx_hash =
  "0x5e555836bacad83ac3989dc1ec9600800c7796d19d706f007844dfc45e9703ac";

async function get_event_log_data(tx_hash, pool_address, pool_abi, event_name) {
  const abi_parameters = get_abi_parameters(pool_abi, event_name, "event");
  const token_pair_details = await get_token_pair_details(
    pool_address,
    pool_abi
  );
  const token0_decimals = Number(
    BigInt(10) ** token_pair_details.token0_decimals
  );
  const token1_decimals = Number(
    BigInt(10) ** token_pair_details.token1_decimals
  );
  const token0_symbol = token_pair_details.token0_symbol;
  const token1_symbol = token_pair_details.token1_symbol;
  const swap_input = 1.15481;
  const swap_output = parseFloat("3,184.35".replace(/,/g, ""));

  let decoded_data;
  let result;

  try {
    const get_tx_receipt_logs = (await web3.eth.getTransactionReceipt(tx_hash))
      .logs;

    for (let i = 0; i < get_tx_receipt_logs.length; i++) {
      let input_amount;
      let output_amount;
      let log_index;
      let log = get_tx_receipt_logs[i];

      if (
        log.topics[0] ===
        web3.eth.abi.encodeEventSignature(swap_event_text_signature)
      ) {
        // Remove topic0 as it's a non-anonymous event
        log.topics.shift();

        decoded_data = web3.eth.abi.decodeLog(
          abi_parameters,
          log.data,
          log.topics
        );

        if (decoded_data[2] !== 0n && decoded_data[3] !== 0) {
          input_amount = truncate_number(
            Number(decoded_data[2]) / token1_decimals,
            5
          );
          output_amount = truncate_number(
            Number(decoded_data[3]) / token0_decimals,
            2
          );
          result = [input_amount, output_amount, token1_symbol, token0_symbol];
        } else {
          input_amount = (Number(decoded_data[1]) / token0_decimals).toFixed(5);
          output_amount = (Number(decoded_data[4]) / token1_decimals).toFixed(
            2
          );
          result = [input_amount, output_amount, token0_symbol, token1_symbol];
        }

        if (input_amount === swap_input && output_amount === swap_output) {
          result.push(log.logIndex, event_name);
          break;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  return result;
}

get_event_log_data(tx_hash, usdc_weth_pool_address, pool_abi, "Swap").then((res) => {
  console.log(`\n${res[5]} event with log index of ${res[4]}, swapped ${res[0]} ${res[2]} to ${res[1]} ${res[3]}\n`);
});
