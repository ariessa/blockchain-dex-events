const { Web3 } = require("web3");

const web3 = new Web3("https://eth.public-rpc.com");
const erc20_abi = [
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
const pool_address = "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc";
const pool_abi = [
  {
    constant: true,
    inputs: [],
    name: "token0",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "token1",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

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

async function get_token_pair_details(pool_address, pool_abi) {
  const pool_contract = new web3.eth.Contract(pool_abi, pool_address);

  let token0_address;
  let token1_address;
  let token0_symbol;
  let token1_symbol;

  try {
    [token0_address, token1_address] = await Promise.all([
      pool_contract.methods.token0().call(),
      pool_contract.methods.token1().call(),
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
    token0_symbol: token0_symbol,
    token1_symbol: token1_symbol,
  };
}

function get_hex_signature(text_signature) {
  return web3.eth.abi.encodeEventSignature(text_signature);
}

get_token_pair_details(pool_address, pool_abi).then((res) => {
  console.log(
    `\nToken0 address: ${res.token0_address}\nToken1 address: ${res.token1_address}\n`
  );
  console.log(
    `Token0 symbol: ${res.token0_symbol}\nToken1 symbol: ${res.token1_symbol}\n`
  );
});

console.log(
  `\nCanonical event signature: ${get_hex_signature(
    "Swap(address,uint256,uint256,uint256,uint256,address)"
  )}\n`
);
