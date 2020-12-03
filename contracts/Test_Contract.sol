pragma solidity ^0.5.12;

import "./KittyContract.sol";
import "./Owner.sol";

contract Test is Kittycontract {

  /* function testGen0(uint _genes) public returns(bool){
    gen0Counter = 100;
    createKittyGen0(_genes);
    if(gen0Counter < CREATION_LIMIT_GEN0){
      return false;
    }else{
      return true;
    }
  } */

    function createKitty(
            uint256 _momId,
            uint256 _dadId,
            uint256 _generation,
            uint256 _genes,
            address _owner
      )public returns (uint256) {

        return _createKitty(_momId,
                            _dadId,
                            _generation,
                            _genes,
                            _owner
                            );
      }

      function addGen0KittiesToCOunter() public {
        gen0Counter = 100;

      }

      function owns(address _claimant, uint256 _tokenId) public view returns (bool){
        return _owns(_claimant, _tokenId);
      }


}
