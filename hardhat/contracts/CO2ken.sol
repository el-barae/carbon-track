// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CO2ken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Carbon Credit", "CO2") Ownable(initialOwner) {
        _mint(initialOwner, 1000 * 10 ** decimals());
    }
}
