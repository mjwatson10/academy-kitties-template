
//Web3.givenProvider allows the use of whatever provider MetaMask is giving
var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0x306Ade916EAD8Cc6943BA9C53F41A743e9977020";

$(document).ready(function(){
  //call for metamask enable function
  window.ethereum.enable().then(function(accounts){
      instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      user = accounts[0];

      console.log(instance);

      instance.events.Birth().on('data', function(event){
        console.log(event);

        let owner = event.returnValues.owner;
        let kittenId = event.returnValues.kittenId;
        let momId = event.returnValues.momId;
        let dadId = event.returnValues.dadId;
        let genes = event.returnValues.genes;


        $("#kittyCreation").css("display", "block");
        $("#kittyCreation").text("Owner: " + owner
                                + " || Kitten Id: " + kittenId
                                + " || Mom Id: " + momId
                                + " || Dad Id: " + dadId
                                + " || Genes: " + genes);

        alert("Congratulations!!! You own a new Kitty")
      })
      .on('error', console.error)

  })
})

$("#createButton").click(function createKitty(){
  var kittyDna = getDna();
  instance.methods.createKittyGen0(kittyDna).send({}, function(error, txHash){
    if (error) {
      console.log(error);
    } else {
      console.log(txHash);
    }
  });
});


/*on click event(function to display all kitties(){
  access contract with getKittyIDs(user)
  loop through all IDs returned from the getKittyIDs() to get each kitty
  display each kitty on webpage
})
*/
/*$("#myKitties").click(function showMyKitties(){

const myKitties = allMyKittyIDs.mapping(
  instance.methods.getKitty(user).send({}, function(error, txHash){
    if (error) {
      console.log(error);
    } else {
      console.log(txHash);
    }
  }));
    console.log(myKitties);
}); */

$("#myKitties").click(function getOwnedKittyIDs(){
  const allMyKittyIDs = instance.methods.getKittyIDs(user).call().then({from: user}, function(result){
    console.log(result);
  });
});
