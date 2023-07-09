// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

contract Ticketing {
    uint data;

    function store(uint number) public {
        data = number;
    }

    function get() public view returns (uint) {
        return data;
    }
}
