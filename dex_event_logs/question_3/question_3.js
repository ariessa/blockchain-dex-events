const { Web3 } = require("web3");
const web3 = new Web3("https://polygon-rpc.com");

const { swap_event_text_signature } = require("../../lib/constants");
const { get_hex_signature } = require("../../lib/utils");

const block_number = 26444465;

async function get_event_logs(tx_hash) {
  let tx_logs = 0;

  try {
    tx_logs = (await web3.eth.getTransactionReceipt(tx_hash)).logs;

    if (tx_logs) {
      return tx_logs;
    }
  } catch (error) {
    if (!error.message.includes("Transaction not found")) {
      console.error(error);
    }
  }

  return tx_logs;
}

async function get_swap_events(block_number, event_text_signature) {
  const swap_event_hex_signature = get_hex_signature(event_text_signature);

  let events = [];

  try {
    const block = await web3.eth.getBlock(block_number, true);
    const txs = block.transactions;

    for (let i = 0; i < txs.length; i++) {
      const logs = await get_event_logs(txs[i].hash);

      for (let j = 0; j < logs.length; j++) {
        if (logs[j].topics[0] === swap_event_hex_signature) {
          events.push(logs[j]);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }

  return events;
}

get_swap_events(block_number, swap_event_text_signature).then((res) => {
  console.log(`\nTotal Swap events: ${res.length}\nSwap events: `, res);
});
