$(document).ready(async function(){
  await connect();
  await cardsData();

})


//gets all kitties owned by user by calling getKittiesIDs from contract
async function getKittiesForOwner(){
  let myKittiesIDs = await instance.methods.getKittiesIDs(user).call({from: user});
  let allMyKitties = await getKittyData(myKittiesIDs);

  console.log("All My Kitties: " + allMyKitties);

    return allMyKitties;
}


//prints kitty image and data to page that is owned by user
async function cardsData(){
  let kitties = await getKittiesForOwner();

  for (var i = 0; i < kitties.length; i++){
    const kitty = kitties[i];
    console.log("getKittiesForOwner: " + kitty.genes);

    if(kitty != 0){
    let imgThumb = kittyThumbnail(kitty.kittyId);
    let _dna = await dnaOfKitty(kitty.genes);

        let kittyCards = `<div class="col-lg-4">
                            <div class="cards" style="width: 250px;">
                                  <div class="card-body">
                                        <div>${imgThumb}
                                              <br>
                                             <div class="catGenes">${"DNA: " + kitty.genes}</div>
                                              <br>
                                             <div class="catGenes">${"Gen: " + kitty.generation}</div>
                                        </div>
                                  </div>
                              </div>
                            </div>`
            $("#myOwnedKitties").append(kittyCards);
            renderKitty(_dna, kitty.kittyId);
        }
      }
}


//get all data getKittiesForOwner()
async function getKittyData(_kittyIDs){
  const kittyArray = [];

  for(var i = 0; i < _kittyIDs.length; i++){
    const kittyId = _kittyIDs[i];
    if(kittyId != 0){
      let kittyObject = await instance.methods.getKitty(kittyId).call({from: user});
          kittyObject.kittyId = kittyId;

          kittyArray.push(kittyObject);
        }
      }
    //console.log(kittyArray);
    return kittyArray;

}


async function getBirthData(_kittyIDs){
  const _kittyArray = [];

  for(var i = 0; i < _kittyIDs.length; i++){
    if(_kittyIDs[i] != 0){
      let _kittyObject = await instance.methods.getKitty(_kittyIDs[i]).call({from: user});
          _kittyArray.push(_kittyObject);
        }
      }
  return _kittyArray;
}

async function birthArray(){
  let myKittiesIDs = await instance.methods.getKittiesIDs(user).call({from: user});
  let allMyKitties = await getBirthData(myKittiesIDs);

  let displayKitties = [];
  for (var i = 0; i < allMyKitties.length; i++){
    if(allMyKitties[i] != 0){
        displayKitties.push(allMyKitties[i])
    }
  }
    return displayKitties;
}


function dnaOfKitty(dnaStr){
  dnaStr = dnaStr.toString();

  var _dna = {
    "headcolor" : dnaStr.substring(0,2),
    "legscolor" : dnaStr.substring(2,4),
    "eyecolor" : dnaStr.substring(4,6),
    "earcolor" : dnaStr.substring(6,8),
    "pawcolor" : dnaStr.substring(8,10),
    "bellycolor" : dnaStr.substring(10,12),
    "decorationPattern" : dnaStr.substring(12,14),
    "decorationTopcolor" : dnaStr.substring(14,16),
    "decorationBottomcolor" : dnaStr.substring(16,18),
    "animation" :  dnaStr.substring(18,19),
    "eyesShape" : dnaStr.substring(19,20)
  }
  return _dna;
}



function renderKitty(dna, id){

        _headColor(colors[dna.headcolor],dna.headcolor, id)
        _legsColor(colors[dna.legscolor],dna.legscolor, id)
        _eyeColor(colors[dna.eyecolor],dna.eyecolor, id)
        _earColor(colors[dna.earcolor],dna.earcolor, id)
        _pawColor(colors[dna.pawcolor],dna.pawcolor, id)
        _bellyColor(colors[dna.bellycolor],dna.bellycolor, id)
        _decorationVariation(dna.decorationPattern, id)
        _decorationTopColor(colors[dna.decorationTopcolor],dna.decorationTopcolor, id)
        _decorationBottomColor(colors[dna.decorationBottomcolor],dna.decorationBottomcolor, id)
        _animationVariation(dna.animation, id)
        _eyeVariation(dna.eyesShape, id)
}

