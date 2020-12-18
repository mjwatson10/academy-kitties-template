const KittyMarketplace = artifacts.require("KittyMarketplace");
const KittyContract = artifacts.require("Kittycontract");
const ProxyContract = artifacts.require("Test");
const ProxyMarketplace = artifacts.require("MarketplaceTest");
const truffleAssert = require("truffle-assertions");

  contract ("KittyMarketplace", async function(accounts){

    const user = accounts[1];
    let kittyContractInstance;
    let marketplaceInstance;

    beforeEach(async function(){
      kittyContractInstance = await ProxyContract.new();
      marketplaceInstance = await ProxyMarketplace.new(kittyContractInstance.address);
      // proxyMarketplace = await ProxyMarketplace.new(kittyContractInstance.address);
      await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true);
    });

//it.only will only run those test

//init test
    describe("init", async function(){

      it("should deploy KittyMarketplace contract", async function(){
        const instance = await KittyMarketplace.deployed();

        assert.isOk(instance);
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
        const offer = await marketplaceInstance.setOffer(priceToWei, 1, {from: user});
        let getOffer = await marketplaceInstance.getOffer(1);

        assert.equal(priceToWei, getOffer.price);
        assert.equal(user, getOffer.seller);
        assert.equal(0, getOffer.index);
        assert.equal(1, getOffer.tokenId);
        assert.equal(true, getOffer.active);

        await truffleAssert.eventEmitted(offer, 'MarketTransaction', (ev) => {
          return ev.TxType == "Create offer" && ev.owner == user && ev.tokenId == 1;
        });
      });

      it("should get all parameters of the getOffer() function", async function(){
        await kittyContractInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});
        await kittyContractInstance.createKitty(1, 1, 1, "39647694223415461127", accounts[3], {from: accounts[3]});
        await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true, {from: accounts[3]});

        await marketplaceInstance.setOffer(priceToWei, 2, {from: user});
        await marketplaceInstance.setOffer(priceToWei, 3, {from: accounts[3]});
        await marketplaceInstance.setOffer(priceToWei, 1, {from: user});
        let getOffer = await marketplaceInstance.getOffer(1);

        assert.equal(priceToWei, getOffer.price);
        assert.equal(user, getOffer.seller);
        assert.equal("2", getOffer.index.toString(10));
        assert.equal("1", getOffer.tokenId.toString(10));
        assert.equal(true, getOffer.active);
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

      it("should get all tokens put up for sale", async function(){
        await kittyContractInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});
        await kittyContractInstance.createKitty(1, 1, 1, "39647694223415461127", accounts[3], {from: accounts[3]});
        await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true, {from: accounts[3]});

        await marketplaceInstance.setOffer(priceToWei, 1, {from: user});
        await marketplaceInstance.setOffer(priceToWei, 2, {from: user});
        await marketplaceInstance.setOffer(priceToWei, 3, {from: accounts[3]});

        const kittyOneTwoForSale = await marketplaceInstance.getAllTokenOnSale({from: user});
        const kittyThreeForSale = await marketplaceInstance.getAllTokenOnSale({from: accounts[3]});

        assert.equal(kittyOneTwoForSale[0], 1);
        assert.equal(kittyOneTwoForSale[1], 2);
        assert.equal(kittyThreeForSale[2], 3);
      });

      it("should revert getOffer() function because tokenId is not for sale yet", async function(){
        await truffleAssert.fails(marketplaceInstance.getOffer(1));
      });
    });


//buying and removing offer testing
    describe("buying and removing offers", async function(){
      let priceToWei;

      beforeEach(async function(){
        priceToWei = web3.utils.toWei("2", "ether");
        await kittyContractInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true, {from: user});
        await marketplaceInstance.setOffer(priceToWei, 1, {from: user});
      });

      it("should allow tokenId to be bought", async function(){
        const bought = await marketplaceInstance.buyKitty(1, {from: accounts[2], value: priceToWei});

        const boughtKitty = await kittyContractInstance.getKittiesIDs(accounts[2]);

        assert.strictEqual(boughtKitty[0].toString(10), "1");

        await truffleAssert.eventEmitted(bought, 'MarketTransaction', (ev) => {
          return ev.TxType == "Buy" && ev.owner == accounts[2] && ev.tokenId == 1;
        });
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
        const boughtKitty = await kittyContractInstance.getKittiesIDs(accounts[2]);

        assert.strictEqual(boughtKitty[0].toString(10), "3");
      });

      it("should remove offer marketplace", async function(){
        await truffleAssert.passes(marketplaceInstance.getOffer(1));
        const removed = await marketplaceInstance.removeOffer(1, {from: user});

        await truffleAssert.fails(marketplaceInstance.getOffer(1));

        await truffleAssert.eventEmitted(removed, 'MarketTransaction', (ev) => {
          return ev.TxType == "Removed offer" && ev.owner == user && ev.tokenId == 1;
        });
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
        const boughtKitty = await kittyContractInstance.getKittiesIDs(accounts[2]);

        assert.strictEqual(boughtKitty[0].toString(10), "2");
      });

      it("should allow a removed offer to be added back to the marketplace with a different offer", async function(){
        await truffleAssert.passes(marketplaceInstance.getOffer(1));
        await marketplaceInstance.removeOffer(1, {from: user});
        await truffleAssert.fails(marketplaceInstance.getOffer(1));

        await marketplaceInstance.setOffer(priceToWei, 1, {from: user});
        await truffleAssert.passes(marketplaceInstance.getOffer(1));
      });

      it("should show that Offer.active is FALSE in offers array", async function(){
        //await kittyContractInstance.setApprovalForAll(proxyMarketplace.address, true, {from: user});
        await marketplaceInstance.removeOffer(1, {from: user});
        const isRemoved = await marketplaceInstance.offerIsRemovedFromArray(0);

        assert.equal(isRemoved, false);
      });

      it("should subtract funds from balance from buyer", async function(){
        let balance = await web3.eth.getBalance(accounts[2]);

        await marketplaceInstance.buyKitty(1, {from: accounts[2], value: priceToWei});

        let newBalance = await web3.eth.getBalance(accounts[2]);

         assert.isBelow(parseInt(newBalance.toString(10)), parseInt(balance.toString(10)), "funds has been subract from buyer after kitty was bought");
      });

      it("should add funds to balance of seller", async function(){
        let balance = await web3.eth.getBalance(user);

        await marketplaceInstance.buyKitty(1, {from: accounts[2], value: priceToWei});

        let newBalance = await web3.eth.getBalance(user);

        assert.isAbove(parseInt(newBalance.toString(10)), parseInt(balance.toString(10)), "funds has been added to seller after kitty was bought");
      });
    });

//owns testing
    describe("ownership", async function(){

      beforeEach(async function(){
        await kittyContractInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
      });


      it("should return _ownsKitty() function as TRUE", async function(){
        kittyOwner = await marketplaceInstance.ownsKitty(user, 1);

        assert.equal(kittyOwner, true);
      });

      it("should return _ownsKitty() function as FALSE", async function(){
        kittyOwner = await marketplaceInstance.ownsKitty(accounts[2], 1);

        assert.equal(kittyOwner, false);
      });
    });

  });
