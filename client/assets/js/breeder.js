
$(document).ready(async function(){
  await connect();
  await parentData();
})

var dadGenes, dadId, momGenes, momId, childId;


//Parents Buttons
$('#saveDad').click(async function(){
    let result = $('input[type= "radio"]:checked');
    let _birth = await birthArray();

    if (result.length > 0) {
      await chosenParent(result.val(), '.dadDisplay');
      $('#right-whisker').css('top', '10px').css('left', '-16px');
      $('#dadId').removeAttr('data-target');
      $('#clearDad').attr('disabled', false);
    } else {
      alert("Please choose one Daddy");
    }
    dadGenes = _birth[result.val()].genes;
    dadId = _birth[result.val()];
  });


$('#saveMom').click(async function(){
    let result = $('input[type= "radio"]:checked');
    let _birth = await birthArray();

    if (result.length > 0) {
      await chosenParent(result.val(), '.momDisplay');
      $('#right-whisker').css('top', '10px').css('left', '-16px');
      $('#momId').removeAttr('data-target');
      $('#clearMom').attr('disabled', false);
    } else {
      alert("Please choose one Daddy");
    }
    momGenes = _birth[result.val()].genes;
    momId = _birth[result.val()];
  });

//clear buttons
  $('#clearDad').click(function(){
    $('.dadDisplay').children().remove();
    $('#dadId').attr('data-target', '#dadModal');
    $('#clearDad').attr('disabled', true);
  });


  $('#clearMom').click(function(){
    $('.momDisplay').children().remove();
    $('#momId').attr('data-target', '#momModal');
    $('#clearMom').attr('disabled', true);
  });


  async function chosenParent(value, button){
    let _ownedKitties = await ownersArray();
    let _birth = await birthArray();

    let _imgThumb = await kittyThumbnail(value);
    let _dna = await dnaOfKitty(_ownedKitties[value]);

  displayParent = `<div id="parentChosen">${_imgThumb}
                      <br>
                     <div class="catGenes">${"DNA: " + _birth[value].genes}</div>
                      <br>
                     <div class="catGenes">${"Gen: " + _birth[value].generation}</div>
                  </div>`

        $(button).append(displayParent);
        renderKitty(_dna, value);
  }


async function parentData(){
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
            $(".parents").append(kittyCards);
            renderKitty(_dna, i);
        }
      }

  async function breedParents(_daddy, _mommy){

    if (dadGenes != momGenes) {
      instance.methods.breed(_daddy, _mommy).send({from: user}, function(error, txHash){
        if(error){
          console.log(error);
        }else {
          console.log(txHash);
          console.log(_daddy, _mommy);
        }
      });
      let array = await ownersArray();
      childId = await array.length - 1;
      alert("Let's get busy")
    }else {
      alert("You can't breed a Kitty with itself, silly!")
    }
  }

  $('#breed').click(async function(){
    await breedParents(dadId, momId);

    /*let _ownedKitties = await ownersArray();
    let _birth = await birthArray();

    let _imgThumb = await kittyThumbnail(childId);
    let _dna = await dnaOfKitty(_ownedKitties[childId]);

    displayChild = `<div id="newChild">${_imgThumb}
                        <br>
                       <div class="childGenes">${"DNA: " + _birth[value].genes}</div>
                        <br>
                       <div class="childGenes">${"Gen: " + _birth[value].generation}</div>
                    </div>`
              $('.Child').append(displayChild);
              renderKitty(_dna, childId);*/
  });
