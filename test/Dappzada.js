const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};
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
  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();
    const Dappzada = await ethers.getContractFactory("Dappzada");
    dappzada = await Dappzada.deploy();
  });
  describe("Deployment", () => {
    it("sets the owner", async () => {
      const owner = await dappzada.owner();
      expect(owner).to.equal(deployer.address);
    });
  });
  describe("Listing", () => {
    let transaction;
    beforeEach(async () => {
      transaction = await dappzada
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
    });
    it("returns the item attributes", async () => {
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
});
