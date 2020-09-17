pragma solidity ^0.5.12;

//IECR721.sol is an interface (not a contract)
import "./IERC721.sol";
import "./Owner.sol";
import "./Safemath.sol";

contract Kittycontract is IERC721, Ownable {


        //this gets access the the library Safemath.sol
        using SafeMath for uint256;

        uint256 public constant CREATION_LIMIT_GEN0 = 100;
        uint256 public gen0Counter;
        string public constant _name = "CyberKitties";
        string public constant _symbol = "CK";

        event Birth(
              address owner,
              uint256 kittenId,
              uint256 momId,
              uint256 dadId,
              uint256 genes
            );

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
        mapping(address => Kitty) public allOwnersKitties;



//FUNCTIONS
  function createKittyGen0(uint256 _genes) public onlyOwner returns (uint256) {
      require(gen0Counter < CREATION_LIMIT_GEN0);

      gen0Counter++;

      //in place of msg.sender we could put address(this) if instead we wanted to send the cats to the contract, that way the kitties could be sold
      return _createKitty(0, 0, 0, _genes, msg.sender);

  }

  function _createKitty(
        uint256 _momId,
        uint256 _dadId,
        uint256 _generation,
        uint256 _genes,
        address _owner
    ) private returns (uint256) {
        Kitty memory _kitty = Kitty({
          genes: _genes,
          birthTime: uint64(now),
          momId: uint32(_momId),
          dadId: uint32(_dadId),
          generation: uint16(_generation)
        });

        uint256 newKittenId = kitties.push(_kitty) - 1;

        emit Birth(_owner, newKittenId, _momId, _dadId, _genes);

        fromTransfer(address(0), _owner, newKittenId);

        return newKittenId;
    }


    function getKitty(uint256 kittyId) public view returns(
          uint256 genes,
          uint256 birthTime,
          uint256 momId,
          uint256 dadId,
          uint256 generation
        )
    {
      //storage is used to take up less space as oppose to memory because it point to the mapping instead of making a copy
              Kitty storage kitty = kitties[kittyId];

              genes = kitty.genes;
              birthTime = uint256(kitty.birthTime);
              momId = uint256(kitty.momId);
              dadId = uint256(kitty.dadId);
              generation = uint256(kitty.generation);
    }


    function getKittiesIDs(address kittyOwner) public view returns (uint256[] memory) {
        uint256 IdCount = ownershipTokenCount[kittyOwner];

        if (IdCount == 0){
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](IdCount);
            uint256 resultIndex = 0;

            for (uint256 i = 1; i < kitties.length; i++) {
                if (kittyIndexToOwner[i] == kittyOwner) {
                    result[resultIndex] = i;
                    resultIndex++;
                }
            }
         return result;
        }
    }

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
