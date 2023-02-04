const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

// Global constants for listing an item...
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("Dappzada", () => {
  let dappzada;
  let deployer, buyer;

  beforeEach(async () => {
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners();

    // Deploy contract
    const Dappzada = await ethers.getContractFactory("Dappzada");
    dappzada = await Dappzada.deploy();
  });

  describe("Deployment", () => {
    it("sets the owner", async () => {
      expect(await dappzada.owner()).to.equal(deployer.address);
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      // List a item
      transaction = await dappzada
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
    });

    it("returns item attributes", async () => {
      const item = await dappzada.items(ID);

      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("emits List event", () => {
      expect(transaction).to.emit(dappzada, "List");
    });
  });

  describe("Buying", () => {
    let transaction;

    beforeEach(async () => {
      // List a item
      transaction = await dappzada
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buy a item
      transaction = await dappzada.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();
    });

    it("updates buyer's order count", async () => {
      const result = await dappzada.orderCount(buyer.address);
      expect(result).to.equal(1);
    });

    it("adds the order", async () => {
      const order = await dappzada.orders(buyer.address, 1);

      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    });

    it("updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappzada.address);
      expect(result).to.equal(COST);
    });

    it("emits Buy event", () => {
      expect(transaction).to.emit(dappzada, "Buy");
    });
  });

  describe("Withdrawing", () => {
    let balanceBefore;

    beforeEach(async () => {
      // List a item
      let transaction = await dappzada
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buy a item
      transaction = await dappzada.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      // Withdraw
      transaction = await dappzada.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("updates the owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappzada.address);
      expect(result).to.equal(0);
    });
  });
});