function _headColor(color,code, id) {
    $(`#kitty${id} #head, #kitty${id} #body`).css('background', '#' + color)  //This changes the color of the cat
    $('#headcode').html('code: '+ code) //This updates text of the badge next to the slider
    $('#dnabody').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function _legsColor(color,code, id) {
    $(`#kitty${id} .front-leg, #kitty${id} .back-leg-right, #kitty${id} .back-leg-left, #kitty${id} .tail-display-kitties`).css('color', '#' + color).css('background', '#' + color)
    $('#legscode').html('code: '+ code)
    $('#dnalegs').html(code)
}

function _eyeColor(color,code, id) {
    $(`#kitty${id} .left-Eye, #kitty${id} .right-Eye`).css('background', '#' + color)
    $('#eyescode').html('code: '+code)
    $('#dnaeyes').html(code)
}

function _earColor(color,code, id) {
    $(`#kitty${id} .ear`).css('background', '#' + color)
    $('#earscode').html('code: '+code)
    $('#dnaears').html(code)
}

function _pawColor(color,code, id) {
    $(`#kitty${id} .inner-Ear, #kitty${id} .paws, #kitty${id} .tail-end, #kitty${id} .paws-back-left, #kitty${id} .paws-back-right`).css('background', '#' + color)
    $('#pawscode').html('code: '+code)
    $('#dnapaws').html(code)
}

function _bellyColor(color,code, id) {
    $(`#kitty${id} .lips, #kitty${id} .tummy`).css('background', '#' + color)
    $('#bellycode').html('code: '+code)
    $('#dnabelly').html(code)
}

function _decorationTopColor(color,code, id) {
    $(`#kitty${id} .stripes-top-left, #kitty${id} .stripes-top-right`).css('color', '#' + color)
    $('#topcode').html('code: '+code)
    $('#dnadecorationTop').html(code)
}

function _decorationBottomColor(color,code, id) {
    $(`#kitty${id} .stripes-bottom-left, #kitty${id} .stripes-bottom-right`).css('color', '#' + color)
    $('#bottomcode').html('code: '+code)
    $('#dnadecorationBottom').html(code)
}


function _eyeVariation(num, id) {

    $('#dnashape').html(num)
    switch (parseInt(num)) {
        case 1:
            normalEyes(id)
            $('#eyeName').html('Basic')
            break;
        case 2:
            normalEyes(id)
            $('#eyeName').html('Chill')
            eyesType1(id)
            break;
        case 3:
            normalEyes(id)
            $('#eyeName').html('Grumpy')
            eyesType2(id)
            break;
        case 4:
            normalEyes(id)
            $('#eyeName').html('Sleepy')
            eyesType3(id)
            break;
        case 5:
            normalEyes(id)
            $('#eyeName').html('Unamused')
            eyesType4(id)
            break;
        case 6:
            normalEyes(id)
            $('#eyeName').html('Bags')
            eyesType5(id)
            break;
        case 7:
            normalEyes(id)
            $('#eyeName').html('Zombie')
            eyesType6(id)
            break;
        case 8:
            normalEyes(id)
            $('#eyeName').html('Dayquil Nyquil')
            eyesType7(id)
            break;
        case 9:
            normalEyes(id)
            $('#eyeName').html('Forest Whitaker')
            eyesType8(id)
            break;
    }
}

function _decorationVariation(num, id) {
    $('#dnadecoration').html(num)
    switch (parseInt(num)) {
        case 1:
            $('#stripeName').html('Basic')
            normaldecoration(id)
            break;
        case 2:
            normaldecoration(id)
            $('#stripeName').html('Spread Top')
            stripeType1(id)
            break;
        case 3:
            normaldecoration(id)
            $('#stripeName').html('Lower Bottom')
            stripeType2(id)
            break;
        case 4:
            normaldecoration(id)
            $('#stripeName').html('Smaller Top')
            stripeType3(id)
            break;
        case 5:
            normaldecoration(id)
            $('#stripeName').html('Closer Bottom')
            stripeType4(id)
            break;
        case 6:
            normaldecoration(id)
            $('#stripeName').html('Raise Bottom')
            stripeType5(id)
            break;
        case 7:
            normaldecoration(id)
            $('#stripeName').html('Lowest Bottom')
            stripeType6(id)
            break;
        case 8:
            normaldecoration(id)
            $('#stripeName').html('Closer Top')
            stripeType7(id)
            break;
        case 9:
            normaldecoration(id)
            $('#stripeName').html('Lowest Top')
            stripeType8(id)
            break;
    }
}


function _animationVariation(num, id){
  $('#dnaanimation').html(num);
  switch (parseInt(num)) {
      case 1:
          $('#animationName').html('Head Move')
          animationType1(id);
          break;
      case 2:
          $('#animationName').html('Wiggle Nose')
          animationType2(id);
          break;
      case 3:
          $('#animationName').html('Blinking')
          animationType3(id);
          break;
      case 4:
          $('#animationName').html('Wag Tail')
          animationType4(id);
          break;
      case 5:
          $('#animationName').html('Wiggle Ears')
          animationType5(id);
          break;
      case 6:
          $('#animationName').html('Move Eyes')
          animationType6(id);
          break;
    }
}


function animationType1(id){
  resetAnimation(id);
  $(`#kitty${id} #head`).addClass("movingHead");
  $(`#kitty${id} .ears`).addClass("movingEars");
}

function animationType2(id){
  resetAnimation(id);
  $(`#kitty${id} .nose`).addClass("wigglingNose");
}

function animationType3(id){
  resetAnimation(id);
  $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).addClass("blinkingEyes");
}

