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

      it("should get all tokens owner has put up for sale", async function(){
        await marketplaceInstance.setOffer(priceToWei, 1, {from: user});

        kittyForSale = await marketplaceInstance.getAllTokenOnSale({from: user});

        assert.equal(kittyForSale, 1);
      });

      it("should revert getOffer() function because tokenId is not for sale yet", async function(){
        await truffleAssert.fails(marketplaceInstance.getOffer(1));
      });
    });


//buying testing
    describe("buying and removing offers", async function(){
      let priceToWei;

      beforeEach(async function(){
        priceToWei = web3.utils.toWei("2", "ether");
        await kittyContractInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true, {from: user});
        await marketplaceInstance.setOffer(priceToWei, 1, {from: user});
      });

      it("should allow tokenId to be bought", async function(){
        await marketplaceInstance.buyKitty(1, {from: accounts[2], value: priceToWei});

        boughtKitty = await kittyContractInstance.getKittiesIDs(accounts[2]);

        assert.equal(boughtKitty, 1);
      });

      it("should revert buyKitty() function because msg.value does not equal price of offer", async function(){
        await truffleAssert.fails(marketplaceInstance.buyKitty(1, {from: accounts[2], value: web3.utils.toWei("1", "ether")}));
      });

      it("should revert buyKitty() function because there is NOT a current offer available for chosen kitty", async function(){
        await kittyContractInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

        await truffleAssert.fails(marketplaceInstance.buyKitty(2, {from: accounts[2], value: priceToWei}));
      });

      it("should NOT allow kitty to be bought twice", async function(){
        await marketplaceInstance.buyKitty(1, {from: accounts[2], value: priceToWei});

        await truffleAssert.fails(marketplaceInstance.buyKitty(1, {from: accounts[3], value: priceToWei}));
      });

      it("should allow a bought kitty to be breed", async function(){
        await marketplaceInstance.buyKitty(1, {from: accounts[2], value: priceToWei});

        await kittyContractInstance.createKitty(1, 1, 1, "69367694223415461144", accounts[2], {from: accounts[2]});

        await kittyContractInstance.breed(1, 2, {from: accounts[2]});
        const newKitty = await kittyContractInstance.getKitty(3);

        assert.equal(newKitty.generation.toString(10), "2");
      });

      it("should allow a breed kitty to be bought", async function(){
        await kittyContractInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});
        await kittyContractInstance.breed(1, 2, {from: user});

        await marketplaceInstance.setOffer(priceToWei, 3, {from: user});
        await marketplaceInstance.buyKitty(3, {from: accounts[2], value: priceToWei});
        boughtKitty = await kittyContractInstance.getKittiesIDs(accounts[2]);

        assert.equal(boughtKitty, 3);
      });

      it("should remove offer marketplace", async function(){
        await truffleAssert.passes(marketplaceInstance.getOffer(1));
        await marketplaceInstance.removeOffer(1, {from: user});

        await truffleAssert.fails(marketplaceInstance.getOffer(1));
      });

      it("should only remove one offer from marketplace", async function(){
        await kittyContractInstance.createKitty(1, 1, 1, "69367694223415461144", accounts[2], {from: accounts[2]});
        await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true, {from: accounts[2]});
        await marketplaceInstance.setOffer(priceToWei, 2, {from: accounts[2]});

        await marketplaceInstance.removeOffer(2, {from: accounts[2]});

        await truffleAssert.passes(marketplaceInstance.getOffer(1));
        await truffleAssert.fails(marketplaceInstance.getOffer(2));
      });

      it("should NOT allow ability to buy removed offer", async function(){
        await marketplaceInstance.removeOffer(1, {from: user});

        await truffleAssert.fails(marketplaceInstance.buyKitty(1, {from: accounts[2], value: priceToWei}));
      });

      it("should revert removeOffer() function because msg.sender is not seller of kitty offer being removed", async function(){
        await truffleAssert.fails(marketplaceInstance.removeOffer(1, {from: accounts[2]}));
      });

      it("should only remove one of the msg.sender's offers and allow remaining offer to be bought", async function(){
        await kittyContractInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});
        await marketplaceInstance.setOffer(priceToWei, 2, {from: user});
        await marketplaceInstance.removeOffer(1, {from: user});

        let offer = await marketplaceInstance.getOffer(2);
        assert.equal(offer.price, priceToWei);

        await truffleAssert.fails(marketplaceInstance.getOffer(1));

        await marketplaceInstance.buyKitty(2, {from: accounts[2], value: priceToWei});
        boughtKitty = await kittyContractInstance.getKittiesIDs(accounts[2]);

        assert.equal(boughtKitty, 2);
      });

      it("should allow a removed offer to be added back to the marketplace with a different offer", async function(){
        await truffleAssert.passes(marketplaceInstance.getOffer(1));
        await marketplaceInstance.removeOffer(1, {from: user});
        await truffleAssert.fails(marketplaceInstance.getOffer(1));

        await marketplaceInstance.setOffer(priceToWei, 1, {from: user});
        await truffleAssert.passes(marketplaceInstance.getOffer(1));
      });
    });

//owns testing
    describe("ownership", async function(){

      beforeEach(async function(){
        await kittyContractInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
      });


      it.only("should return _ownsKitty() function as TRUE", async function(){
        kittyOwner = await kittyContractInstance._ownsKitty(user, 1);

        assert.equal(kittyOwner, true);
      });

      // it.only("should return _ownsKitty() function as FALSE", async function(){
      //
      // });
    });

  });
