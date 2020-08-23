var colors = Object.values(allColors())

var defaultDNA = {
    "headcolor" : 36,
    "legscolor" : 36,
    "eyecolor" : 66,
    "earcolor" : 36,
    "pawcolor" : 13,
    "bellycolor" :13,
    //Cattributes
    "eyesShape" : 1,
    "decorationPattern" : 1,
    "decorationTopcolor" : 13,
    "decorationBottomcolor" : 13,
    "animation" :  1,
    "lastNum" :  1
    }

// when page load
$( document ).ready(function() {
  $('#dnabody').html(defaultDNA.headColor);
  $('#dnalegs').html(defaultDNA.legsColor);
  $('#dnaeyes').html(defaultDNA.eyeColor);
  $('#dnaears').html(defaultDNA.earColor);
  $('#dnapaws').html(defaultDNA.pawColor);
  $('#dnabelly').html(defaultDNA.bellyColor);

  $('#dnashape').html(defaultDNA.eyeVariation)
  $('#dnadecoration').html(defaultDNA.decorationVariation)
  $('#dnadecorationTop').html(defaultDNA.decorationTopcolor)
  $('#dnadecorationBottom').html(defaultDNA.decorationBottomcolor)
  $('#dnaanimation').html(defaultDNA.animation)
  $('#dnaspecial').html(defaultDNA.lastNum)

  renderCat(defaultDNA)
});

function getDna(){
    var dna = ''
    dna += $('#dnabody').html()
    dna += $('#dnalegs').html()
    dna += $('#dnaeyes').html()
    dna += $('#dnaears').html()
    dna += $('#dnapaws').html()
    dna += $('#dnabelly').html()
    dna += $('#dnashape').html()
    dna += $('#dnatopdecoration').html()
    dna += $('#dnadecorationTop').html()
    dna += $('#dnadecorationBottom').html()
    dna += $('#dnaanimation').html()
    dna += $('#dnaspecial').html()

    return parseInt(dna)
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
    eyeVariation(colors[dna.eyesShape],dna.eyesShape)
    $('#eyeshape').val(dna.eyesShape)
    decorationVariation(colors[dna.decorationPattern],dna.decorationPattern)
    $('#stripeshape').val(dna.decorationPattern)
    decorationTopColor(colors[dna.decorationTopcolor],dna.decorationTopcolor)
    $('#stripe_top_color').val(dna.decorationTopcolor)
    decorationBottomColor(colors[dna.decorationBottomcolor],dna.decorationBottomcolor)
    $('#stripe_bottom_color').val(dna.decorationBottomcolor)
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
