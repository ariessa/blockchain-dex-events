# 🦎 Blockchain DEX Events

## Contract Calls Knowledge

**Question**

Using https://polygon-rpc.com/ RPC node as a service, write the code and RPC call to obtain totalSupply of the MANA token issued on the Polygon (MATIC) blockchain. You may consider using the ERC-20 ABI for your solution.

** You may approach the above natively or with a library such as Ethereum.rb, web3js, or ethers

<br/>

**Solution**

The solution can be viewed at [contract_calls_knowledge.js](contract_calls_knowledge/contract_calls_knowledge.js).

<br />

## DEX Event Logs

### Question 1

Using the Etherscan block explorer, find a list of recent swaps for the following USDC/ETH pool on Uniswap V2.

Provide a screenshot for your response.

<br />

**Solution**

- The contract address for `USDC/WETH` pool on Uniswap V2 is `0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc`. This can be confirmed by the value of its `token0` and `token1`. The result of function `get_token_pair_details` from [question_1.js](dex_event_logs/question_1/question_1.js) shows that:

    <img src="/dex_event_logs/question_1/screenshots/get_token_pair_details.png"/>

    - The address for `token0` is `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`. This is known as USDC on the Ethereum mainnet.

    - The address for `token1` is `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`. This is known as WETH on the Ethereum mainnet.
    insert here

<br />

- In [Etherscan's Contract tab](https://etherscan.io/address/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc#code) for the `USDC/WETH` pool, it can be seen that the contract `UniswapV2Pair` inherits from interface `IUniswapV2Pair`. 

    <img src="/dex_event_logs/question_1/screenshots/contract_inheritance.png"/>

    <img src="/dex_event_logs/question_1/screenshots/swap_event_in_contract.png"/>

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

- In [Etherscan's Contract tab](https://etherscan.io/address/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc#code) for the `USDC/WETH` pool, it can be seen that the `function swap()` inside contract `UniswapV2Pair` will emit `Swap` event upon a successful swap.

<img src="/dex_event_logs/question_1/screenshots/swap_function_in_contract.png"/>

<br />

- Inside [question_1.js](dex_event_logs/question_1/), function `get_hex_signature` with the canonical text signature of `Swap(address,uint256,uint256,uint256,uint256,address)` as input results in `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822`. This is the hex signature for `Swap` event.

<img src="/dex_event_logs/question_1/screenshots/get_hex_signature.png"/>

<br />

- To further confirm that the hex signature for `Swap` event is `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822`, a search at the [Ethereum Signature Database's event signature page](https://www.4byte.directory/event-signatures) can be performed.

<br />

- As expected, in [Ethereum Signature Database's event signature page](https://www.4byte.directory/event-signatures/?bytes_signature=0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822), searching for an event signature with hex `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822` results in ID 75 of the following text signature:

```
Swap(address,uint256,uint256,uint256,uint256,address)
```

<img src="/dex_event_logs/question_1/screenshots/ethereum_signature_database_result.png"/>

<br />

- In [Etherscan's Events tab](https://etherscan.io/address/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc#events) for the `USDC/WETH` pool, it can be seen that the `event Swap(address,uint256,uint256,uint256,uint256,address)` has `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822` as its event signature. The `topic0` of every event is its event signature in hex.

<img src="/dex_event_logs/question_1/screenshots/event_logs.png"/>

<br />

- In [Etherscan's Events tab](https://etherscan.io/address/0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc#events) for the `USDC/WETH` pool, filtering the logs by `0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822` results in a list of recent swaps.

<img src="/dex_event_logs/question_1/screenshots/recent_swaps.png"/>

<br />
