pragma solidity ^0.5.12;

//IECR721.sol is an interface (not a contract)
import "./IERC721.sol";
import "./Owner.sol";
import "./Safemath.sol";

contract Kittycontract is IERC721, Ownable {


        //this gets access the the library Safemath.sol
        using SafeMath for uint256;

        string public constant _name = "CyberKitties";
        string public constant _symbol = "CK";

        struct Kitty {
          uint256 genes;
          uint64 birthTime;
          uint32 momId;
          uint32 dadId;
          uint16 generation;
        }

        Kitty[] kitties;

        mapping(uint256 => address) public kittyIndexToOwner;
        mapping(address => uint256) ownershipTokenCount;


  /**
   * @dev Returns the number of tokens in ``owner``'s account.
   */
  function balanceOf(address owner) external view returns (uint256 balance){
    return ownershipTokenCount[owner];
  }

  /*
   * @dev Returns the total number of tokens in circulation.
   */
  function totalSupply() external view returns (uint256 total){
    return kitties.length;
  }

  /*
   * @dev Returns the name of the token.
   */
  function name() external view returns (string memory tokenName){
    return _name;
  }

  /*
   * @dev Returns the symbol of the token.
   */
  function symbol() external view returns (string memory tokenSymbol){
    return _symbol;
  }

  /**
   * @dev Returns the owner of the `tokenId` token.
   *
   * Requirements:
   *
   * - `tokenId` must exist.
   */
  function ownerOf(uint256 tokenId) external view returns (address owner){
    require(tokenId < kitties.length);

    return kittyIndexToOwner[tokenId];
  }

  /* @dev Transfers `tokenId` token from `msg.sender` to `to`.
  *
  *
  * Requirements:
  *
  * - `to` cannot be the zero address.
  * - `to` can not be the contract address.
  * - `tokenId` token must be owned by `msg.sender`.
  *
  * Emits a {Transfer} event.
  */
 function transfer(address to, uint256 tokenId) external{
   require(to != address(0));
   //address(this) is the contract addres
   require(to != address(this));
   require(kittyIndexToOwner[tokenId] == msg.sender);

   fromTransfer(msg.sender, to, tokenId);
 }

 //transfers token from original address
 function fromTransfer(address _from, address _to, uint256 _tokenId) internal {
   ownershipTokenCount[_to]++;

   kittyIndexToOwner[_tokenId] = _to;

   if (_from != address(0)) {
     ownershipTokenCount[_from]--;
   }

   emit Transfer(_from, _to, _tokenId);
 }





}
