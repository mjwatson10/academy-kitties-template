
//Web3.givenProvider allows the use of whatever provider MetaMask is giving
var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0xCE0f5036F6e0Ce7669FfC0f7a39a30C0B462F7D4";

async function connect(){
  //call for metamask enable function
  return window.ethereum.enable().then(function(accounts){
      instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      user = accounts[0];

      console.log(instance);
  })
}
