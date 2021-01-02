
$(document).ready(async function(){
  await connect();
  await parentData();
  instance.events.Birth().on('data', function(event){

    let owner = event.returnValues.owner;
    let kittenId = event.returnValues.kittenId;
    let momId = event.returnValues.momId;
    let dadId = event.returnValues.dadId;
    let genes = event.returnValues.genes;

    $(".childData").text("Owner: " + owner
                            + " || Kitten Id: " + kittenId
                            + " || Mom Id: " + momId
                            + " || Dad Id: " + dadId);

    alert("Congratulations!!! You own a new Kitty")
  })
  .on('error', console.error)
})

//State variables
  var dadGenes, dadId, momGenes, momId;


//Parents Buttons
  $('#saveDad').click(async function(){
      let result = $('input[type= "radio"]:checked');
      const kittyId = result.val();
      kitty = await getKittyContractCall(kittyId);

        if (kitty.kittyId == momId) {
          alert("Please choose a different Daddy");
      } else if (result.length > 0 || result != momId) {
          await chosenKitty(result.val(), '.dadDisplay');

          $('#dadId').removeAttr('data-target');
          $('#clearDad').attr('disabled', false);
          $('#breed').attr('disabled', false);
      }
      dadId = kitty.kittyId;
    });


  $('#saveMom').click(async function(){
      let result = $('input[type= "radio"]:checked');
      const kittyId = result.val();
      kitty = await getKittyContractCall(kittyId);

      if (kitty.kittyId == dadId) {
          alert("Please choose a different Mommy");
      } else if (result.length > 0 || result != dadId) {
          await chosenKitty(result.val(), '.momDisplay');

          $('#momId').removeAttr('data-target');
          $('#clearMom').attr('disabled', false);
          $('#breed').attr('disabled', false);
      }
      momId = kitty.kittyId;
    });

//clear buttons
  $('#clearDad').click(function(){
    $('.dadDisplay').children().remove();
    $('#newChild').remove();
    $('#dadId').attr('data-target', '#dadModal');
    $('#clearDad').attr('disabled', true);
  });


  $('#clearMom').click(function(){
    $('.momDisplay').children().remove();
    $('#newChild').remove();
    $('#momId').attr('data-target', '#momModal');
    $('#clearMom').attr('disabled', true);
  });


//Displays available kitties to breed in modals
  async function parentData(){
    let kitties = await getKittiesForOwner();

    for (var i = 0; i < kitties.length; i++){
      const kitty = kitties[i];

      if(kitty != 0){
        let imgThumb = kittyThumbnail(kitty.kittyId);
        let _dna = await dnaOfKitty(kitty.genes);

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
              $(".parents").append(kittyCards);
              renderKitty(_dna, kitty.kittyId);
          }
        }
      }


//displays kitty chosen from modal accessing
  async function chosenKitty(value, placement) {

      const kitty = await getKittyContractCall(value);

      let _imgThumb = await kittyThumbnail(value);
      let _dna = dnaOfKitty(kitty.genes);

      displayParent = `<div id="parentChosen">${_imgThumb}
                      <br>
                     <div class="catGenes">${"DNA: " + kitty.genes /*_birth[value].genes*/}</div>
                      <br>
                     <div class="catGenes">${"Gen: " + kitty.generation /*_birth[value].generation*/}</div>
                  </div>`

      $(placement).append(displayParent);
      renderKitty(_dna, value);
  }

//calls breed function from contract, returns ID of new kitten for click event for #breed button
  async function breedParents(_daddy, _mommy){

    if (dadId != momId) {
      await instance.methods.breed(_daddy, _mommy).send({from: user}, function(error, txHash){
        if(error){
          console.log(error);
        }else {
          console.log(txHash);
        }
      });
      let array = await getKittiesForOwner();

      const child = array[array.length - 1];
      childId = child.kittyId;
      $('#breed').attr('disabled', true);
    }else {
      alert("You need two different Kitties to make a Kitten, silly!")
    }
    return childId;
  }


//click event to run breedParents() functions, displays new kitten card
  $('#breed').click(async function(){
      await newChildBorn(dadId, momId);
      $('#breed').attr('disabled', true);
  });

  async function newChildBorn(parentOne, parentTwo){
    let _childId = await breedParents(parentOne, parentTwo);
    console.log("childId: ", _childId);
    console.log("Hello, Hello, Hello");

    const kitty = await instance.methods.getKitty(_childId).call({ from: user });

    let _imgThumb = await kittyThumbnail(_childId);
    let _dna = await dnaOfKitty(kitty.genes);

    displayChild = `<div id="newChild">${_imgThumb}
                        <br>
                       <div class="childGenes">${"DNA: " + kitty.genes}</div>
                        <br>
                       <div class="childGenes">${"Gen: " + kitty.generation}</div>
                    </div>`
              $('.childImg').append(displayChild);
              renderKitty(_dna, _childId);
  }
