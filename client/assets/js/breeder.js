
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


async function parentData(){
  let ownedKitties = await ownersArray();
  let birth = await birthArray();

  for (var i = 0; i < ownedKitties.length; i++){
    let imgThumb = kittyThumbnail(i);
    let _dna = await dnaOfKitty(ownedKitties[i]);
    console.log(_dna);

        let kittyCards = `<div class="col-lg-4">
                            <label class="option_item">
                              <input type="checkbox" class="checkbox">
                                <div class="option_inner">
                                        <div class="cards" style="width: 250px;">
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
            $("#parents").append(kittyCards);
            renderKitty(_dna, i);
        }


}
