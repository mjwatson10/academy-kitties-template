

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
  //let imgThumb = kittyThumbnail();
  //let _dna = await spreadDna();

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


async function spreadDna(){
    let ownedKitties = await ownersArray();

    let dnaArray = [];
    for (var i = 0; i < ownedKitties.length; i++){
      let imgDna = await dnaOfKitty(ownedKitties[i].genes);

          dnaArray.push(imgDna);

      }
      return renderCat(dnaArray);
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
*/
function kittyThumbnail(){
  let kittyDiv = `<div class="row">
                    <div class="col-lg-4 catBox m-2 light-b-shadow">
                      <div class="cat">


                      <div class="tail-end"></div>
                      <div class="tail">J</div>


                        <div class="ears earupdown">
                                <div class="ear" id="left-ear">
                                    <div class="inner-Ear" id="inner-left-ear"></div>
                                </div>
                                <div class="ear" id="right-ear">
                                    <div class="inner-Ear" id="inner-right-ear"></div>
                                </div>
                        </div>

                        <div id="body">
                                <div class="tummy"></div>

                                <div class="back-legs">
                                    <div class="back-leg-left">
                                        <div class="paws-back-left"></div>
                                    </div>
                                    <div class="back-leg-right">
                                        <div class="paws-back-right"></div>
                                    </div>
                                </div>

                                <div class="front-legs">
                                    <div class="front-leg">
                                        <div class="paws"></div>
                                    </div>
                                    <div class="front-leg">
                                        <div class="paws"></div>
                                    </div>
                                </div>
                          </div>

                          <div id="head">
                              <div class="stripes">
                                <div class="stripes-top-left">~</div>
                                <div class="stripes-top-right">~</div>
                                <div class="stripes-bottom-left">~</div>
                                <div class="stripes-bottom-right">~</div>
                              </div>
                                <div class="eyes">
                                    <div class="eye">
                                        <div class="left-Eye eyesmoving">
                                            <div class="pupils pupilsmoving"></div>
                                            <div class="eye-borders-left"></div>
                                        </div>
                                    </div>
                                    <div class="eye">
                                        <div class="right-Eye eyesmoving">
                                            <div class="pupils pupilsmoving"></div>
                                            <div class="eye-borders-right"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mouth">
                                    <div class="jaw"></div>
                                    <div class="lips">
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
                          </div>`

          $("#myOwnedKitties").append(kittyDiv);
}
