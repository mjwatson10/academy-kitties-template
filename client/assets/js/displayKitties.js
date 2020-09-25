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
  let birth = await birthArray();

  for (var i = 0; i < ownedKitties.length; i++){
    let imgThumb = kittyThumbnail(i);
    let _dna = await dnaOfKitty(ownedKitties[i]);

        let kittyCards = `<div class="card" style="width: 18rem;">
                              <div class="card-body">
                                    <div>${imgThumb}</div>

                                    <div>${"DNA: " + birth[i].genes}
                                          <br>
                                         ${"Gen: " + birth[i].generation}
                                    </div>
                              </div>
                          </div>`
            $("#myOwnedKitties").append(kittyCards);
            renderKitty(_dna, i);
        }

}


async function getKittyDNA(_kittyIDs){
  const kittyArray = [];

  for(var i = 0; i < _kittyIDs.length; i++){
      let kittyObject = await instance.methods.getKitty(_kittyIDs[i]).call({from: user});
          kittyArray.push(kittyObject.genes);
  }
  console.log(kittyArray);
  return kittyArray;

}


async function getBirthData(_kittyIDs){
  const _kittyArray = [];

  for(var i = 0; i < _kittyIDs.length; i++){
      let _kittyObject = await instance.methods.getKitty(_kittyIDs[i]).call({from: user});
          _kittyArray.push(_kittyObject);
  }
  console.log("hello " + _kittyArray);
  return _kittyArray;
}

