

$(document).ready(async function(){
  await connect();
  await printAllIDs();


})

async function printAllIDs(){
  const myKittiesIDs = await instance.methods.getKittiesIDs(user).call({from: user});
  const allMyKitties = await getKittyDNA(myKittiesIDs);

  let displayKitties = '';
  for (var i = 0; i < allMyKitties.length; i++){
        displayKitties += `<div class="card" style="width: 18rem;">
                              <div class="card-body">
                                <div>${"DNA: " + allMyKitties[i].genes}</div>
                                <div>${"Mom: " + allMyKitties[i].momId}</div>
                                <div>${"Dad: " + allMyKitties[i].dadId}</div>
                                <div>${"Gen: " + allMyKitties[i].generation}</div>
                              </div>
                          </div>`
    }
    console.log(displayKitties);
  $("#myOwnedKitties").html(displayKitties);
}

async function getKittyDNA(_kittyIDs){
  const kittyArray = [];

  for(var i = 0; i < _kittyIDs.length; i++){
      let kittyObject = await instance.methods.getKitty(_kittyIDs[i]).call({from: user});
          kittyArray.push(kittyObject);
  }
  return kittyArray;
}
