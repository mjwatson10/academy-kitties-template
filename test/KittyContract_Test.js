const Kittycontract = artifacts.require("Kittycontract");
const truffleAssert = require("truffle-assertions");

    contract ("Kittycontract", async function(accounts){

      it("should create a gen 0 kitty", async function(){
        const instance = await Kittycontract.new();
        const createZero = await instance.createKittyGen0("84336244549310576265");
        const getKitty = await instance.getKitty(1);
        assert(getKitty.generation.toString(10) === "0")
      });

       // it("should not create more than 100 gen 0 kitties", async function(){
       //   const instance = await Kittycontract.new();
       //   const counter = await instance.gen0Counter;
       //   console.log("Counter: ", counter);
       //  truffleAssert.fails(
       //    for (var i = 0; i < 102; i++) {
       //      await instance.createKittyGen0(`8433624454931057626${i}`);
       //    }
       //    , truffleAssert.ErrorType.REVERT);
       // });

      it("should create a kitty", async function(){
        const instance = await Kittycontract.new();
        const createZero = await instance.createKittyGen0("84336244549310576265");
        const getKitty = await instance.getKitty(1);
        assert(getKitty.genes.toString(10) === "84336244549310576265")
      });

      it("Should show name", async function(){
        const instance = await Kittycontract.deployed();
        const name = await instance.name();
        assert(name === "CyberKitties");
      });

      it("Should show total supply", async function(){
        const instance = await Kittycontract.new();
        const supply = await instance.totalSupply();
        assert(supply.toString(0) === "1");
      });

      it("Should breed kitties", async function(){
        const instance = await Kittycontract.deployed();
        const dad = await instance.createKittyGen0("84336244549310576265");
        const mom = await instance.createKittyGen0("69367694223415461144");

        const breed = await instance.breed(1, 2);
        const newKitty = await instance.getKitty(3);

        assert(newKitty.generation.toString(10) === "1");
      });

      it("Should mix the kitties dna together", async function(){
        const instance = await Kittycontract.deployed();
        const dad = await instance.createKittyGen0("84336244549310576265");
        const mom = await instance.createKittyGen0("69367694223415461144");

        const breed = await instance.breed(1, 2);
        const newKitty = await instance.getKitty(3);

        assert(newKitty.genes.toString(10) != "84336244549310576265" || newKitty.genes.toString(10) != "69367694223415461144");
      });

      it("Should transfer kitty", async function(){
        const instance = await Kittycontract.new();
        const kitty = await instance.createKittyGen0("84336244549310576265");
        const address = accounts[2];

        const transfer = await instance.transfer(accounts[2], 1);
        const kittyId = await instance.getKittiesIDs(accounts[2]);

        assert(kittyId.toString(10) === "1");
      });

      it("Should be approved on new address", async function(){
        const instance = await Kittycontract.new();
        const kitty = await instance.createKittyGen0("84336244549310576265");
        const getKitty = await instance.getKitty(1);
        console.log("Get Kitty: ", getKitty.genes.toString(10));

        const approve = await instance.approve(accounts[2], 1);
        const getApproved = await instance.getApproved(2);
        console.log("Who's Approved: ", getApproved);
        console.log("Address 1:", accounts[1].toString(10));
        console.log("Address 2:", accounts[2].toString(10));
        // const approvalCheck = await instance.isApprovedForAll(accounts[1], accounts[2]);
        // console.log("Approve: ", approvalCheck);

        assert(approvalCheck === true);
      });
    })
