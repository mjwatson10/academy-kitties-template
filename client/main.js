
//Web3.givenProvider allows the use of whatever provider MetaMask is giving
var web3 = new Web3(Web3.givenProvider);

//KittyContract
var instance;
var user;
var contractAddress = "0xE1Ed047dD6a32a70a1d406acC9F9496EaA9547f1";


function connect(){
  //call for metamask enable function
  return window.ethereum.enable().then(async function(accounts){
      instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      user = accounts[0];
  })
}


//KittyMarketplace
var instanceMarket;
var contractAddressMarket = "0x66167aFEb21b865dEA05539f9d4337cD4E029F59";


function connectMarket(){
  //call for metamask enable function
  return window.ethereum.enable().then(function(accounts){
      instanceMarket = new web3.eth.Contract(abiMarketplace, contractAddressMarket, {from: accounts[0]})
      user = accounts[0];

      console.log(instanceMarket);
  })
}


function kittyThumbnail(id){

  let kittyDiv = `<div class="row" id="myCat">
                    <div class="col-lg-4">
                      <div class="cat" id="kitty${id}">
                      <div class="tail-end"></div>
                      <div class="tail-display-kitties">J</div>
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
                          </div>`;
                  return kittyDiv;
}
