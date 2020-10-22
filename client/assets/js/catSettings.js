var colors = Object.values(allColors())

var defaultDNA = {
    "headcolor" : 36,
    "legscolor" : 36,
    "eyecolor" : 66,
    "earcolor" : 36,
    "pawcolor" : 13,
    "bellycolor" :13,
    //Cattributes
    "decorationPattern" : 11,
    "decorationTopcolor" : 13,
    "decorationBottomcolor" : 13,
    "eyesShape" : 1,
    "animation" :  3,
    "lastNum" :  1
    }

// when page load
$( document ).ready(function() {
  renderCat(defaultDNA);
  homepageCat();
});

function homepageCat(){
  let _img = kittyThumbnail(0);

  $('.homepageKitty').append(_img);

  resetAnimation();
  $(".eye-borders-left, .eye-borders-right").addClass("blinkingEyes");
}

function getDna(){
    var dna = ''
    dna += $('#dnabody').html()
    dna += $('#dnalegs').html()
    dna += $('#dnaeyes').html()
    dna += $('#dnaears').html()
    dna += $('#dnapaws').html()
    dna += $('#dnabelly').html()
    dna += $('#dnadecoration').html()
    dna += $('#dnadecorationTop').html()
    dna += $('#dnadecorationBottom').html()
    dna += $('#dnashape').html()
    dna += $('#dnaanimation').html()
    dna += $('#dnaspecial').html()

    return dna;
}


function renderCat(dna){
    headColor(colors[dna.headcolor],dna.headcolor)
    $('#bodycolor').val(dna.headcolor)
    legsColor(colors[dna.legscolor],dna.legscolor)
    $('#tailcolor').val(dna.legscolor)
    eyeColor(colors[dna.eyecolor],dna.eyecolor)
    $('#eyes_color').val(dna.eyecolor)
    earColor(colors[dna.earcolor],dna.earcolor)
    $('#ears_color').val(dna.earcolor)
    pawColor(colors[dna.pawcolor],dna.pawcolor)
    $('#paws_color').val(dna.pawcolor)
    bellyColor(colors[dna.bellycolor],dna.bellycolor)
    $('#belly_color').val(dna.bellycolor)
    decorationVariation(dna.decorationPattern)
    $('#stripeshape').val(dna.decorationPattern)
    decorationTopColor(colors[dna.decorationTopcolor],dna.decorationTopcolor)
    $('#stripe_top_color').val(dna.decorationTopcolor)
    decorationBottomColor(colors[dna.decorationBottomcolor],dna.decorationBottomcolor)
    $('#stripe_bottom_color').val(dna.decorationBottomcolor)
    eyeVariation(dna.eyesShape)
    $('#eyeshape').val(dna.eyesShape)
    animationVariation(dna.animation)
    $("#animation").val(dna.animation)
}

// Changing cat colors
$('#bodycolor').change(()=>{
    var colorVal = $('#bodycolor').val()
    headColor(colors[colorVal],colorVal)
})

$('#tailcolor').change(()=>{
    var colorVal = $('#tailcolor').val()
    legsColor(colors[colorVal],colorVal)
})

$('#eyes_color').change(()=>{
    var colorVal = $('#eyes_color').val()
    eyeColor(colors[colorVal],colorVal)
})

$('#ears_color').change(()=>{
    var colorVal = $('#ears_color').val()
    earColor(colors[colorVal],colorVal)
})

$('#paws_color').change(()=>{
    var colorVal = $('#paws_color').val()
    pawColor(colors[colorVal],colorVal)
})

$('#belly_color').change(()=>{
    var colorVal = $('#belly_color').val()
    bellyColor(colors[colorVal],colorVal)
})

$('#eyeshape').change(()=>{
    var shape = parseInt($('#eyeshape').val())
    eyeVariation(shape)
})

$('#stripeshape').change(()=>{
    var shape = parseInt($('#stripeshape').val())
    decorationVariation(shape)
})

$('#stripe_top_color').change(()=>{
    var colorVal = $('#stripe_top_color').val()
    decorationTopColor(colors[colorVal],colorVal)
})

$('#stripe_bottom_color').change(()=>{
    var colorVal = $('#stripe_bottom_color').val()
    decorationBottomColor(colors[colorVal],colorVal)
})

$('#animation').change(()=>{
    var animationVal = parseInt( $('#animation').val() )
    animationVariation(animationVal)
})

//button functions
function getRandomDNA(){
  var randomDNA = {
      "headcolor" : Math.floor(Math.random() * 89) + 10,
      "legscolor" : Math.floor(Math.random() * 89) + 10,
      "eyecolor" : Math.floor(Math.random() * 89) + 10,
      "earcolor" : Math.floor(Math.random() * 89) + 10,
      "pawcolor" : Math.floor(Math.random() * 89) + 10,
      "bellycolor" :Math.floor(Math.random() * 89) + 10,
      "eyesShape" : Math.floor(Math.random() * 10) + 1,
      "decorationPattern" : Math.floor(Math.random() * 10) + 10,
      "decorationTopcolor" : Math.floor(Math.random() * 89) + 10,
      "decorationBottomcolor" : Math.floor(Math.random() * 89) + 10,
      "animation" :  Math.floor(Math.random() * 6) + 1,
      "lastNum" :  Math.floor(Math.random() * 10) + 1
      }
      return randomDNA;
}

$("#randomButton").click(function randomCat(){
  const randomDNA = getRandomDNA();
    renderCat(randomDNA)
})

$("#defaultButton").click(function defaultCat(){
    renderCat(defaultDNA);
})
