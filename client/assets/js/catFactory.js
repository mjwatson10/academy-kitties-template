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

function decorationTopColor(color,code) {
    $('.stripes-top-left, .stripes-top-right').css('color', '#' + color)
    $('#topcode').html('code: '+code)
    $('#dnadecorationTop').html(code)
}

function decorationBottomColor(color,code) {
    $('.stripes-bottom-left, .stripes-bottom-right').css('color', '#' + color)
    $('#bottomcode').html('code: '+code)
    $('#dnadecorationBottom').html(code)
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
            break;
        case 2:
            normalEyes()
            $('#eyeName').html('Chill')
            eyesType1()
            break;
        case 3:
            normalEyes()
            $('#eyeName').html('Grumpy')
            eyesType2()
            break;
        case 4:
            normalEyes()
            $('#eyeName').html('Sleepy')
            eyesType3()
            break;
        case 5:
            normalEyes()
            $('#eyeName').html('Unamused')
            eyesType4()
            break;
        case 6:
            normalEyes()
            $('#eyeName').html('Bags')
            eyesType5()
            break;
        case 7:
            normalEyes()
            $('#eyeName').html('Zombie')
            eyesType6()
            break;
        case 8:
            normalEyes()
            $('#eyeName').html('Dayquil Nyquil')
            eyesType7()
            break;
        case 9:
            normalEyes()
            $('#eyeName').html('Forest Whitaker')
            eyesType8()
            break;
    }
}

function decorationVariation(num) {
    $('#dnadecoration').html(num)
    switch (num) {
        case 1:
            $('#stripeName').html('Basic')
            normaldecoration()
            break;
        case 2:
            normaldecoration()
            $('#stripeName').html('Spread Top')
            stripeType1()
            break;
        case 3:
            normaldecoration()
            $('#stripeName').html('Lower Bottom')
            stripeType2()
            break;
        case 4:
            normaldecoration()
            $('#stripeName').html('Smaller Top')
            stripeType3()
            break;
        case 5:
            normaldecoration()
            $('#stripeName').html('Closer Bottom')
            stripeType4()
            break;
        case 6:
            normaldecoration()
            $('#stripeName').html('Raise Bottom')
            stripeType5()
            break;
        case 7:
            normaldecoration()
            $('#stripeName').html('Lowest Bottom')
            stripeType6()
            break;
        case 8:
            normaldecoration()
            $('#stripeName').html('Closer Top')
            stripeType7()
            break;
        case 9:
            normaldecoration()
            $('#stripeName').html('Lowest Top')
            stripeType8()
            break;
    }
}


function animationVariation(num){
  $('dnaanimation').html(num);
  switch (num) {
      case 1:
          $('#animationName').html('Head Move')
          animationType1();
          break;
      case 2:
          animationType2();
          break;
    }
}


function animationType1(){
  resetAnimation();
  $("#head").addClass("movingHead");
  $(".ears").addClass("movingEars");
}

function animationType2(){
  resetAnimation();
}

function resetAnimation(){
  $("#head").removeClass("movingHead");
  $(".ears").removeClass("movingEars");
}

function normalEyes() {
    $('.eye-borders-left, .eye-borders-right').css('border', 'none')
}

function eyesType1(){
    $('.eye-borders-left, .eye-borders-right').css('border-top', '15px solid')
}

function eyesType2(){
    $('.eye-borders-left, .eye-borders-right').css('border-top', '30px solid')
}

function eyesType3(){
    $('.eye-borders-left, .eye-borders-right').css('border-top', '45px solid')
}

function eyesType4(){
    $('.eye-borders-left, .eye-borders-right').css('border-top', '55px solid')
}

function eyesType5(){
    $('.eye-borders-left, .eye-borders-right').css('border-bottom', '15px solid')
}

function eyesType6(){
    $('.eye-borders-left, .eye-borders-right').css('border-bottom', '30px solid')
}

function eyesType7(){
    $('.eye-borders-right').css('border-top', '35px solid')
}

function eyesType8(){
    $('.eye-borders-left').css('border-top', '35px solid')
}



function normaldecoration() {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $('.stripes-top-left').css({ "top": "-55px" }).css({ "left": "70px" })
    $('.stripes-top-right').css({ "top": "-20px" }).css({ "left": "48px" })
    $('.stripes-bottom-left').css({ "top": "37px" }).css({ "left": "-26px" })
    $('.stripes-bottom-right').css({ "top": "150px" }).css({ "left": "118px" })
}

function stripeType1(){
    $('.stripes-top-left').css({ "top": "-55px" }).css({ "left": "60" })
    $('.stripes-top-right').css({ "top": "-20px" }).css({ "left": "58px" })
}

function stripeType2(){
    $('.stripes-top-left').css({ "top": "-55px" }).css({ "left": "60" })
    $('.stripes-top-right').css({ "top": "-20px" }).css({ "left": "58px" })
    $('.stripes-bottom-left').css({ "top": "42px" }).css({ "left": "-26px" })
    $('.stripes-bottom-right').css({ "top": "155px" }).css({ "left": "118px" })
}

function stripeType3(){
    $('.stripes-top-left').css({ "top": "-55px" }).css({ "left": "73" })
    $('.stripes-top-right').css({ "top": "-20px" }).css({ "left": "45px" })
    $('.stripes-bottom-left').css({ "top": "42px" }).css({ "left": "-26px" })
    $('.stripes-bottom-right').css({ "top": "155px" }).css({ "left": "118px" })
}

function stripeType4(){
    $('.stripes-top-left').css({ "top": "-55px" }).css({ "left": "60" })
    $('.stripes-top-right').css({ "top": "-20px" }).css({ "left": "58px" })
    $('.stripes-bottom-left').css({ "top": "42px" }).css({ "left": "-16" })
    $('.stripes-bottom-right').css({ "top": "155px" }).css({ "left": "108" })
}

function stripeType5(){
    $('.stripes-top-left').css({ "top": "-55px" }).css({ "left": "60" })
    $('.stripes-top-right').css({ "top": "-20px" }).css({ "left": "58px" })
    $('.stripes-bottom-left').css({ "top": "32" }).css({ "left": "-16" })
    $('.stripes-bottom-right').css({ "top": "145" }).css({ "left": "108" })
}

function stripeType6(){
    $('.stripes-top-left').css({ "top": "-55px" }).css({ "left": "60" })
    $('.stripes-top-right').css({ "top": "-20px" }).css({ "left": "58px" })
    $('.stripes-bottom-left').css({ "top": "52px" }).css({ "left": "-16" })
    $('.stripes-bottom-right').css({ "top": "165px" }).css({ "left": "108" })
}

function stripeType7(){
    $('.stripes-top-left').css({ "top": "-55px" }).css({ "left": "70" })
    $('.stripes-top-right').css({ "top": "-20px" }).css({ "left": "48px" })
    $('.stripes-bottom-left').css({ "top": "52px" }).css({ "left": "-16" })
    $('.stripes-bottom-right').css({ "top": "165px" }).css({ "left": "108" })
}

function stripeType8(){
    $('.stripes-top-left').css({ "top": "-32px" }).css({ "left": "60" })
    $('.stripes-top-right').css({ "top": "3px" }).css({ "left": "58px" })
    $('.stripes-bottom-left').css({ "top": "32" }).css({ "left": "-16" })
    $('.stripes-bottom-right').css({ "top": "145" }).css({ "left": "108" })
}
