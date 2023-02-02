// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappzada {
    string public name;
    address public owner;

    constructor(){
        name = "Dappzada";
        owner = msg.sender;
    }
}
