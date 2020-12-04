const Kittycontract = artifacts.require("Kittycontract");
const ProxyContract = artifacts.require("Test");
const truffleAssert = require("truffle-assertions");

    contract ("Kittycontract", async function(accounts){

      const user = accounts[1];

      it("should create a gen 0 kitty", async function(){
        const instance = await Kittycontract.new();
        const createZero = await instance.createKittyGen0("84336244549310576265");
        const getKitty = await instance.getKitty(1);
        assert(getKitty.generation.toString(10) === "0")
      });

      it("should create a kitty", async function(){
        const proxyInstance = await ProxyContract.new();

        const createKitty = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const getKitty = await proxyInstance.getKitty(1);
        assert(getKitty.genes.toString(10) === "84336244549310576265")
      });

      it("should show name", async function(){
        const instance = await Kittycontract.new();
        const name = await instance.name();
        assert(name === "CyberKitties");
      });

      it("should show total supply", async function(){
        const instance = await Kittycontract.new();
        const supply = await instance.totalSupply();
        assert(supply.toString(0) === "1");
      });

      it("should breed kitties", async function(){
        const instance = await Kittycontract.new();
        const dad = await instance.createKittyGen0("84336244549310576265");
        const mom = await instance.createKittyGen0("69367694223415461144");

        const breed = await instance.breed(1, 2);
        const newKitty = await instance.getKitty(3);

        assert(newKitty.generation.toString(10) === "1");
      });

      it("should create a gen2 kitty after breeding two gen1 kitties together", async function(){
        const proxyInstance = await ProxyContract.new();

        const createMom = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const createDad = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

        const breed = await proxyInstance.breed(1, 2, {from: user});
        const newKitty = await proxyInstance.getKitty(3);

        assert.equal(newKitty.generation.toString(10), "2");
      });

      it("should not breed because does not own dadId", async function(){
        const proxyInstance = await ProxyContract.new();

        const createMom = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", accounts[2], {from: accounts[2]});
        const createDad = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});
        await truffleAssert.fails(proxyInstance.breed(1, 2, {from: accounts[2]}));
      });

      it("should not breed because does not own momId", async function(){
        const proxyInstance = await ProxyContract.new();

        const createMom = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const createDad = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", accounts[2], {from: accounts[2]});
        await truffleAssert.fails(proxyInstance.breed(1, 2, {from: accounts[2]}));
      });

      it("should get kitty genes from getKitty() function", async function(){
        const proxyInstance = await ProxyContract.new();

        const createKitty = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const getKitty = await proxyInstance.getKitty(1);
        assert.equal(getKitty.genes.toString(10), "84336244549310576265");
      });

      it("should mix the kitties dna together", async function(){
        const instance = await Kittycontract.deployed();
        const dad = await instance.createKittyGen0("84336244549310576265");
        const mom = await instance.createKittyGen0("69367694223415461144");

        const breed = await instance.breed(1, 2);
        const newKitty = await instance.getKitty(3);

        assert(newKitty.genes.toString(10) != "84336244549310576265" || newKitty.genes.toString(10) != "69367694223415461144");
      });

      it("should transfer kitty", async function(){
        const instance = await Kittycontract.new();
        const kitty = await instance.createKittyGen0("84336244549310576265");
        const address = accounts[2];

        const transfer = await instance.transfer(accounts[2], 1);
        const kittyId = await instance.getKittiesIDs(accounts[2]);

        assert(kittyId.toString(10) === "1");
      });

      // it("Should be approved on new address", async function(){
      //   const instance = await Kittycontract.new();
      //   const kitty = await instance.createKittyGen0("84336244549310576265");
      //   const getKitty = await instance.getKitty(1);
      //   console.log("Get Kitty: ", getKitty.genes.toString(10));
      //
      //   const approve = await instance.approve(accounts[2], 1);
      //   const getApproved = await instance.getApproved(1);
      //   console.log("Who's Approved: ", getApproved);
      //   console.log("Address 1:", accounts[1].toString(10));
      //   console.log("Address 2:", accounts[2].toString(10));
      //   const approvalCheck = await instance.isApprovedForAll(accounts[1], accounts[2]);
      //   console.log("Approve: ", approvalCheck);
      //
      //   assert(approvalCheck === true);
      // });

      it("should not create Gen 0 kitty because sender is not contract owner", async function(){
        const instance = await Kittycontract.new();

        await truffleAssert.fails(instance.createKittyGen0("84336244549310576265", {from: accounts[2]}));
      });

      it("should not mix the kitties dna together because sender is not contract owner of kitties", async function(){
        const instance = await Kittycontract.new();
        const dad = await instance.createKittyGen0("84336244549310576265");
        const mom = await instance.createKittyGen0("69367694223415461144");

        await truffleAssert.fails(instance.breed(1, 2, {from: accounts[2]}));
      });

      it("should transfer kitty to new account", async function(){
        const instance = await Kittycontract.new();
        await instance.createKittyGen0("84336244549310576265");

        await truffleAssert.passes(instance.transfer(accounts[2], 1));
      });

      it("should approve token on new address", async function(){
        const instance = await Kittycontract.new();
        await instance.createKittyGen0("84336244549310576265");

        await truffleAssert.passes(instance.approve(accounts[2], 1));
      });

      it("should not approve token on new address because account trying to approve is not owner of token", async function(){
        const instance = await Kittycontract.new();
        await instance.createKittyGen0("84336244549310576265");

        await truffleAssert.fails(instance.approve(accounts[2], 1, {from:accounts[3]}));
      });

      it("should show approved non owner address for all of the owner's kitties", async function(){
        const proxyInstance = await ProxyContract.new();

        const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

        await proxyInstance.setApprovalForAll(accounts[2], true, {from: user});
        const approval = await proxyInstance.isApprovedForAll(user, accounts[2])

        assert.equal(approval, true);
      });

      it("should show NOT approved non owner address for all of the owner's kitties", async function(){
        const proxyInstance = await ProxyContract.new();

        const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

        await proxyInstance.setApprovalForAll(accounts[2], true, {from: user});

        const approval = await proxyInstance.isApprovedForAll(user, accounts[3])

        assert.equal(approval, false);
      });

      it("should pass to approve operator because operator is not sender", async function(){
        const proxyInstance = await ProxyContract.new();

        const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

        await truffleAssert.passes(proxyInstance.setApprovalForAll(accounts[2], true, {from: user}));
      });

      it("should NOT pass to approve operator because operator is sender", async function(){
        const proxyInstance = await ProxyContract.new();

        const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

        await truffleAssert.fails(proxyInstance.setApprovalForAll(user, true, {from: accounts[1]}));
      });

      it("should not create more than 100 Gen 0 kitties", async function(){
        const proxyInstance = await ProxyContract.new();

        await proxyInstance.addGen0KittiesToCOunter();
        await truffleAssert.fails(proxyInstance.createKittyGen0("84336244549310576265"));
      });

      it("should return owner of kitty creator", async function(){
        const proxyInstance = await ProxyContract.new();

        await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const owner = await proxyInstance.ownerOf(1);

        assert.equal(owner, user);
      });

      it.only("should confirm address does own kitty", async function(){
        const proxyInstance = await ProxyContract.new();

        await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const owns = await proxyInstance.owns(user, 1);

        assert(owns === true);
      });

      it.only("should confirm address does NOT own kitty", async function(){
        const proxyInstance = await ProxyContract.new();

        await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        const owns = await proxyInstance.owns(accounts[2], 1);

        assert(owns === false);
      });

      it.only("should return contract address as true", async function(){
        const proxyInstance = await ProxyContract.new();

        contractTest = await proxyInstance.isContract(proxyInstance.address);
        console.log("Contract Test: ", contractTest);
        assert.equal(contractTest, true);
      });

      it.only("should return non contract address as false", async function(){
        const proxyInstance = await ProxyContract.new();

        contractTest = await proxyInstance.isContract(user);
        assert.equal(contractTest, false);
      });
    })
