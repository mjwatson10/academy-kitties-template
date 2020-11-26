pragma solidity ^0.5.12;

import "./KittyContract.sol";
import "./Owner.sol";

contract Test is Kittycontract{

  function testGen0(uint _genes) public returns(bool){
    gen0Counter = 100;
    createKittyGen0(_genes);
    if(gen0Counter < CREATION_LIMIT_GEN0){
      return false;
    }else{
      return true;
    }
  }

}
