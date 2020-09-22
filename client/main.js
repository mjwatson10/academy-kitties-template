
//Web3.givenProvider allows the use of whatever provider MetaMask is giving
var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0x79619ad059016F514B3a9Bae3AB4Ac7c6fC73f75";

function connect(){
  //call for metamask enable function
  return window.ethereum.enable().then(function(accounts){
      instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      user = accounts[0];

      console.log(instance);
  })
}
