# 🦎 Blockchain DEX Events

## Contract Calls Knowledge

**Question**

Using https://polygon-rpc.com/ RPC node as a service, write the code and RPC call to obtain totalSupply of the MANA token issued on the Polygon (MATIC) blockchain. 

You may consider using the ERC-20 ABI for your solution.

You may approach the above natively or with a library such as Ethereum.rb, web3js, or ethers.

<br/>

**Solution**

The solution can be viewed at [contract_calls_knowledge.js](contract_calls_knowledge/contract_calls_knowledge.js).

<br />

<img src="/contract_calls_knowledge/screenshots/fx_contract_calls_knowledge.png"/>

<br />

## DEX Event Logs

### Question 1

Using the Etherscan block explorer, find a list of recent swaps for the following USDC/ETH pool on Uniswap V2.

Provide a screenshot for your response.

<br />

**Solution**

- The contract address for `USDC/WETH` pool on Uniswap V2 is `0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc`. This can be confirmed by the value of its `token0` and `token1`. The result of function `get_token_pair_details` from [question_1.js](dex_event_logs/question_1/question_1.js) shows that:

<br />

<img src="/dex_event_logs/question_1/screenshots/get_token_pair_details.png"/>

<br />

- The address for `token0` is `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`. This is known as `USDC` on the Ethereum mainnet.

- The address for `token1` is `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`. This is known as `WETH` on the Ethereum mainnet.
insert here

<br />

- In [Etherscan's Contract tab](https://etherscan.io/address/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc#code) for the `USDC/WETH` pool, it can be seen that the contract `UniswapV2Pair` inherits from interface `IUniswapV2Pair`.

<br />

<p align="center">
<img src="/dex_event_logs/question_1/screenshots/contract_inheritance_diagram.png"/>
</p>

<img src="/dex_event_logs/question_1/screenshots/uniswap_v2_pair_contract.png"/>

<img src="/dex_event_logs/question_1/screenshots/swap_event_in_contract.png"/>

<br />

This makes the contract `UniswapV2Pair` has the following `Swap` event:

```
event Swap(
    address indexed sender,
    uint amount0In,
    uint amount1In,
    uint amount0Out,
    uint amount1Out,
    address indexed to
);
```

<br />

- In [Etherscan's Contract tab](https://etherscan.io/address/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc#code) for the `USDC/WETH` pool, it can be seen that the function `swap()` inside contract `UniswapV2Pair` will emit `Swap` event upon a successful swap.

<br />

<img src="/dex_event_logs/question_1/screenshots/swap_function_in_contract.png"/>

<br />

- Inside [question_1.js](dex_event_logs/question_1/question_1.js), function `get_hex_signature` with the canonical text signature of `Swap(address,uint256,uint256,uint256,uint256,address)` as input results in `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822`. This is the hex signature for `Swap` event.

<br />

<img src="/dex_event_logs/question_1/screenshots/get_hex_signature.png"/>

<br />

- To further confirm that the hex signature for `Swap` event is `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822`, a search at the [Ethereum Signature Database's event signature page](https://www.4byte.directory/event-signatures) can be performed.

<br />

- As expected, in [Ethereum Signature Database's event signature page](https://www.4byte.directory/event-signatures/?bytes_signature=0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822), searching for an event signature with hex `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822` results in ID 75 of the following text signature:

```
Swap(address,uint256,uint256,uint256,uint256,address)
```

<br />

<img src="/dex_event_logs/question_1/screenshots/ethereum_signature_database_result.png"/>

<br />

- In [Etherscan's Events tab](https://etherscan.io/address/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc#events) for the `USDC/WETH` pool, it can be seen that the `event Swap(address,uint256,uint256,uint256,uint256,address)` has `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822` as its event signature. The `topic0` of every event is its event signature in hex.

<br />

<img src="/dex_event_logs/question_1/screenshots/event_logs.png"/>

<br />

- In [Etherscan's Events tab](https://etherscan.io/address/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc#events) for the `USDC/WETH` pool, filtering the logs by `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822` results in a list of recent swaps.

<br />

<img src="/dex_event_logs/question_1/screenshots/recent_swaps.png"/>

<br />

### Question 2

https://etherscan.io/tx/0x5e555836bacad83ac3989dc1ec9600800c7796d19d706f007844dfc45e9703ac/ is a swap transaction on a Uniswap V2 pool. One of the associated swaps here is a trade from 1.15481 ETH to $3,184.35. Determine in the block explorer where that raw number is coming from and how it is being derived.

You may use screenshot to show your answers.

<br />

**Solution**

- In the [Transaction Details page on Etherscan](https://etherscan.io/tx/0x5e555836bacad83ac3989dc1ec9600800c7796d19d706f007844dfc45e9703ac), it can be seen that the transaction involves 2 token swaps:

    - 25,000 DOMI for 1.154811757668969125 ETH
    - 1.154811757668969125 ETH for 3,184.355095 USDC

<br />

<img src="/dex_event_logs/question_2/screenshots/tx_details.png"/>

This means that the transaction has 2 `Swap` event logs.

<br />

- As expected, in the [Transaction Receipt Event Logs tab on Etherscan](https://etherscan.io/tx/0x5e555836bacad83ac3989dc1ec9600800c7796d19d706f007844dfc45e9703ac/#eventlog), the transaction has 2 `Swap` event logs.

<br />

<img src="/dex_event_logs/question_2/screenshots/tx_event_logs_first_swap.png"/>

<img src="/dex_event_logs/question_2/screenshots/tx_event_logs_second_swap.png"/>

<br />

- In the [Transaction Receipt Event Logs tab on Etherscan](https://etherscan.io/tx/0x5e555836bacad83ac3989dc1ec9600800c7796d19d706f007844dfc45e9703ac/#eventlog), the log with index 15 is a Swap event from [USDC/WETH Uniswap V2 pool](https://etherscan.io/address/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc). It can be seen that the pool swaps `token1` with `token0`.

- The symbol for `token0` is `USDC` on the Ethereum mainnet.
- The symbol for `token1` is `WETH` on the Ethereum mainnet.

<br />

<img src="/dex_event_logs/question_2/screenshots/tx_event_logs_second_swap.png"/>

- The data section shows that WETH tokens were swapped for USDC tokens. The amounts are in BigNumber for precision purposes and because Solidity does not support floating numbers.

```
amount0In: 0
amount1In: 1154811757668969125
amount0Out: 3184355095
amount1Out: 0
```

In order to get a human readable number, the amounts need to be divided by 10 to the power of its decimals.

For example:

```
amount0_decimals = (10 ** 18)
amount0 = 1154811757668969125 / amount0_decimals
```

<br />

- Using function `get_event_log_data` from [question_2.js](dex_event_logs/question_2/question_2.js), it can be seen that there is one `Swap` event that swaps 1.15481 WETH to 3184.35 USDC.

<br />

<img src="/dex_event_logs/question_2/screenshots/fx_get_event_log_data.png"/>

<br />

### Question 3

Quickswap, a DEX on Polygon (MATIC) allows users to swap two assets as a trade. 

For every swap transaction that is recorded on the blockchain, a swap event is emitted and stored in the network with this hash ID 0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822. 

Write the RPC API call to get all the swap events that were emitted for the block #26444465. 

Use https://polygon-rpc.com/ RPC node as a service.

<br />

**Solution**

The solution can be viewed at [question_3.js](dex_event_logs/question_3/question_3.js).

<br />

<img src="/dex_event_logs/question_3/screenshots/fx_get_swap_events.png"/>

<br />
