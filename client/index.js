
$(document).ready(function(){
  //call for metamask enable function
  window.ethereum.enable().then(function(accounts){
      instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      user = accounts[0];


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
