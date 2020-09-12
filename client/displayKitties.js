

$(document).ready(function(){
  //call for metamask enable function
  window.ethereum.enable().then(function(accounts){
      instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      user = accounts[0];

      console.log(instance);



  })
})

/*on click event(function to display all kitties(){
  access contract with getKittyIDs(user)
  loop through all IDs returned from the getKittyIDs() to get each kitty
  display each kitty on webpage
})
*/
$("#loadKitties").click(function(){
  instance.methods.getKittiesIDs(user).call({from: user}).then(function(result){
      getKittyDNA(result);
  })
})

function getKittyDNA(_kittyIDs){
  for(var i = 0; i < _kittyIDs.length; i++){
    instance.methods.getKitty(_kittyIDs[i]).call({from: user}).then(function(res){
        console.log(res);
    });
  }
}
