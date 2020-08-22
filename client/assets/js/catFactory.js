
//Random color
function getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor
}

function genColors(){
    var colors = []
    for(var i = 10; i < 99; i ++){
      var color = getColor()
      colors[i] = color
    }
    return colors
}

//This function code needs to modified so that it works with Your cat code.
function headColor(color,code) {
    $('#head, #body').css('background', '#' + color)  //This changes the color of the cat
    $('#headcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnabody').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function legsColor(color,code) {
    $('.front-leg, .back-leg-right, .back-leg-left, .tail').css('color', '#' + color).css('background', '#' + color)
    $('#legscode').html('code: '+code)
    $('#dnalegs').html(code)
}

function eyeColor(color,code) {
    $('.left-Eye, .right-Eye').css('background', '#' + color)
    $('#eyescode').html('code: '+code)
    $('#dnaeyes').html(code)
}

function earColor(color,code) {
    $('.ear').css('background', '#' + color)
    $('#earscode').html('code: '+code)
    $('#dnaears').html(code)
}

function pawColor(color,code) {
    $('.inner-Ear, .paws, .tail-end, .paws-back-left, .paws-back-right').css('background', '#' + color)
    $('#pawscode').html('code: '+code)
    $('#dnapaws').html(code)
}

function bellyColor(color,code) {
    $('.lips, .tummy').css('background', '#' + color)
    $('#bellycode').html('code: '+code)
    $('#dnabelly').html(code)
}

//###################################################
//Functions below will be used later on in the project
//###################################################
function eyeVariation(num) {

    $('#dnashape').html(num)
    switch (num) {
        case 1:
            normalEyes()
            $('#eyeName').html('Basic')
            break
    }
}

function decorationVariation(num) {
    $('#dnadecoration').html(num)
    switch (num) {
        case 1:
            $('#decorationName').html('Basic')
            normaldecoration()
            break
    }
}

async function normalEyes() {
    await $('.cat__eye').find('span').css('border', 'none')
}

async function normaldecoration() {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $('.cat__head-dots').css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $('.cat__head-dots_first').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $('.cat__head-dots_second').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}
