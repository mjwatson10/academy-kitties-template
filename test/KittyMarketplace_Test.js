const KittyMarketplace = artifacts.require("KittyMarketplace");
const KittyContract = artifacts.require("Kittycontract");
const ProxyContract = artifacts.require("Test");
const truffleAssert = require("truffle-assertions");

  contract ("KittyMarketplace", async function(accounts){

    const user = accounts[1];

    beforeEach(async function(){
      kittyContractInstance = await ProxyContract.new();
      marketplaceInstance = await KittyMarketplace.new(kittyContractInstance.address);
      await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true);
    });

    it("should deploy KittyMarketplace contract", async function(){
      await truffleAssert.passes(marketplaceInstance);
    });

//it.only will only run those test
    it("should set offer price of kitty to sell", async function(){
      let priceToWei = web3.utils.toWei("2", "ether");
      await kittyContractInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
      await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true, {from: user});

      let getId = await kittyContractInstance.getKittiesIDs(user, {from: user});
      let getKitty = await kittyContractInstance.getKitty(1);
      let owner = await kittyContractInstance.ownerOf(1);
      let approval = await kittyContractInstance.isApprovedForAll(user, marketplaceInstance.address);

      await marketplaceInstance.setOffer(priceToWei, 1, {from: user});

      let getOffer = await marketplaceInstance.getOffer(1);

      await assert.equal(priceToWei, getOffer.price);
    });

    it("should not set offer price of kitty to sell because seller is not owner", async function(){
      let priceToWei = web3.utils.toWei("2", "ether");
      await kittyContractInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
      await kittyContractInstance.setApprovalForAll(marketplaceInstance.address, true, {from: user});

      let getId = await kittyContractInstance.getKittiesIDs(user, {from: user});
      let getKitty = await kittyContractInstance.getKitty(1);
      let owner = await kittyContractInstance.ownerOf(1);
      let approval = await kittyContractInstance.isApprovedForAll(user, marketplaceInstance.address);

      await truffleAssert.fails(marketplaceInstance.setOffer(priceToWei, 1));
    });
  });
