

$(document).ready(function(){
  //call for metamask enable function
  window.ethereum.enable().then(function(accounts){
      instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      user = accounts[0];

      console.log(instance);



  })
})



$("#loadKitties").click(function(){
  const showKitties = [];
  instance.methods.getKittiesIDs(user).call({from: user}).then(function(error, result){
    if (error) {
      console.log(error);
    } else {
      showKitties = result;
    }
    return showKitties;
  })
})

function getKittyDNA(_kittyIDs){
  for(var i = 0; i < _kittyIDs.length; i++){
    instance.methods.getKitty(_kittyIDs[i]).call({from: user}).then(function(err, res){
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  }
}
