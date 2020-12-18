pragma solidity ^0.5.12;

import "./KittyMarketplace.sol";


contract MarketplaceTest is KittyMarketplace{

  constructor(address _kittyContractAddress) public KittyMarketplace(_kittyContractAddress){
  }

  function ownsKitty(address _address, uint256 _tokenId) public view returns (bool){
    return _ownsKitty(_address, _tokenId);
  }  

  //checks to verify that offers array has changed the struct element Offer.active to false
  function offerIsRemovedFromArray(uint256 _index) public view returns(bool){
    return offers[_index].active;
  }
}