async function birthArray(){
  let myKittiesIDs = await instance.methods.getKittiesIDs(user).call({from: user});
  let allMyKitties = await getBirthData(myKittiesIDs);

  let displayKitties = [];
  for (var i = 0; i < allMyKitties.length; i++){
        displayKitties.push(allMyKitties[i])
    }
    return displayKitties;
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



function renderKitty(dna, id){

        _headColor(colors[dna.headcolor],dna.headcolor, id)
        _legsColor(colors[dna.legscolor],dna.legscolor, id)
        _eyeColor(colors[dna.eyecolor],dna.eyecolor, id)
        _earColor(colors[dna.earcolor],dna.earcolor, id)
        _pawColor(colors[dna.pawcolor],dna.pawcolor, id)
        _bellyColor(colors[dna.bellycolor],dna.bellycolor, id)
        _eyeVariation(dna.eyesShape, id)
        _decorationVariation(dna.decorationPattern, id)
        _decorationTopColor(colors[dna.decorationTopcolor],dna.decorationTopcolor, id)
        _decorationBottomColor(colors[dna.decorationBottomcolor],dna.decorationBottomcolor, id)
        _animationVariation(dna.animation, id)
}

function _headColor(color,code, id) {
    $(`#head ${id}, #body ${id}`).css('background', '#' + color)  //This changes the color of the cat
    $('#headcode').html('code: '+ code) //This updates text of the badge next to the slider
    $('#dnabody').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function _legsColor(color,code, id) {
    $(`.front-leg ${id}, .back-leg-right ${id}, .back-leg-left ${id}, .tail ${id}`).css('color', '#' + color).css('background', '#' + color)
    $('#legscode').html('code: '+ code)
    $('#dnalegs').html(code)
}

function _eyeColor(color,code, id) {
    $(`.left-Eye ${id}, .right-Eye ${id}`).css('background', '#' + color)
    $('#eyescode').html('code: '+code)
    $('#dnaeyes').html(code)
}

function _earColor(color,code, id) {
    $(`.ear ${id}`).css('background', '#' + color)
    $('#earscode').html('code: '+code)
    $('#dnaears').html(code)
}

function _pawColor(color,code, id) {
    $(`.inner-Ear ${id}, .paws ${id}, .tail-end ${id}, .paws-back-left ${id}, .paws-back-right ${id}`).css('background', '#' + color)
    $('#pawscode').html('code: '+code)
    $('#dnapaws').html(code)
}

function _bellyColor(color,code, id) {
    $(`.lips ${id}, .tummy ${id}`).css('background', '#' + color)
    $('#bellycode').html('code: '+code)
    $('#dnabelly').html(code)
}

function _decorationTopColor(color,code, id) {
    $(`.stripes-top-left ${id}, .stripes-top-right ${id}`).css('color', '#' + color)
    $('#topcode').html('code: '+code)
    $('#dnadecorationTop').html(code)
}

function _decorationBottomColor(color,code, id) {
    $(`.stripes-bottom-left ${id}, .stripes-bottom-right ${id}`).css('color', '#' + color)
    $('#bottomcode').html('code: '+code)
    $('#dnadecorationBottom').html(code)
}


function _eyeVariation(num, id) {

    $('#dnashape').html(num)
    switch (num) {
        case 1:
            normalEyes()
            $('#eyeName').html('Basic')
            break;
        case 2:
            normalEyes()
            $('#eyeName').html('Chill')
            eyesType1(id)
            break;
        case 3:
            normalEyes()
            $('#eyeName').html('Grumpy')
            eyesType2(id)
            break;
        case 4:
            normalEyes()
            $('#eyeName').html('Sleepy')
            eyesType3(id)
            break;
        case 5:
            normalEyes()
            $('#eyeName').html('Unamused')
            eyesType4(id)
            break;
        case 6:
            normalEyes()
            $('#eyeName').html('Bags')
            eyesType5(id)
            break;
        case 7:
            normalEyes()
            $('#eyeName').html('Zombie')
            eyesType6(id)
            break;
        case 8:
            normalEyes()
            $('#eyeName').html('Dayquil Nyquil')
            eyesType7(id)
            break;
        case 9:
            normalEyes()
            $('#eyeName').html('Forest Whitaker')
            eyesType8(id)
            break;
    }
}

function _decorationVariation(num, id) {
    $('#dnadecoration').html(num)
    switch (num) {
        case 1:
            $('#stripeName').html('Basic')
            normaldecoration()
            break;
        case 2:
            normaldecoration()
            $('#stripeName').html('Spread Top')
            stripeType1(id)
            break;
        case 3:
            normaldecoration()
            $('#stripeName').html('Lower Bottom')
            stripeType2(id)
            break;
        case 4:
            normaldecoration()
            $('#stripeName').html('Smaller Top')
            stripeType3(id)
            break;
        case 5:
            normaldecoration()
            $('#stripeName').html('Closer Bottom')
            stripeType4(id)
            break;
        case 6:
            normaldecoration()
            $('#stripeName').html('Raise Bottom')
            stripeType5(id)
            break;
        case 7:
            normaldecoration()
            $('#stripeName').html('Lowest Bottom')
            stripeType6(id)
            break;
        case 8:
            normaldecoration()
            $('#stripeName').html('Closer Top')
            stripeType7(id)
            break;
        case 9:
            normaldecoration()
            $('#stripeName').html('Lowest Top')
            stripeType8(id)
            break;
    }
}


function _animationVariation(num, id){
  $('#dnaanimation').html(num);
  switch (num) {
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
  resetAnimation();
  $(`#head ${id}`).addClass("movingHead");
  $(`.ears ${id}`).addClass("movingEars");
}

function animationType2(id){
  resetAnimation();
  $(`.nose ${id}`).addClass("wigglingNose");
}

function animationType3(id){
  resetAnimation();
  $(`.eye-borders-left ${id}, .eye-borders-right ${id}`).addClass("blinkingEyes");
}

function animationType4(id){
  resetAnimation();
  $(`.tail ${id}`).addClass("tailwagging");
  $(`.tail-end ${id}`).addClass("tailendwagging");
}

function animationType5(id){
  resetAnimation();
  $(`.ears ${id}`).addClass("earupdown");
}

function animationType6(id){
  resetAnimation();
  $(`.left-Eye ${id}, .right-Eye ${id}`).addClass("eyesmoving");
  $(`.pupils ${id}`).addClass("pupilsmoving");
  $(`.eye-borders-left ${id}, .eye-borders-right ${id}`).addClass("blinkingEyes");
}

function resetAnimation(){
  $("#head").removeClass("movingHead");
  $(".ears").removeClass("movingEars");
  $(".nose").removeClass("wigglingNose");
  $(".eye-borders-left, .eye-borders-right").removeClass("blinkingEyes");
  $(".tail").removeClass("tailwagging");
  $(".tail-end").removeClass("tailendwagging");
  $(".ears").removeClass("earupdown");
  $(".left-Eye, .right-Eye").removeClass("eyesmoving");
  $(".pupils").removeClass("pupilsmoving");
}

function normalEyes(id) {
    $(`.eye-borders-left ${id}, .eye-borders-right ${id}`).css('border', 'none')
}

function eyesType1(id){
    $(`.eye-borders-left ${id}, .eye-borders-right ${id}`).css('border-top', '15px solid')
}

function eyesType2(id){
    $(`.eye-borders-left ${id}, .eye-borders-right ${id}`).css('border-top', '30px solid')
}

function eyesType3(id){
    $(`.eye-borders-left ${id}, .eye-borders-right ${id}`).css('border-top', '45px solid')
}

function eyesType4(id){
    $(`.eye-borders-left ${id}, .eye-borders-right ${id}`).css('border-top', '55px solid')
}

function eyesType5(id){
    $(`.eye-borders-left ${id}, .eye-borders-right ${id}`).css('border-bottom', '15px solid')
}

function eyesType6(id){
    $(`.eye-borders-left ${id}, .eye-borders-right ${id}`).css('border-bottom', '30px solid')
}

function eyesType7(id){
    $(`.eye-borders-right ${id}`).css('border-top', '35px solid')
}

function eyesType8(id){
    $(`.eye-borders-left ${id}`).css('border-top', '35px solid')
}



function normaldecoration() {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $(`.stripes-top-left`).css({ "top": "-55px" }).css({ "left": "70px" })
    $(`.stripes-top-right`).css({ "top": "-20px" }).css({ "left": "48px" })
    $(`.stripes-bottom-left`).css({ "top": "37px" }).css({ "left": "-26px" })
    $(`.stripes-bottom-right`).css({ "top": "150px" }).css({ "left": "118px" })
}

function stripeType1(id){
    $(`.stripes-top-left ${id}`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`.stripes-top-right ${id}`).css({ "top": "-20px" }).css({ "left": "58px" })
}

function stripeType2(id){
    $(`.stripes-top-left ${id}`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`.stripes-top-right ${id}`).css({ "top": "-20px" }).css({ "left": "58px" })
    $(`.stripes-bottom-left ${id}`).css({ "top": "42px" }).css({ "left": "-26px" })
    $(`.stripes-bottom-right ${id}`).css({ "top": "155px" }).css({ "left": "118px" })
}

function stripeType3(id){
    $(`.stripes-top-left ${id}`).css({ "top": "-55px" }).css({ "left": "73" })
    $(`.stripes-top-right ${id}`).css({ "top": "-20px" }).css({ "left": "45px" })
    $(`.stripes-bottom-left ${id}`).css({ "top": "42px" }).css({ "left": "-26px" })
    $(`.stripes-bottom-right ${id}`).css({ "top": "155px" }).css({ "left": "118px" })
}

function stripeType4(id){
    $(`.stripes-top-left ${id}`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`.stripes-top-right ${id}`).css({ "top": "-20px" }).css({ "left": "58px" })
    $(`.stripes-bottom-left ${id}`).css({ "top": "42px" }).css({ "left": "-16" })
    $(`.stripes-bottom-right ${id}`).css({ "top": "155px" }).css({ "left": "108" })
}

function stripeType5(id){
    $(`.stripes-top-left ${id}`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`.stripes-top-right ${id}`).css({ "top": "-20px" }).css({ "left": "58px" })
    $(`.stripes-bottom-left ${id}`).css({ "top": "32" }).css({ "left": "-16" })
    $(`.stripes-bottom-right ${id}`).css({ "top": "145" }).css({ "left": "108" })
}

function stripeType6(id){
    $(`.stripes-top-left ${id}`).css({ "top": "-55px" }).css({ "left": "60" })
    $(`.stripes-top-right ${id}`).css({ "top": "-20px" }).css({ "left": "58px" })
    $(`.stripes-bottom-left ${id}`).css({ "top": "52px" }).css({ "left": "-16" })
    $(`.stripes-bottom-right ${id}`).css({ "top": "165px" }).css({ "left": "108" })
}

function stripeType7(id){
    $(`.stripes-top-left ${id}`).css({ "top": "-55px" }).css({ "left": "70" })
    $(`.stripes-top-right ${id}`).css({ "top": "-20px" }).css({ "left": "48px" })
    $(`.stripes-bottom-left ${id}`).css({ "top": "52px" }).css({ "left": "-16" })
    $(`.stripes-bottom-right ${id}`).css({ "top": "165px" }).css({ "left": "108" })
}

function stripeType8(id){
    $(`.stripes-top-left ${id}`).css({ "top": "-32px" }).css({ "left": "60" })
    $(`.stripes-top-right ${id}`).css({ "top": "3px" }).css({ "left": "58px" })
    $(`.stripes-bottom-left ${id}`).css({ "top": "32" }).css({ "left": "-16" })
    $(`.stripes-bottom-right ${id}`).css({ "top": "145" }).css({ "left": "108" })
}