function animationType4(id){
  resetAnimation(id);
  $(`#kitty${id} .tail-display-kitties`).addClass("tailwagging");
  $(`#kitty${id} .tail-end`).addClass("tailendwagging");
}

function animationType5(id){
  resetAnimation(id);
  $(`#kitty${id} .ears`).addClass("earupdown");
}

function animationType6(id){
  resetAnimation(id);
  $(`#kitty${id} .left-Eye, #kitty${id} .right-Eye`).addClass("eyesmoving");
  $(`#kitty${id} .pupils`).addClass("pupilsmoving");
  $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).addClass("blinkingEyes");
}

function resetAnimation(id){
  $(`#kitty${id} #head`).removeClass("movingHead");
  $(`#kitty${id} .ears`).removeClass("movingEars");
  $(`#kitty${id} .nose`).removeClass("wigglingNose");
  $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).removeClass("blinkingEyes");
  $(`#kitty${id} .tail`).removeClass("tailwagging");
  $(`#kitty${id} .tail-end`).removeClass("tailendwagging");
  $(`#kitty${id} .ears`).removeClass("earupdown");
  $(`#kitty${id} .left-Eye, #kitty${id} .right-Eye`).removeClass("eyesmoving");
  $(`#kitty${id} .pupils`).removeClass("pupilsmoving");
}

function normalEyes(id) {
    $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).css('border', 'none')
}

function eyesType1(id){
    $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).css('border-top', '15px solid')
}

function eyesType2(id){
    $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).css('border-top', '30px solid')
}

function eyesType3(id){
    $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).css('border-top', '45px solid')
}

function eyesType4(id){
    $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).css('border-top', '55px solid')
}

function eyesType5(id){
    $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).css('border-bottom', '15px solid')
}

function eyesType6(id){
    $(`#kitty${id} .eye-borders-left, #kitty${id} .eye-borders-right`).css('border-bottom', '30px solid')
}

function eyesType7(id){
    $(`#kitty${id} .eye-borders-right`).css('border-top', '35px solid')
}

