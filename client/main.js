
//Web3.givenProvider allows the use of whatever provider MetaMask is giving
var web3 = new Web3(Web3.givenProvider);

var instance;
var user;
var contractAddress = "0x490633f201F9f4e6F7bC94fC25A607d0f9E00A33";

function connect(){
  //call for metamask enable function
  return window.ethereum.enable().then(function(accounts){
      instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
      user = accounts[0];

      console.log(instance);
  })
}


function kittyThumbnail(id){

  let kittyDiv = `<div class="row">
                    <div class="col-lg-4 catBox m-2 light-b-shadow">
                      <div class="cat">
                      <div class="tail-end ${id}"></div>
                      <div class="tail ${id}">J</div>
                        <div class="ears earupdown">
                                <div class="ear ${id}" id="left-ear">
                                    <div class="inner-Ear ${id}" id="inner-left-ear"></div>
                                </div>
                                <div class="ear ${id}" id="right-ear">
                                    <div class="inner-Ear ${id}" id="inner-right-ear"></div>
                                </div>
                        </div>
                        <div id="body ${id}">
                                <div class="tummy ${id}"></div>
                                <div class="back-legs">
                                    <div class="back-leg-left ${id}">
                                        <div class="paws-back-left ${id}"></div>
                                    </div>
                                    <div class="back-leg-right ${id}">
                                        <div class="paws-back-right ${id}"></div>
                                    </div>
                                </div>
                                <div class="front-legs">
                                    <div class="front-leg ${id}">
                                        <div class="paws ${id}"></div>
                                    </div>
                                    <div class="front-leg ${id}">
                                        <div class="paws ${id}"></div>
                                    </div>
                                </div>
                          </div>
                          <div id="head ${id}">
                              <div class="stripes">
                                <div class="stripes-top-left ${id}">~</div>
                                <div class="stripes-top-right ${id}">~</div>
                                <div class="stripes-bottom-left ${id}">~</div>
                                <div class="stripes-bottom-right ${id}">~</div>
                              </div>
                                <div class="eyes">
                                    <div class="eye">
                                        <div class="left-Eye ${id} eyesmoving">
                                            <div class="pupils pupilsmoving"></div>
                                            <div class="eye-borders-left"></div>
                                        </div>
                                    </div>
                                    <div class="eye">
                                        <div class="right-Eye ${id} eyesmoving">
                                            <div class="pupils pupilsmoving"></div>
                                            <div class="eye-borders-right"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mouth">
                                    <div class="jaw"></div>
                                    <div class="lips ${id}">
                                        <div class="whiskers" id="right-whisker">///</div>
                                    </div>
                                    <div class="lips ${id}">
                                        <div class="whiskers" id="left-whisker">///</div>
                                    </div>
                                </div>
                                <div class="nose">
                                    <div class="left-nose"></div>
                                    <div class="right-nose"></div>
                                </div>
                            </div>
                          </div>`
                  return kittyDiv;
}
