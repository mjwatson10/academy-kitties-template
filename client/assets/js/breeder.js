
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
    let kitties = await getKittiesForOwner();

    if (result.length > 0) {
      await chosenKitty(result.val(), '.dadDisplay');
      const kitty = kitties[result.val()];

      $('#dadId').removeAttr('data-target');
      $('#clearDad').attr('disabled', false);
      $('#breed').attr('disabled', false);
      dadId = kitty;
      console.log("DadId: " + kitties);
    } else {
      alert("Please choose one Daddy");
    }
  });


$('#saveMom').click(async function(){
    let result = $('input[type= "radio"]:checked');
    let kitties = await getKittiesForOwner();
    const kitty = kitties[result.val()];

    if (result.length > 0) {
      await chosenKitty(result.val(), '.momDisplay');

      $('#momId').removeAttr('data-target');
      $('#clearMom').attr('disabled', false);
      $('#breed').attr('disabled', false);
    } else {
      alert("Please choose one Daddy");
    }
    momId = kitty;
    console.log("MomId: " + kitty);
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


//Displays available kitties to breed
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

      const kitty = await instance.methods.getKitty(value).call({ from: user });

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
      console.log("Chosen Genes: " + kitty.genes);
  }


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
      childId = await array.length - 1;
      console.log(childId);
      $('#breed').attr('disabled', true);
    }else {
      alert("You need two different Kitties to make a Kitten, silly!")
    }
    return childId;
  }

  $('#breed').click(async function(){
    let _childId = await breedParents(dadId, momId);
    console.log("Child ID: " + _childId);

    const kitty = await instance.methods.getKitty(_childId).call({ from: user });
    console.log("New Kitty: " + kitty.genes);

    let _imgThumb = await kittyThumbnail(_childId);
    let _dna = await dnaOfKitty(kitty.genes);

    displayChild = `<div id="newChild">${_imgThumb}
                        <br>
                       <div class="childGenes">${"DNA: " + kitty.genes}</div>
                        <br>
                       <div class="childGenes">${"Gen: " + kitty.generation}</div>
                    </div>`
              $('.childImg').append(displayChild);
              await renderKitty(_dna, _childId);
  });
