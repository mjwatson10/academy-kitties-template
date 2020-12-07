const Kittycontract = artifacts.require("Kittycontract");
const ProxyContract = artifacts.require("Test");
const truffleAssert = require("truffle-assertions");

    contract ("Kittycontract", async function(accounts){

      const user = accounts[1];
      let proxyInstance;

      beforeEach(async function(){
        proxyInstance = await ProxyContract.new();
      });


//init test
      describe("init", async function(){
        it("should show name", async function(){
          const name = await proxyInstance.name();
          assert(name === "CyberKitties");
        });

        it("should show total supply", async function(){
          const supply = await proxyInstance.totalSupply();
          assert(supply.toString(0) === "1");
        });

        it("should return contract address as true", async function(){

          let contractTest = await proxyInstance.isContract(proxyInstance.address);
          assert.equal(contractTest, true);
        });

        it("should return non contract address as false", async function(){

          let contractTest = await proxyInstance.isContract(user);
          assert.equal(contractTest, false);
        });

        // it.only("should be ERC721 supported because _to address is NOT a contract address", async function(){
        //   await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
        //
        //   let supported = await proxyInstance._checkERC721Support(user, accounts[2], 1, )
        // });
      });


//creating kitties test
      describe("creating kitties", async function(){
        it("should create a gen 0 kitty", async function(){

          const createZero = await proxyInstance.createKittyGen0("84336244549310576265");
          const getKitty = await proxyInstance.getKitty(1);
          assert(getKitty.generation.toString(10) === "0")
        });

        it("should not create Gen 0 kitty because sender is not contract owner", async function(){

          await truffleAssert.fails(proxyInstance.createKittyGen0("84336244549310576265", {from: accounts[2]}));
        });

        it("should create a kitty", async function(){

          const createKitty = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const getKitty = await proxyInstance.getKitty(1);
          assert(getKitty.genes.toString(10) === "84336244549310576265")
        });

        it("should get kitty genes from getKitty() function", async function(){

          const createKitty = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const getKitty = await proxyInstance.getKitty(1);
          assert.equal(getKitty.genes.toString(10), "84336244549310576265");
        });

        it("should create a gen2 kitty after breeding two gen1 kitties together", async function(){

          const createMom = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const createDad = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

          const breed = await proxyInstance.breed(1, 2, {from: user});
          const newKitty = await proxyInstance.getKitty(3);

          assert.equal(newKitty.generation.toString(10), "2");
        });

        it("should not create more than 100 Gen 0 kitties", async function(){

          await proxyInstance.addGen0KittiesToCOunter();
          await truffleAssert.fails(proxyInstance.createKittyGen0("84336244549310576265"));
        });
      });


//breeding test
      describe("breeding", async function(){
        it("should breed kitties", async function(){
          const dad = await proxyInstance.createKittyGen0("84336244549310576265");
          const mom = await proxyInstance.createKittyGen0("69367694223415461144");

          const breed = await proxyInstance.breed(1, 2);
          const newKitty = await proxyInstance.getKitty(3);

          assert(newKitty.generation.toString(10) === "1");
        });

        it("should have correct momId", async function(){
          const dad = await proxyInstance.createKittyGen0("84336244549310576265");
          const mom = await proxyInstance.createKittyGen0("69367694223415461144");

          const breed = await proxyInstance.breed(1, 2);
          const newKitty = await proxyInstance.getKitty(3);

          assert.equal(newKitty.momId.toString(10), "2")
        });

        it("should have correct dadId", async function(){
          const dad = await proxyInstance.createKittyGen0("84336244549310576265");
          const mom = await proxyInstance.createKittyGen0("69367694223415461144");

          const breed = await proxyInstance.breed(1, 2);
          const newKitty = await proxyInstance.getKitty(3);

          assert.equal(newKitty.dadId.toString(10), "1")
        });

        it("should NOT breed because does not own dadId", async function(){

          const createMom = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", accounts[2], {from: accounts[2]});
          const createDad = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});
          await truffleAssert.fails(proxyInstance.breed(1, 2, {from: accounts[2]}));
        });

        it("should NOT breed because does not own momId", async function(){

          const createMom = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const createDad = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", accounts[2], {from: accounts[2]});
          await truffleAssert.fails(proxyInstance.breed(1, 2, {from: accounts[2]}));
        });

        it("should mix the kitties dna together", async function(){

          const dad = await proxyInstance.createKittyGen0("84336244549310576265");
          const mom = await proxyInstance.createKittyGen0("69367694223415461144");

          const breed = await proxyInstance.breed(1, 2);
          const newKitty = await proxyInstance.getKitty(3);

          assert(newKitty.genes.toString(10) != "84336244549310576265" || newKitty.genes.toString(10) != "69367694223415461144");
        });

        it("should not mix the kitties dna together because sender is not contract owner of kitties", async function(){

          const dad = await proxyInstance.createKittyGen0("84336244549310576265");
          const mom = await proxyInstance.createKittyGen0("69367694223415461144");

          await truffleAssert.fails(proxyInstance.breed(1, 2, {from: accounts[2]}));
        });
      });


