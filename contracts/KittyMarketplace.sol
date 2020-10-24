pragma solidity ^0.5.12;

import "./Kittycontract.sol";
import "./Owner.sol";

contract KittyMarketplace is Ownable{
    Kittycontract private _kittyContract;


    //STRUCT
    struct Offer{
      address payable seller;
      uint256 price;
      uint256 index;
      uint256 tokenId;
      bool active;
    }

    //ARRAYS
    Offer[] offers;

    //MAPPING
    mapping(uint256 => Offer) tokenIdToOffer;


    //EVENTS
    event MarketTransaction(string TxType, address owner, uint256 tokenId);


    //CONSTRUCTOR
    constructor(address _kittyContractAddress) public {
      setKittyContract(_kittyContractAddress);
    }


    //FUNCTIONS
    function setKittyContract(address _kittyContractAddress) public onlyOwner {
      _kittyContract = Kittycontract(_kittyContractAddress);
    }

    function getOffer(uint256 _tokenId) public view returns ( address seller, uint256 price, uint256 index, uint256 tokenId, bool active){
      Offer storage offer = tokenIdToOffer[_tokenId];

      return (offer.seller, offer.price, offer.index, offer.tokenId, offer.active);
    }

    function getAllTokenOnSale() public view  returns(uint256[] memory listOfOffers){
      uint256 totalOffers = offers.length;

      if(totalOffers == 0){
        return new uint256[](0);
      } else {
        uint256[] memory result = new uint256[](totalOffers);

        uint256 offerId;

        for (offerId = 0; offerId < totalOffers; offerId++) {
          if (offers[offerId].active == true){
            result[offerId] = offers[offerId].tokenId;
          }
        }
        return result;
      }
    }

    function _ownsKitty(address _address, uint256 _tokenId) internal view returns (bool){
      return (_kittyContract.ownerOf(_tokenId) == _address);
    }

    /**
    * Creates a new offer for _tokenId for the price _price.
    * Emits the MarketTransaction event with txType "Create offer"
    * Requirement: Only the owner of _tokenId can create an offer.
    * Requirement: There can only be one active offer for a token at a time.
    * Requirement: Marketplace contract (this) needs to be an approved operator when the offer is created.
     */
    function setOffer(uint256 _price, uint256 _tokenId) public {
      require(_ownsKitty(msg.sender, _tokenId), "You must own the Kitty to set an offer");
      require(tokenIdToOffer[_tokenId].active == false, "There currently is already an offer set for this Kitty");
      require(_kittyContract.isApprovedForAll(msg.sender, address(this)), "Not approved to transfer Kitty");

      Offer memory _offer = Offer({
        seller: msg.sender,
        price: _price,
        active: true,
        tokenId: _tokenId,
        index: offers.length
      });

      tokenIdToOffer[_tokenId] = _offer;
      offers.push(_offer);

      emit MarketTransaction("Create offer",msg.sender, _tokenId);
    }

    /**
    * Removes an existing offer.
    * Emits the MarketTransaction event with txType "Remove offer"
    * Requirement: Only the seller of _tokenId can remove an offer.
     */
    function removeOffer(uint256 _tokenId) public {
      Offer memory offer = tokenIdToOffer[_tokenId];
      require(offer.seller == msg.sender, "You are not selling that Kitty");

      delete offer;
      offers[offer.index].active = false;

      emit MarketTransaction("Removed offer", msg.sender, _tokenId);
    }

    /**
    * Executes the purchase of _tokenId.
    * Sends the funds to the seller and transfers the token using transferFrom in Kittycontract.
    * Emits the MarketTransaction event with txType "Buy".
    * Requirement: The msg.value needs to equal the price of _tokenId
    * Requirement: There must be an active offer for _tokenId
     */
    function buyKitty(uint256 _tokenId) public payable {
      Offer memory offer = tokenIdToOffer[_tokenId];
      require(msg.value == offer.price, "The price is incorrect");
      require(offer.active == true, "No active order currently available");

      //must delete the Kitty from the mapping BEFORE paying out to prevent RE-ENTRY ATTACKS
      delete offer;
      offers[offer.index].active = false;

      //transfer funds to seller
      //could use pull instead of push(push is what is being used below) in order to be more secure and save gas
      if (offer.price > 0){
        offer.seller.transfer(offer.price);
      }

      //transfer ownership of Kittycontract
      _kittyContract.transferFrom(offer.seller, msg.sender, _tokenId);

      emit MarketTransaction("Buy", msg.sender, _tokenId);
    }

}
