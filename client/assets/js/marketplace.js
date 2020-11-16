$(document).ready(async function(){
  await connect();
  await connectMarket();
  await marketplaceOp();
  await _addBuyOrCxlBtn();
});


//checking operator(person going to the marketplace) is approved to access marketplace contract, if not making them approved via metamask request
async function marketplaceOp(){
  let isApprovedOp = await instance.methods.isApprovedForAll(user, contractAddressMarket).call();

  if (isApprovedOp){
    getInventory();
  } else {
    await instance.methods.setApprovalForAll(contractAddressMarket, true).send().on('receipt', function(receipt){

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


//call to contract to get offer of kitty being sold
async function callGetOffer(_kittyId){
  let already = await instanceMarket.methods.getOffer(_kittyId).call({from: user});
  return already.tokenId;
}


//adds sell or cancel btn to owned kitties on My Kitties page
async function sellOrCancel(_kittyId){
  try{
    let check = await callGetOffer(_kittyId);

    if (check == _kittyId) {
      let cxlBtn = `<button class="cxl-offer" id="cxlKittyOffer${_kittyId}">Remove Offer</div>`
      $(`#sellOrCxl${_kittyId}`).append(cxlBtn);
    }
  } catch(err){
    console.log(err);
    let sellBtn = `<button class="sell-my-kitty" id="sellKittyBtn${_kittyId}" data-toggle="modal" data-target="#sell-modal">Sell</button>`
    $(`#sellOrCxl${_kittyId}`).append(sellBtn);
  }
  //click event to populate modal for setting price of kitty being offered
  $(`#sellKittyBtn${_kittyId}`).click(async function(){
    await modalToSellKitties(_kittyId, ".kitty-for-sale");
  });
  //click event to remove sell offer from contract
  $(`#cxlKittyOffer${_kittyId}`).click(async function(){
    await removeOffer(_kittyId);
    $(`#cxlKittyOffer${_kittyId}`).remove();
    await refresh();
  })
}


//loop for sellOrCancel() function
async function addSellOrCxlBtn(){
    let kitties = await getKittiesForOwner();

    for (var i = 0; i < kitties.length; i++) {
      const kitty = kitties[i];
      await sellOrCancel(kitty.kittyId);
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
                         <input type="text" id="price-field" value="" data-type="number" placeholder="0.01 Ether">
                         <button type="submit" class="set-kitty-price" id="submitPrice${kitty.kittyId}" data-toggle="modal" data-target="#confirm-modal">
                            <div class="sell-btn-text">Sell</div>
                         </button>
                      </div>`

      $(placement).append(displayKitty);
      //button that sets price user wants to sell their kitties for
      $(`#submitPrice${kitty.kittyId}`).click(async function(){
        let setPrice = $("#price-field").val();
        let priceToWei = web3.utils.toWei(setPrice, "ether")

        if (setPrice > 0) {
          await sellKitty(priceToWei, kitty.kittyId);
          $(`#sellKittyBtn${kitty.kittyId}`).remove();
          await refresh();
        }else {
          alert("You can't sell Kitty for 0 or negative Ether, Silly")
        }
      })

      renderKitty(_dna, value);
}


//calls contract for a specified kitty's data and it's offer details
async function saleKittyData(_kittyid){
  let saleData = await instanceMarket.methods.getOffer(_kittyid).call();
  const kittyToSell = await instance.methods.getKitty(saleData.tokenId).call();

    let imgThumb = kittyThumbnail(saleData.tokenId);
    let _dna = await dnaOfKitty(kittyToSell.genes);

        let kittyCards = `<div class="col-lg-4">
                            <div class="sell-cards" style="width: 250px;">
                                  <div class="card-body">
                                        <div>${imgThumb}
                                              <br>
                                              <div class="catGenes">${"DNA: " + kittyToSell.genes}</div>
                                               <br>
                                              <div class="catGenes">${"Gen: " + kittyToSell.generation}</div>
                                               <br>
                                              <div class="catGenes">${"Price: " + web3.utils.fromWei(saleData.price, "ether") + " Eth"}</div>
                                               <br>
                                              <div id="buyOrCxl${kitty.kittyId}"></div>
                                        </div>
                                  </div>
                              </div>
                            </div>`
            $(".kitty-inventory").append(kittyCards);
            buyAKitty(saleData.tokenId, saleData.price);
            renderKitty(_dna, saleData.tokenId);
}


//add buy or remove off btn at marketplace depending on whether the kitties are owned by user
async function buyOrCancel(_kittyId){
    let inventoryArray = await instanceMarket.methods.getAllTokenOnSale().call();

    for (var i = 0; i < inventoryArray.length; i++) {
      const kitty = inventoryArray[i];
      if (kitty.tokenId == _kittyId) {
        let cxlBtn = `<button class="cxl-offer" id="cxlKittyOffer${_kittyId}">Remove Offer</div>`
        $(`#buyOrCxl${_kittyId}`).append(cxlBtn);
      } else {
        let saleData = await instanceMarket.methods.getOffer(_kittyId).call();
        let buyBtn = `<button type="button" name="button" class="buyKittyBtn" id="buyKitty${saleData.tokenId}">Buy</button>`
        $(`#buyOrCxl${_kittyId}`).append(buyBtn);
      }
    }
}


//loop for buyOrCancel() function
async function _addBuyOrCxlBtn(){
    let kitties = await getKittiesForOwner();

    for (var i = 0; i < kitties.length; i++) {
      const kitty = kitties[i];
      await buyOrCancel(kitty.kittyId);
    }
}


//function for click event to buy kitty and call contract
async function buyAKitty(_kittyId, price){
  $(`#buyKitty${_kittyId}`).click(async function(){
    let buy = await instanceMarket.methods.buyKitty(_kittyId).send({from: user, value: price}, function(error, txHash){
      if(error){
        console.log(error);
      }else {
        console.log(txHash);
      }
    });
    refresh();
  })
}


//click event to remove kitty offer from marketplace
async function removeOffer(_kittyId){
  await instanceMarket.methods.removeOffer(_kittyId).send({from: user}, function(error, txHash){
    if(error){
      console.log(error);
    }else {
      console.log(txHash);
    }
  });
}
