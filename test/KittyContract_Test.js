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
        it.only("should get owner address", async function(){
          const ownerAddress = await proxyInstance.getOwner();

          assert.equal(accounts[0], ownerAddress);
        });

        it("should show name", async function(){
          const name = await proxyInstance.name();
          assert(name === "CyberKitties");
        });

        it("should show total supply", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

          const supply = await proxyInstance.totalSupply();
          assert.equal(supply.toString(10), "3");
        });

        it("should return contract address as true", async function(){

          let contractTest = await proxyInstance.isContract(proxyInstance.address);
          assert.equal(contractTest, true);
        });

        it("should return non contract address as false", async function(){

          let contractTest = await proxyInstance.isContract(user);
          assert.equal(contractTest, false);
        });

        it("should be ERC721 supported because _to address is NOT a contract address", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.passes(proxyInstance.checkERC721Support(user, accounts[2], 1));
        });

        it("should NOT be ERC721 supported because _to address IS contract address", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.fails(proxyInstance.checkERC721Support(user, proxyInstance.address, 1));
        });
      });


//creating kitties test
      describe("creating kitties", async function(){
        it("should create a gen 0 kitty", async function(){

          const createZero = await proxyInstance.createKittyGen0("84336244549310576265");
          const getKitty = await proxyInstance.getKitty(1);
          assert.equal(getKitty.generation.toString(10), "0");
          assert.equal(getKitty.momId.toString(10), "0");
          assert.equal(getKitty.dadId.toString(10), "0");
          assert.equal(getKitty.genes.toString(10), "84336244549310576265")
        });

        it("should not create Gen 0 kitty because sender is not contract owner", async function(){

          await truffleAssert.fails(proxyInstance.createKittyGen0("84336244549310576265", {from: accounts[2]}));
        });

        it("should create a kitty", async function(){

          const result = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const getKitty = await proxyInstance.getKitty(1);
          const kittyGenes = getKitty.genes.toString(10);
          const kittyDad = getKitty.dadId.toString(10);
          const kittyMom = getKitty.momId.toString(10);
          assert(getKitty.genes.toString(10) === "84336244549310576265");

          await truffleAssert.eventEmitted(result, 'Birth', (ev) => {
            return ev.owner == user && ev.kittenId == 1 && ev.momId == parseInt(kittyMom) && ev.dadId == parseInt(kittyDad) && ev.genes == parseInt(kittyGenes);
          });
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

          await proxyInstance.breed(1, 2);
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

        it("should create a kitty with an average generation of the parent kitties", async function(){
          const dad = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const mom = await proxyInstance.createKitty(1, 1, 5, "69367694223415461144", user, {from: user});

          const breed = await proxyInstance.breed(1, 2, {from: user});
          const newKitty = await proxyInstance.getKitty(3);

          assert.equal(newKitty.generation.toString(10), "3")
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

          await proxyInstance.transfer(accounts[2], 1);
          const kittyId = await proxyInstance.getKittiesIDs(accounts[2]);

          assert.strictEqual(kittyId[0].toString(10), "1");
        });

        it("should transfer kitty to another user's address", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          await proxyInstance.transfer(accounts[2], 1, {from: user});

          transKitty = await proxyInstance.getKittiesIDs(accounts[2]);

          assert.strictEqual(transKitty[0].toString(10), "1");
        });

        it("should revert transfer() function because to address is address(0)", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.fails(proxyInstance.transfer(0x0000000000000000000000000000000000000000, 1, {from: user}));
        });

        it("should revert transfer() function because to address is contract address", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.passes(proxyInstance.transfer(accounts[0], 1, {from: user}));
        });

        it("should revert transfer() because msg.sender is NOT owner of token", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.fails(proxyInstance.transfer(accounts[3], 1, {from: accounts[2]}));
        });

        it("should safeTransfer kitty to another user", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          await proxyInstance.safeTransferFrom(user, accounts[2], 1, {from: user});

          transKitty = await proxyInstance.getKittiesIDs(accounts[2]);

          assert.strictEqual(transKitty[0].toString(10), "1");
        });

        it("should revert safeTransfer because msg.sender is not approved to transfer token", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.fails(proxyInstance.safeTransferFrom(user, accounts[2], 1, {from: accounts[2]}));
        });

        it("should revert safeTransfer because _to is not ERC721 supported", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});

          await truffleAssert.fails(proxyInstance.safeTransferFrom(user, proxyInstance.address, 1, {from: accounts[2]}));
        });
      });


//approval testing
      describe("approval", async function(){
        it("should approve token for transfer by new address", async function(){
          await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          await proxyInstance.approve(accounts[2], 1, {from: user});

          await proxyInstance.transferFrom(user, accounts[3], 1, {from: accounts[2]});
          const kittyId = await proxyInstance.getKittiesIDs(accounts[3]);

          assert.strictEqual(kittyId[0].toString(10), "1");
        });

        it("should not approve token on new address because account trying to approve is not owner of token", async function(){

          await proxyInstance.createKittyGen0("84336244549310576265");

          await truffleAssert.fails(proxyInstance.approve(accounts[2], 1, {from:accounts[3]}));
        });

        it("should show that owner is approving another address for access in transfering owner's kitties", async function(){

          const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

          await proxyInstance.setApprovalForAll(accounts[2], true, {from: user});
          await proxyInstance.isApprovedForAll(user, accounts[2]);

          await proxyInstance.transferFrom(user, accounts[3], 1, {from: accounts[2]});
          transKitty = await proxyInstance.getKittiesIDs(accounts[3]);

          assert.strictEqual(transKitty[0].toString(10), "1");
        });

        it("should show NOT approved non owner address for all of the owner's kitties", async function(){

          const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

          await proxyInstance.setApprovalForAll(accounts[2], true, {from: user});

          const approval = await proxyInstance.isApprovedForAll(user, accounts[3])

          assert.equal(approval, false);
        });

        it("should pass to approve operator for access to transfer kitties because operator is not sender", async function(){

          const kitty1 = await proxyInstance.createKitty(1, 1, 1, "84336244549310576265", user, {from: user});
          const kitty2 = await proxyInstance.createKitty(1, 1, 1, "69367694223415461144", user, {from: user});

          await truffleAssert.passes(proxyInstance.setApprovalForAll(accounts[2], true, {from: user}));

          await proxyInstance.transferFrom(user, accounts[3], 1, {from: accounts[2]});
          transKitty = await proxyInstance.getKittiesIDs(accounts[3]);

          assert.strictEqual(transKitty[0].toString(10), "1");
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

        it("should revert _isApprovedorOwner() function because _to address is contract address", async function(){
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