function eyesType8(id){
    $(`#kitty${id} .eye-borders-left`).css('border-top', '35px solid')
}



function normaldecoration(id) {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $(`#kitty${id} .stripes-top-left`).css({ "top": "-55px" }).css({ "left": "70px" })
    $(`#kitty${id} .stripes-top-right`).css({ "top": "-20px" }).css({ "left": "48px" })
    $(`#kitty${id} .stripes-bottom-left`).css({ "top": "37px" }).css({ "left": "-26px" })
    $(`#kitty${id} .stripes-bottom-right`).css({ "top": "150px" }).css({ "left": "118px" })
}

function stripeType1(id){
    $(`#kitty${id} .stripes-top-left`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`#kitty${id} .stripes-top-right`).css({ "top": "-20px" }).css({ "left": "58px" })
}

function stripeType2(id){
    $(`#kitty${id} .stripes-top-left`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`#kitty${id} .stripes-top-right`).css({ "top": "-20px" }).css({ "left": "58px" })
    $(`#kitty${id} .stripes-bottom-left`).css({ "top": "42px" }).css({ "left": "-26px" })
    $(`#kitty${id} .stripes-bottom-right`).css({ "top": "155px" }).css({ "left": "118px" })
}

function stripeType3(id){
    $(`#kitty${id} .stripes-top-left`).css({ "top": "-55px" }).css({ "left": "73" })
    $(`#kitty${id} .stripes-top-right`).css({ "top": "-20px" }).css({ "left": "45px" })
    $(`#kitty${id} .stripes-bottom-left`).css({ "top": "42px" }).css({ "left": "-26px" })
    $(`#kitty${id} .stripes-bottom-right`).css({ "top": "155px" }).css({ "left": "118px" })
}

function stripeType4(id){
    $(`#kitty${id} .stripes-top-left`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`#kitty${id} .stripes-top-right`).css({ "top": "-20px" }).css({ "left": "58px" })
    $(`#kitty${id} .stripes-bottom-left`).css({ "top": "42px" }).css({ "left": "-16" })
    $(`#kitty${id} .stripes-bottom-right`).css({ "top": "155px" }).css({ "left": "108" })
}

function stripeType5(id){
    $(`#kitty${id} .stripes-top-left`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`#kitty${id} .stripes-top-right`).css({ "top": "-20px" }).css({ "left": "58px" })
    $(`#kitty${id} .stripes-bottom-left`).css({ "top": "32" }).css({ "left": "-16" })
    $(`#kitty${id} .stripes-bottom-right`).css({ "top": "145" }).css({ "left": "108" })
}

function stripeType6(id){
    $(`#kitty${id} .stripes-top-left`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`#kitty${id} .stripes-top-right`).css({ "top": "-20px" }).css({ "left": "58px" })
    $(`#kitty${id} .stripes-bottom-left`).css({ "top": "52px" }).css({ "left": "-16" })
    $(`#kitty${id} .stripes-bottom-right`).css({ "top": "165px" }).css({ "left": "108" })
}

function stripeType7(id){
    $(`#kitty${id} .stripes-top-left`).css({ "top": "-55px" }).css({ "left": "70" })
    $(`#kitty${id} .stripes-top-right`).css({ "top": "-20px" }).css({ "left": "48px" })
    $(`#kitty${id} .stripes-bottom-left`).css({ "top": "52px" }).css({ "left": "-16" })
    $(`#kitty${id} .stripes-bottom-right`).css({ "top": "165px" }).css({ "left": "108" })
}

function stripeType8(id){
    $(`#kitty${id} .stripes-top-left`).css({ "top": "-32px" }).css({ "left": "60" })
    $(`#kitty${id} .stripes-top-right`).css({ "top": "3px" }).css({ "left": "58px" })
    $(`#kitty${id} .stripes-bottom-left`).css({ "top": "32" }).css({ "left": "-16" })
    $(`#kitty${id}.stripes-bottom-right`).css({ "top": "145" }).css({ "left": "108" })
}
