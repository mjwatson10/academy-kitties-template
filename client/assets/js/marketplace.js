$(document).ready(async function(){
  await connect();
  await connectMarket();
  await kittiesToSell();
  await marketplaceOp();
});


//checking operator(person going to the marketplace) is approved to access marketplace contract, if not making them approved via metamask request
async function marketplaceOp(){
  let isApprovedOp = await instance.methods.isApprovedForAll(user, contractAddressMarket).call();

  if (isApprovedOp){
    getInventory();
    console.log("is approved");
  } else {
    await instance.methods.setApprovalForAll(contractAddressMarket, true).send().on('receipt', function(receipt){

      console.log("tx done, now is approved");
      getInventory();
    })
  }
}

//displays kitties that are available to buy
async function getInventory(){
  let inventoryArray = await instanceMarket.methods.getAllTokenOnSale().call();

  for (var i = 0; i < inventoryArray.length; i++) {
    if(inventoryArray[i] != 0){
    saleKittyData(inventoryArray[i])
    }
  }
}

//modal that populates kitties that can be sold
async function kittiesToSell(){
  let kitties = await getKittiesForOwner();

  for (var i = 0; i < kitties.length; i++){
    const kitty = kitties[i];

    let imgThumb = kittyThumbnail(kitty.kittyId);
    let _dna = dnaOfKitty(kitty.genes);
    console.log("id: " + i + " data: " + kitty.kittyId);

        let kittyCards = `<div class="col-lg-4 catParent">
                            <label class="option_item">
                              <input type="radio" class="checkbox" name="radioKitty" id="kittyParent" value=${kitty.kittyId}>
                                <div class="option_inner">
                                        <div class="cards parent-cards">
                                              <div class="card-body parent-card">
                                                <div class="tickmark"></div>
                                                    <div id="parentKitty">${imgThumb}
                                                          <br>
                                                         <div class="catGenes">${"DNA: " + kitty.genes}</div>
                                                          <br>
                                                         <div class="catGenes">${"Gen: " + kitty.generation}</div>
                                                    </div>
                                              </div>
                                          </div>
                                  </div>
                              </label>
                            </div>`
            $(".availKitties").append(kittyCards);
            renderKitty(_dna, kitty.kittyId);
        }
      }



$('#sell_Kitty').click(async function(){
    let result = $('input[type= "radio"]:checked');
    const kittyId = result.val();
    let kitty = await getKittyContractCall(kittyId);
    let kittyCheck = await kittyAlreadyForSale(kitty.kittyId)
    console.log("Kitty Id: ", kitty.kittyId);
    console.log("Kitty Check: ", kittyCheck);

    if(kittyCheck == kitty.kittyId){
      alert("This Kitty is already for sale, Sorry")
    }else{
    if (result.length > 0) {
      await chosenKitty(kitty.kittyId, '.kitty-being-sold');
      }
     sellerId = kitty.kittyId;
     console.log("Seller ID: ", sellerId);
  }
})


async function callGetOffer(_kittyId){
  let already = await instanceMarket.methods.getOffer(_kittyId).call({from: user});
  return already.tokenId;
}


async function sellOrCancel(_kittyId){
  try{
    let check = await callGetOffer(_kittyId);

    if (check == _kittyId) {
      let cxlBtn = `<button class="cxl-offer" id="cxlKittyOffer${kitty.kittyId}">Remove Offer</div>`
      $(".sell-or-cancel").append(cxlBtn);
    }
  } catch(err){
    console.log(err);
    let sellBtn = `<button class="sell-my-kitty" id="sellKittyBtn${kitty.kittyId}" data-toggle="modal" data-target="#sell-modal">Sell</button>`
    $(".sell-or-cancel").append(sellBtn);
  }
}


//sends price being set for kitty being sold to contract
async function sellKitty(price, id){
    await instanceMarket.methods.setOffer(price, id).send({from: user}, function(error, txHash){
      if(error){
        console.log(error);
      }else {
        console.log(txHash);
      }
    })
}

//refreshs page
async function refresh(){
    location.reload(true);
}


//button that sets price user wants to sell their kitties for
$("#submitPrice").click(async function(){
  console.log("seller ID: " + sellerId);
  let setPrice = $("#price-field").val();

  await sellKitty(setPrice, sellerId);
  await refresh();
})


//submits price to contract
async function submitPriceForKitty(_setPrice, _kittyId){
  await sellKitty(_setPrice, _kittyId);
  await refresh();
}


//populates modal to set price of kitty you want to sell
async function modalToSellKitties(value, placement){
  const kittyID = await getKittyContractCall(value);

  let _imgThumb = await kittyThumbnail(value);
  let _dna = await dnaOfKitty(kittyID.genes);

      let displayKitty = `<div id="parentChosen">${_imgThumb}
                          <br>
                         <div class="catGenes">${"DNA: " + kittyID.genes}</div>
                          <br>
                         <div class="catGenes">${"Gen: " + kittyID.generation}</div>
                          <br>
                          <label for="currency-field" id="priceTitle">Price:</label>
                            <br>
                          <input type="text" id="price-field" value="" data-type="number" placeholder="1,000,000.00">
                          <button type="submit" class="set-kitty-price" id="submitPrice${kitty.kittyId}" data-toggle="modal" data-target="#confirm-modal">
                            <div class="sell-btn-text">Sell</div>
                          </button>
                      </div>`

      $(placement).append(displayKitty);
      $(`#submitPrice${kitty.kittyId}`).click(function(){
        sellKitty($("#price-field").val(), kitty.kittyId);
        refresh();
      })

      renderKitty(_dna, value);
}


async function saleKittyData(id){
  let saleData = await instanceMarket.methods.getOffer(id).call();
  const kittyToSell = await instance.methods.getKitty(id).call();
  console.log("getKitty ID: " + id + " Genes: " + kittyToSell.genes);

  let birth = await birthArray();
  console.log("ID: " + id + " Genes: " + birth[id].genes);
  let kitties = await getKittiesForOwner();

    let imgThumb = kittyThumbnail(id);
    let _dna = await dnaOfKitty(kittyToSell.genes);

        let kittyCards = `<div class="col-lg-2">
                            <label class="option_item">
                              <input type="radio" class="checkbox buying-kitty" name="buyRadio" id="kittyParent" value="${id}">
                                <div class="option_inner">
                                        <div class="cards" style="width: 250px;">
                                              <div class="card-body sell-cards">
                                                <div class="tickmark"></div>
                                                    <div>${imgThumb}
                                                          <br>
                                                         <div class="catGenes">${"DNA: " + kittyToSell.genes}</div>
                                                          <br>
                                                         <div class="catGenes">${"Gen: " + kittyToSell.generation}</div>
                                                          <br>
                                                         <div class="catGenes">${"Price: " + saleData.price}</div>
                                                    </div>
                                              </div>
                                          </div>
                                      </div>
                                </label>
                            </div>`
            $(".kitty-inventory").append(kittyCards);
            renderKitty(_dna, id);
}


$("#buyKittyBtn").click(async function(){
  _tokenId = $('input[name= "buyRadio"]:checked').val();

  let buy = await instanceMarket.methods.buyKitty(_tokenId).send({from: user}, function(error, txHash){
    if(error){
      console.log(error);
    }else {
      console.log(txHash);
    }
  });
});
