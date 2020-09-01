pragma solidity ^0.5.12;

//IECR721.sol is an interface (not a contract)
import "./IECR721.sol";

contract Kittycontract is IECR721 {

  string public constant name = "CyberKitties";
  string public constant symbol = "CK";

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
    return name;
  }

}
