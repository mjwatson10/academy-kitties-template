

$(document).ready(async function(){
  await connect();
  await cardsData();

})

async function ownersArray(){
  let myKittiesIDs = await instance.methods.getKittiesIDs(user).call({from: user});
  let allMyKitties = await getKittyDNA(myKittiesIDs);

  let displayKitties = [];
  for (var i = 0; i < allMyKitties.length; i++){
        displayKitties.push(allMyKitties[i])
    }
    return displayKitties;
}


async function cardsData(){
  let ownedKitties = await ownersArray();

  let kittyCards = '';
  for (var i = 0; i < ownedKitties.length; i++){
        kittyCards += `<div class="card" style="width: 18rem;">
                              <div class="card-body">
                                <div>${"DNA: " + ownedKitties[i].genes}</div>
                                <div>${"Gen: " + ownedKitties[i].generation}</div>
                              </div>
                          </div>`
        }
    $("#myOwnedKitties").html(kittyCards);
}


async function cardsImage(){
    let ownedKitties = await ownersArray();
    let kittyGenes = await ownedKitties;
    let imgDna = await dnaOfKitty(ownedKitties);

    let dnaArray = [];
    for (var i = 0; i < imgDna.length; i++){
          dnaArray.push(imgDna[i].genes)
      }

    console.log(dnaArray);
    return dnaArray;

}


async function getKittyDNA(_kittyIDs){
  const kittyArray = [];

  for(var i = 0; i < _kittyIDs.length; i++){
      let kittyObject = await instance.methods.getKitty(_kittyIDs[i]).call({from: user});
          kittyArray.push(kittyObject);
  }
  return kittyArray;
}


function dnaOfKitty(dnaStr){
  var _dna = {
    "headcolor" : dnaStr.substring(0,2),
    "legscolor" : dnaStr.substring(2,4),
    "eyecolor" : dnaStr.substring(4,6),
    "earcolor" : dnaStr.substring(6,8),
    "pawcolor" : dnaStr.substring(8,10),
    "bellycolor" : dnaStr.substring(10,12),
    "eyesShape" : dnaStr.substring(12,13),
    "decorationPattern" : dnaStr.substring(13,14),
    "decorationTopcolor" : dnaStr.substring(14,16),
    "decorationBottomcolor" : dnaStr.substring(16,18),
    "animation" :  dnaStr.substring(18,19)
  }
  return _dna;
}

/*


function appendKitty(dna, id){
  let _kittyDNA = dnaOfKitty(dna);

  kittyThumbnail(id);

  _renderCat(_kittyDNA, id);


}

function dnaOfKitty(dnaStr){
  var _dna = {
    "headcolor" : dnaStr.substring(0,2),
    "legscolor" : dnaStr.substring(2,4),
    "eyecolor" : dnaStr.substring(4,6),
    "earcolor" : dnaStr.substring(6,8),
    "pawcolor" : dnaStr.substring(8,10),
    "bellycolor" : dnaStr.substring(10,12),
    "eyesShape" : dnaStr.substring(12,13),
    "decorationPattern" : dnaStr.substring(13,14),
    "decorationTopcolor" : dnaStr.substring(14,16),
    "decorationBottomcolor" : dnaStr.substring(16,18),
    "animation" :  dnaStr.substring(18,19)
  }
  return _dna;
}

function _renderCat(dna, id){

  headColor(dna.headcolor, id)
  legsColor(dna.legscolor, id)
  eyeColor(dna.eyecolor, id)
  earColor(dna.earcolor, id)
  pawColor(dna.pawcolor, id)
  bellyColor(dna.bellycolor, id)
  eyeVariation(dna.eyesShape, id)
  decorationVariation(dna.decorationPattern, id)
  decorationTopColor(dna.decorationTopcolor, id)
  decorationBottomColor(dna.decorationBottomcolor, id)
  _animationVariation(dna.animation, id)
}

function kittyThumbnail(id){
  let kittyDiv = `<div class="col-lg-4 pointer fit-content">
                  <div class="featureBox kittyDiv">

                  <div class="row">
                    <div class="col-lg-4 catBox m-2 light-b-shadow">
                      <div class="cat">


                      <div class="tail-end`+ id + `"></div>
                      <div class="tail`+ id + `">J</div>


                        <div class="ears earupdown">
                                <div class="ear`+ id + `" id="left-ear">
                                    <div class="inner-Ear`+ id + `" id="inner-left-ear"></div>
                                </div>
                                <div class="ear`+ id + `" id="right-ear">
                                    <div class="inner-Ear`+ id + `" id="inner-right-ear"></div>
                                </div>
                        </div>

                        <div id="body`+ id + `">
                                <div class="tummy`+ id + `"></div>

                                <div class="back-legs">
                                    <div class="back-leg-left`+ id + `">
                                        <div class="paws-back-left`+ id + `"></div>
                                    </div>
                                    <div class="back-leg-right`+ id + `">
                                        <div class="paws-back-right`+ id + `"></div>
                                    </div>
                                </div>

                                <div class="front-legs">
                                    <div class="front-leg`+ id + `">
                                        <div class="paws`+ id + `"></div>
                                    </div>
                                    <div class="front-leg`+ id + `">
                                        <div class="paws`+ id + `"></div>
                                    </div>
                                </div>
                          </div>

                          <div id="head`+ id + `">
                              <div class="stripes">
                                <div class="stripes-top-left`+ id + `">~</div>
                                <div class="stripes-top-right`+ id + `">~</div>
                                <div class="stripes-bottom-left`+ id + `">~</div>
                                <div class="stripes-bottom-right`+ id + `">~</div>
                              </div>
                                <div class="eyes">
                                    <div class="eye">
                                        <div class="left-Eye eyesmoving`+ id + `">
                                            <div class="pupils pupilsmoving"></div>
                                            <div class="eye-borders-left"></div>
                                        </div>
                                    </div>
                                    <div class="eye">
                                        <div class="right-Eye eyesmoving`+ id + `">
                                            <div class="pupils pupilsmoving"></div>
                                            <div class="eye-borders-right"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mouth">
                                    <div class="jaw"></div>
                                    <div class="lips`+ id + `">
                                        <div class="whiskers" id="right-whisker">///</div>
                                    </div>
                                    <div class="lips">
                                        <div class="whiskers" id="left-whisker">///</div>
                                    </div>
                                </div>

                                <div class="nose">
                                    <div class="left-nose"></div>
                                    <div class="right-nose"></div>
                                </div>
                            </div>
                  </div>
                </div>
              </div>`

          $("#myOwnedKitties").append(kittyDiv);
}
*/
