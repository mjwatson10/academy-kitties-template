
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
  console.log("hello");
  const allMyKittyIDs = instance.methods.getKittyIDs(user).call({from: user}).then(function(result){
    console.log(result);
  });
});
