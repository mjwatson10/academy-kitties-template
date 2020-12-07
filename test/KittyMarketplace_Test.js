const KittyMarketplace = artifacts.require("KittyMarketplace");
const KittyContract = artifacts.require("Kittycontract");
const ProxyContract = artifacts.require("Test");
const truffleAssert = require("truffle-assertions");

  contract ("KittyMarketplace", async function(accounts){

    const user = accounts[1];
    let kittyContractInstance;
    let marketplaceInstance;

    beforeEach(async function(){
      kittyContractInstance = await ProxyContract.new();
      marketplaceInstance = await KittyMarketplace.new(kittyContractInstance.address);
      await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true);
    });

//it.only will only run those test

//init test
    describe("init", async function(){
      it("should deploy KittyMarketplace contract", async function(){
        await truffleAssert.passes(marketplaceInstance);
      });


    });


//price testing
    describe("price", async function(){
      let priceToWei;

      beforeEach(async function(){
        priceToWei = web3.utils.toWei("2", "ether");
        await kittyContractInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true, {from: user});
      });


      it("should set offer price of kitty to sell", async function(){
        await marketplaceInstance.setOffer(priceToWei, 1, {from: user});
        let getOffer = await marketplaceInstance.getOffer(1);

        await assert.equal(priceToWei, getOffer.price);
      });

      it("should revert setOffer() function because seller is not owner", async function(){
        await truffleAssert.fails(marketplaceInstance.setOffer(priceToWei, 1, {from: accounts[2]}));
      });

      it("should revert setOffer() function because offer is already active", async function(){
        await marketplaceInstance.setOffer(priceToWei, 1, {from: user});

        await truffleAssert.fails(marketplaceInstance.setOffer(priceToWei, 1));
      });

      it("should revert setOffer() function because marketplace address not approved for acces to the _tokenId", async function(){
        await kittyContractInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: accounts[2]});

        await truffleAssert.fails(marketplaceInstance.setOffer(priceToWei, 2, {from: accounts[2]}));
      });
    });

  });
