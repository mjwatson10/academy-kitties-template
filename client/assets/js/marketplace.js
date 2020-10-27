$(document).ready(async function(){
  await connect();
  await connectMarket();
  await kittiesToSell();
  await sellingArray();
});

var sellingId;

async function kittiesToSell(){
  let ownedKitties = await ownersArray();
  let birth = await birthArray();

  for (var i = 0; i < ownedKitties.length; i++){
    let imgThumb = kittyThumbnail(i);
    let _dna = await dnaOfKitty(ownedKitties[i]);

        let kittyCards = `<div class="col-lg-4 catParent">
                            <label class="option_item">
                              <input type="radio" class="checkbox" name="radioKitty" id="kittyParent" value=${i}>
                                <div class="option_inner">
                                        <div class="cards parent-cards">
                                              <div class="card-body parent-card">
                                                <div class="tickmark"></div>
                                                    <div id="parentKitty">${imgThumb}
                                                          <br>
                                                         <div class="catGenes">${"DNA: " + birth[i].genes}</div>
                                                          <br>
                                                         <div class="catGenes">${"Gen: " + birth[i].generation}</div>
                                                    </div>
                                              </div>
                                          </div>
                                  </div>
                              </label>
                            </div>`
            $(".availKitties").append(kittyCards);
            renderKitty(_dna, i);
        }
      }


$('#sell_Kitty').click(async function(){
    let result = $('input[type= "radio"]:checked');
    let _birth = await birthArray();

    if (result.length > 0) {
      await chosenKitty(result.val(), '.kitty-being-sold');
      }
     sellerId = result.val();
  });


async function sellingArray(){
  let alreadyForSell = await instanceMarket.methods.getAllTokenOnSale().call({from: userMarket});

  return alreadyForSell;
  console.log(alreadyForSell);
}

async function sellKitty(price, id){
  let already = await sellingArray;

  if (id == already) {
    alert("This Kitty is already for sell")
  } else {
    await instanceMarket.methods.setOffer(price, id).send({from: userMarket}, function(error, txHash){
      if(error){
        console.log(error);
      }else {
        console.log(txHash);
      }
    })
  }
}


$("#submitPrice").click(async function(){
  let setPrice = $("#price-field").val();

  await sellKitty(setPrice, sellerId);
  await sellingKitties(sellerId, ".allKittiesBeingSold", setPrice);


    alert(setPrice);
    console.log(sellerId);
})


async function sellingKitties(value, placement, price){
  let _ownedKitties = await ownersArray();
  let _birth = await birthArray();

  let _imgThumb = await kittyThumbnail(value);
  let _dna = await dnaOfKitty(_ownedKitties[value]);

displayParent = `<div id="parentChosen">${_imgThumb}
                    <br>
                   <div class="catGenes">${"DNA: " + _birth[value].genes}</div>
                    <br>
                   <div class="catGenes">${"Gen: " + _birth[value].generation}</div>
                    <br>
                   <div class="catGenes">${"Price: " + price}</div>
                    <br>
                   <button id="buyKittyBtn">Buy</button>
                </div>`

      $(placement).append(displayParent);
      renderKitty(_dna, value);
}
