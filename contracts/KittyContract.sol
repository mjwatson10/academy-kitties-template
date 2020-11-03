pragma solidity ^0.5.12;

//IECR721.sol is an interface (not a contract)
import "./IERC721.sol";
import "./IERC721Receiver.sol";
import "./Owner.sol";
import "./Safemath.sol";

contract Kittycontract is IERC721, Ownable {


        //this gets access the the library Safemath.sol
        using SafeMath for uint256;

        uint256 public constant CREATION_LIMIT_GEN0 = 100;
        uint256 public gen0Counter;
        string public constant _name = "CyberKitties";
        string public constant _symbol = "CK";

        bytes4 internal constant MAGIC_ERC721_RECEIVED = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
        bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
        bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;



//events
        /**
         * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
         */
        event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

        /**
         * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
         */
        event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

        event Birth(
              address owner,
              uint256 kittenId,
              uint256 momId,
              uint256 dadId,
              uint256 genes
            );


//struct
        struct Kitty {
          uint256 genes;
          uint64 birthTime;
          uint32 momId;
          uint32 dadId;
          uint16 generation;
        }

//array
        Kitty[] kitties;

//mapping
        mapping(uint256 => address) public kittyIndexToOwner;
        mapping(address => uint256) ownershipTokenCount;
        mapping(address => Kitty) public allOwnersKitties;
        //gives access to one token
        mapping(uint256 => address) public kittyIndexToApproved;

        //gives access to all token, ex: my address => operators address => true or false
        mapping(address => mapping(address => bool)) private _operatorApprovals;

//CONSTRUCTOR
  constructor() public {
    _createKitty(0, 0, 0, uint256(-1), address(0));
  }


//FUNCTIONS
  function supportsInterface(bytes4 _interfaceId) external view returns(bool){
    return (_interfaceId == _INTERFACE_ID_ERC721 || _interfaceId == _INTERFACE_ID_ERC165);
  }

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

        // kitties.push(_kitty) adds _kitty element to kitties array which returns size of array
        // to get proper index we must minus 1 from kitties.push(_kitty), ex: if first kitties.push(_kitty) returns 1 and to get first cat id 0 we must minus 1
        uint256 newKittenId = kitties.push(_kitty) - 1;

        emit Birth(_owner, newKittenId, _momId, _dadId, _genes);

        _transfer(address(0), _owner, newKittenId);

        return newKittenId;
    }

    function breed(uint256 _dadId, uint256 _momId) public returns(uint256){
      require(_owns(msg.sender, _dadId));
      require(_owns(msg.sender, _momId));

      // the commas(,,,) allows the function to not have to save un-need arguements, saving memory!!!
      (uint256 dadDna,,,, uint256 dadGeneration) = getKitty(_dadId);
      (uint256 momDna,,,, uint256 momGeneration) = getKitty(_momId);

      uint256 newDna = _mixDna(dadDna, momDna);

      uint childGeneration = 0;
        if(dadGeneration < momGeneration){
            childGeneration = momGeneration + 1;
            childGeneration /= 2;
        } else if(dadGeneration > momGeneration){
            childGeneration = dadGeneration + 1;
            childGeneration /= 2;
        } else{
            childGeneration = dadGeneration + 1;
        }

        _createKitty(_momId, _dadId, childGeneration, newDna, msg.sender);
    }

    function _mixDna(uint256 _dadDna, uint256 _momDna) internal returns(uint256){
      uint256[10] memory geneArray;

      uint16 random = uint16(now % 255);
      uint16 specialRandom = uint16(now % 57) + 11;
      uint256 i = 1;
      uint256 index = 9;

      for(i = 1; i <= 532; i = i * 2){
        if(random & i !=0){
          geneArray[index] = uint16(_dadDna % 100);
        } else {
          geneArray[index] = uint16(_momDna % 100);
        }
        _dadDna = _dadDna / 100;
        _momDna = _momDna / 100;

        index = index - 1;
      }

      uint256 newGene;

      for (i = 0; i < 9; i++){
          newGene = newGene + geneArray[i];
          if(i != 8){
            newGene = newGene * 100;
          } else if(i == 8){
            newGene = (newGene * 100) + specialRandom;
          }
      }
      return newGene;
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

            for (uint256 i = 0; i < kitties.length; i++) {
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

    function _owns(address _claimant, uint256 _tokenId) internal view returns(bool){
      return kittyIndexToOwner[_tokenId] == _claimant;
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
       //address(this) is the contract address
       require(to != address(this));
       require(kittyIndexToOwner[tokenId] == msg.sender);

       _transfer(msg.sender, to, tokenId);
   }

   //transfers token from original address
   function _transfer(address _from, address _to, uint256 _tokenId) internal {
       ownershipTokenCount[_to]++;

       kittyIndexToOwner[_tokenId] = _to;

       if (_from != address(0)) {
         ownershipTokenCount[_from]--;
         delete kittyIndexToApproved[_tokenId];
       }

       emit Transfer(_from, _to, _tokenId);
     }


  /// @notice Change or reaffirm the approved address for an NFT
  /// @dev The zero address indicates there is no approved address.
  ///  Throws unless `msg.sender` is the current NFT owner, or an authorized
  ///  operator of the current owner.
  /// @param _approved The new approved NFT controller
  /// @param _tokenId The NFT to approve
  function approve(address _approved, uint256 _tokenId) external{
    require(_owns(msg.sender, _tokenId));

    _approval(_tokenId, _approved);
    emit Approval(msg.sender, _approved, _tokenId);
  }

  function _approval(uint256 _tokenId, address _approved) internal {
    kittyIndexToApproved[_tokenId] = _approved;
  }

  /// @notice Enable or disable approval for a third party ("operator") to manage
  ///  all of `msg.sender`'s assets
  /// @dev Emits the ApprovalForAll event. The contract MUST allow
  ///  multiple operators per owner.
  /// @param _operator Address to add to the set of authorized operators
  /// @param _approved True if the operator is approved, false to revoke approval
  function setApprovalForAll(address _operator, bool _approved) external{
    require(_operator != msg.sender);

    _operatorApprovals[msg.sender][_operator] = _approved;
    emit ApprovalForAll(msg.sender, _operator, _approved);
  }

  /// @notice Get the approved address for a single NFT
  /// @dev Throws if `_tokenId` is not a valid NFT.
  /// @param _tokenId The NFT to find the approved address for
  /// @return The approved address for this NFT, or the zero address if there is none
  function getApproved(uint256 _tokenId) external view returns (address){
    require(_tokenId < kitties.length);

    return kittyIndexToApproved[_tokenId];
  }

  /// @notice Query if an address is an authorized operator for another address
  /// @param _owner The address that owns the NFTs
  /// @param _operator The address that acts on behalf of the owner
  /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
  function isApprovedForAll(address _owner, address _operator) public view returns (bool){
    return _operatorApprovals[_owner][_operator];
  }

  function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool){
    return kittyIndexToApproved[_tokenId] == _claimant;
  }

  /// @notice Transfers the ownership of an NFT from one address to another address
  /// @dev Throws unless `msg.sender` is the current owner, an authorized
  ///  operator, or the approved address for this NFT. Throws if `_from` is
  ///  not the current owner. Throws if `_to` is the zero address. Throws if
  ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
  ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
  ///  `onERC721Received` on `_to` and throws if the return value is not
  ///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
  /// @param _from The current owner of the NFT
  /// @param _to The new owner
  /// @param _tokenId The NFT to transfer
  /// @param data Additional data with no specified format, sent in call to `_to`
  function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) public{
    require(_isApprovedorOwner(msg.sender, _from, _to, _tokenId));

    _safeTransfer(_from, _to, _tokenId, data);
  }

  /// @notice Transfers the ownership of an NFT from one address to another address
  /// @dev This works identically to the other function with an extra data parameter,
  ///  except this function just sets data to "".
  /// @param _from The current owner of the NFT
  /// @param _to The new owner
  /// @param _tokenId The NFT to transfer
  function safeTransferFrom(address _from, address _to, uint256 _tokenId) public{
    safeTransferFrom(_from, _to, _tokenId, "");
  }

  function _safeTransfer(address _from, address _to, uint256 _tokenId, bytes memory _data) internal{
    _transfer(_from, _to, _tokenId);
    require(_checkERC721Support(_from, _to, _tokenId, _data));
  }

  /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
  ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
  ///  THEY MAY BE PERMANENTLY LOST
  /// @dev Throws unless `msg.sender` is the current owner, an authorized
  ///  operator, or the approved address for this NFT. Throws if `_from` is
  ///  not the current owner. Throws if `_to` is the zero address. Throws if
  ///  `_tokenId` is not a valid NFT.
  /// @param _from The current owner of the NFT
  /// @param _to The new owner
  /// @param _tokenId The NFT to transfer
  function transferFrom(address _from, address _to, uint256 _tokenId) external{
    require(_isApprovedorOwner(msg.sender, _from, _to, _tokenId));

    _transfer(_from, _to, _tokenId);
  }

  function _checkERC721Support(address _from, address _to, uint256 _tokenId, bytes memory _data) internal returns(bool){
    if(!_isContract(_to)){
      return true;
    }

    //call onERC721Received in the _to _isContract
    //check return value
    bytes4 returnData = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data);
    return returnData == MAGIC_ERC721_RECEIVED;
  }

  function _isContract(address _to) internal view returns(bool){
    uint32 size;
    assembly{
      size := extcodesize(_to)
    }
    return size > 0;
  }

  /// function for Requirements of transferfrom and safeTransferFrom
  function _isApprovedorOwner(address _spender, address _from, address _to, uint256 _tokenId) internal view returns(bool){
    require(_tokenId < kitties.length); //token must exist
    require(_to != address(0)); // TO address is not zero address
    require(_owns(_from, _tokenId)); //From owns the token

    //spender is from OR spender is approved for tokenId OR spener is operator for from
    return (_spender == _from || _approvedFor(_spender, _tokenId) || isApprovedForAll(_from, _spender));
  }

}
