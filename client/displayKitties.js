

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
$("#loadKitties").click(async function(){
  const myKittiesIDs = await instance.methods.getKittiesIDs(user).call({from: user});
  const allMyKitties = await getKittyDNA(myKittiesIDs);
  /*const displayKitties = '';

  for (var i = 0; i < allMyKitties.length; i++) {
    displayKitties += `<div>
                        ${allMyKitties[i]}
                      </div>`;
  }
  $("#myOwnedKitties").html(displayKitties); */
  $("#myOwnedKitties").html(allMyKitties[1]);
  console.log(allMyKitties[1]);
})

async function getKittyDNA(_kittyIDs){
  const kittyArray = [];

  for(var i = 0; i < _kittyIDs.length; i++){
      let kittyObject = await instance.methods.getKitty(_kittyIDs[i]).call({from: user});
          kittyArray.push(kittyObject);
  }
  return kittyArray;
}