//owner test
      describe("owner", async function(){
        it("should return owner of kitty creator", async function(){

          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const owner = await proxyInstance.ownerOf(1);

          assert.equal(owner, user);
        });

        it("should confirm address does own kitty", async function(){

          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const owns = await proxyInstance.owns(user, 1);

          assert(owns === true);
        });

        it("should confirm address does NOT own kitty", async function(){

          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const owns = await proxyInstance.owns(accounts[2], 1);

          assert(owns === false);
        });
      });


//transfer test
      describe("transfers", async function(){
        it("should transfer kitty", async function(){

          const kitty = await proxyInstance.createKittyGen0("84336244549310576265");
          const address = accounts[2];

          const transfer = await proxyInstance.transfer(accounts[2], 1);
          const kittyId = await proxyInstance.getKittiesIDs(accounts[2]);

          assert(kittyId.toString(10) === "1");
        });

        it("should transfer kitty to new account", async function(){

          await proxyInstance.createKittyGen0("84336244549310576265");

          await truffleAssert.passes(proxyInstance.transfer(accounts[2], 1));
        });

        // it("should revert transfer() function because to address is contract address", async function(){
        //
        // });
      });


//approval testing
      describe("approval", async function(){
        it("should approve token on new address", async function(){

          await proxyInstance.createKittyGen0("84336244549310576265");

          await truffleAssert.passes(proxyInstance.approve(accounts[2], 1));
        });

        it("should not approve token on new address because account trying to approve is not owner of token", async function(){

          await proxyInstance.createKittyGen0("84336244549310576265");

          await truffleAssert.fails(proxyInstance.approve(accounts[2], 1, {from:accounts[3]}));
        });

        it("should show approved for non owner address for all of the owner's kitties", async function(){

          const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

          await proxyInstance.setApprovalForAll(accounts[2], true, {from: user});
          const approval = await proxyInstance.isApprovedForAll(user, accounts[2])

          assert.equal(approval, true);
        });

        it("should show NOT approved non owner address for all of the owner's kitties", async function(){

          const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

          await proxyInstance.setApprovalForAll(accounts[2], true, {from: user});

          const approval = await proxyInstance.isApprovedForAll(user, accounts[3])

          assert.equal(approval, false);
        });

        it("should pass to approve operator because operator is not sender", async function(){

          const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

          await truffleAssert.passes(proxyInstance.setApprovalForAll(accounts[2], true, {from: user}));
        });

        it("should NOT pass to approve operator because operator is sender", async function(){

          const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

          await truffleAssert.fails(proxyInstance.setApprovalForAll(user, true, {from: accounts[1]}));
        });

        it("should pass _isApprovedorOwner() function because _from is owner of _tokenId", async function(){
          const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          let approved = await proxyInstance.isApprovedorOwner(user, user, accounts[2], 1);
          assert.equal(approved, true);
        });

        it("should return _isApprovedorOwner() function as false because _spender is NOT approved to access _tokenId", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          await proxyInstance.setApprovalForAll(accounts[2], true, {from: user});

          let approved = await proxyInstance.isApprovedorOwner(accounts[2], user, accounts[3], 1);
          assert.equal(approved, true);
        });

        it("should revert _isApprovedorOwner() function because _tokenId larger than kitties.length", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.fails(proxyInstance.isApprovedorOwner(user, user, accounts[2], 2));
        });

        it("should revert _isApprovedorOwner() function because _from address does NOT own _token", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.fails(proxyInstance.isApprovedorOwner(user, accounts[2], accounts[3], 1));
        });

        it.only("should revert _isApprovedorOwner() function because _to address is contract address", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.fails(proxyInstance.isApprovedorOwner(user, user, 0x0000000000000000000000000000000000000000, 1));
        });

        it("should return _isApprovedorOwner() function as false because _spender is NOT approved to access _tokenId", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          let approved = await proxyInstance.isApprovedorOwner(accounts[2], user, accounts[3], 1);
          assert.equal(approved, false);
        });
      });

    })
