pragma solidity ^0.5.12;

import "./KittyMarketplace.sol";


contract MarketplaceTest is KittyMarketplace{

  constructor(address _kittyContractAddress) public KittyMarketplace(_kittyContractAddress){
  }

  function ownsKitty(address _address, uint256 _tokenId) public view returns (bool){
    return _ownsKitty(_address, _tokenId);
  }

}
