const { Web3 } = require("web3");
const web3 = new Web3("https://polygon-rpc.com");

const { ethers } = require("hardhat");

const mock_fetch_price = (data, delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

async function simulate_price_impact() {
  const amount_in = ethers.utils.parseUnits("10", "ether");

  try {
    const [token_in, token_out] = await Promise.all([
      mock_fetch_price({ symbol: 'WMATIC', price: 0.56295 }, 1000),
      mock_fetch_price({ symbol: 'ETH', price: 3462.98 }, 1200),
    ]);

    console.log(`Current price of token In (${token_in.symbol}): $${token_in.price}`);
    console.log(`Current price of token out (${token_out.symbol}): $${token_out.price}`);

    const estimated_execution_price = (token_in.price + token_out.price) / 2;
    console.log(`Estimated execution price: $${estimated_execution_price}`);

    const price_impact =
      ((estimated_execution_price - token_in.price) / token_in.price) * 100;
    console.log(`Estimated price impact: ${price_impact.toFixed(2)}%`);

    console.log(
      `Estimated price impact for swapping ${amount_in.toString()} ${token_in.symbol} to ${token_out.symbol}: ${price_impact.toFixed(
        2
      )}%`
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

simulate_price_impact();


// const { ethers } = require("hardhat");
// const Web3 = require("web3");
// const web3 = new Web3("https://polygon-rpc.com");

// // UniswapV2Pair ABI
// const UNISWAP_V2_PAIR_ABI = [
//   {
//     constant: true,
//     inputs: [],
//     name: "getReserves",
//     outputs: [
//       { name: "_reserve0", type: "uint112" },
//       { name: "_reserve1", type: "uint112" },
//       { name: "_blockTimestampLast", type: "uint32" },
//     ],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
// ];

// // Mock fetch price for simulation purposes
// const mockFetchPrice = (token) => {
//   const mockPrices = {
//     'ethereum': 3000, // Mock price for ETH
//     'usd-coin': 1, // Mock price for USDC
//   };
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(mockPrices[token]);
//     }, 1000);
//   });
// };

// // Get reserves from the Uniswap V2 pair contract
// async function getReserves(pairAddress) {
//   const pairContract = new web3.eth.Contract(UNISWAP_V2_PAIR_ABI, pairAddress);
//   const reserves = await pairContract.methods.getReserves().call();
//   return reserves;
// }

// // Calculate output amount using Uniswap's constant product formula
// function getAmountOut(amountIn, reserveIn, reserveOut) {
//   const amountInWithFee = amountIn * 997;
//   const numerator = amountInWithFee * reserveOut;
//   const denominator = reserveIn * 1000 + amountInWithFee;
//   return numerator / denominator;
// }

// async function simulatePriceImpact() {
//   const tokenInAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; // WETH on Polygon
//   const tokenOutAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDC on Polygon
//   const pairAddress = "0x853Ee4b2A13f8a742d64C8F088bE7bA2131f670d"; // WETH-USDC pair on Quickswap

//   const amountIn = ethers.utils.parseUnits("1", "ether"); // 1 WETH

//   try {
//     // Use mockFetchPrice instead of fetching real-time data
//     const [tokenInPrice, tokenOutPrice] = await Promise.all([
//       mockFetchPrice("ethereum"),
//       mockFetchPrice("usd-coin"),
//     ]);

//     console.log(`Current price of token In (ETH): $${tokenInPrice}`);
//     console.log(`Current price of token out (USDC): $${tokenOutPrice}`);

//     const reserves = await getReserves(pairAddress);
//     const reserveIn = reserves._reserve0; // Reserve for tokenIn (WETH)
//     const reserveOut = reserves._reserve1; // Reserve for tokenOut (USDC)

//     const amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
//     const amountOutFormatted = ethers.utils.formatUnits(amountOut.toString(), 6); // USDC has 6 decimals

//     const executionPrice = amountOutFormatted / ethers.utils.formatUnits(amountIn, "ether");
//     console.log(`Execution price: ${executionPrice}`);

//     const priceImpact = ((executionPrice * tokenInPrice) / tokenOutPrice - 1) * 100;
//     console.log(`Estimated price impact: ${priceImpact.toFixed(2)}%`);

//     console.log(
//       `Estimated price impact for swapping ${ethers.utils.formatUnits(amountIn, "ether")} ETH to USDC: ${priceImpact.toFixed(
//         2
//       )}%`
//     );
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// simulatePriceImpact();

