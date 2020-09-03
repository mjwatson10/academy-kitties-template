
//Web3.givenProvider allows the use of whatever provider MetaMask is giving
var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0xD7E54656a0dAf9ab9Cd45fcb8Ac16c96dcab9e80";

$(document).ready(function(){
  //call for metamask enable function
  window.ethereum.enable().then(function(accounts){
      instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      users = accounts[0];

      console.log(instance);

      instance.events.Birth().on('data', function(event){
        console.log(event);

        let owner = event.returnVaues.owner;
        let kittenId = event.returnVaues.kittenId;
        let momId = event.returnVaues.momId;
        let dadId = event.returnVaues.dadId;
        let genes = event.returnVaues.genes;

        $("kittyCreation").css("display", block);
        $("kittyCreation").text("owner: " + owner
                                + "kittyId: " + kiitenId
                                + "momId: " + momId
                                + "dadId: " + dadId
                                + "genes: " + genes)
      })
      .on('error', console.error)

  })
})

$("#createButton").click(function createKitty(){
  var kittyDna = getDna();
  instance.methods.createKittyGen0(kittyDna).send({}, function(error, txHash){
    if (error) {
      console.log(err);
    } else {
      console.log(txHash);
    }
  });
});
