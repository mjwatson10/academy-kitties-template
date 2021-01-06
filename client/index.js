
$(document).ready(async function(){
  //call for metamask enable function
  await window.ethereum.enable().then(async function(accounts){
      const instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      const user = accounts[0];

      //birthing event
      instance.events.Birth().on('data', function(event){

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
      // .on('error', console.error)

  });

  await isOwnerAddress();
});

async function isOwnerAddress(){
  const ownerAddress = await instance.methods.getOwner().call({from: user});

  if(user != ownerAddress){
    window.location.replace("index.html");
  }
}
