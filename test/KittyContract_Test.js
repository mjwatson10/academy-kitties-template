const Kittycontract = artifacts.require("Kittycontract");
const truffleAssert = require("truffle-assertions");

    contract ("Kittycontract", async function(accounts){

      it("should create a gen 0 kitty", async function(){
        let instance = await Kittycontract.deployed();
        await truffleAssert.passes(instance.createKittyGen0("84336244549310576265"));
      });

      // it("should create a kitty", async function(accounts){
      //   let instance = await Kittycontract.deployed();
      //   await truffleAssert.passes(instance._createKitty(0, 0, 0, "84336244549310576265", {from: accounts[1]}))
      // })

    })
