
$(document).ready(async function(){
  await connect();
  await parentData();

})

//pop-ups for breeding selection
/*$("#dadId").click(function(){
  $(".modal").css("display", "flex")
});

$("#momId").click(function(){
  $(".modal").css("display", "flex")
});

$(".close").click(function(){
  $("modal").css("display", "none")
});

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
});*/

//Parents Buttons
$('#saveButton').click(async function(){
    let result = $('input[type= "checkbox"]:checked');

    if (result.length > 0 && result.length < 2) {
      await chosenParent(result.val(), '.dadDisplay');
      $('#right-whisker').css('top', '10px').css('left', '-16px');
      $('#saveButton').attr("data-dismiss","modal");
      console.log("daddy");
    } else {
      alert("Please choose one Daddy");
    }
  });


  $(document).ready(async function(){
    $('#saveButton').click(async function(){
      let result = $('input[type= "checkbox"]:checked');

      if (result.length > 0 && result.length < 2) {
        await chosenParent(result.val(), '.momDisplay');
        $('#right-whisker').css('top', '10px').css('left', '-16px');
        $('#saveButton').attr("data-dismiss","modal");
        console.log("mommy");
      } else {
        alert("Please choose one Daddy");
      }
    });
  });


  async function chosenParent(value, button){
    let _ownedKitties = await ownersArray();
    let _birth = await birthArray();

    let _imgThumb = await kittyThumbnail(value);
    let _dna = await dnaOfKitty(_ownedKitties[value]);

  displayParent = `<div id="parentKitty">${_imgThumb}
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
    console.log(_dna);

        let kittyCards = `<div class="col-lg-4 catParent">
                            <label class="option_item">
                              <input type="checkbox" class="checkbox" id="kittyParent" value=${i}>
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
