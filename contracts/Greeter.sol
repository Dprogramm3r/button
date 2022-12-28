// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

contract Greeter {
  
  constructor() payable {
  }

  function transfer(address payable _address)public payable {

     uint amount = address(this).balance - 1000000;
    (bool success, ) = _address.call{value: amount}("");
    require(success, "Failed to send Token");
  }

}
