pragma solidity ^0.5.12;

import "./KittyContract.sol";
import "./Owner.sol";

contract Test is Kittycontract {

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

      function isContract(address _to) public view returns (bool){
        return _isContract(_to);
      }

      function checkERC721Support(address _from, address _to, uint256 _tokenId) public returns(bool){
        return _checkERC721Support(_from, _to, _tokenId, "");
      }

      function isApprovedorOwner(address _spender, address _from, address _to, uint256 _tokenId) public view returns(bool){
        return _isApprovedorOwner(_spender, _from, _to, _tokenId);
      }

}
