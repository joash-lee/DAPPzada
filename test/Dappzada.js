const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Dappzada", () => {
  let dappzada;
  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();
    const Dappzada = await ethers.getContractFactory("Dappzada");
    dappzada = await Dappzada.deploy();
  });
  describe("Deployment", () => {
    it("Sets the owner", async () => {
      const owner = await dappzada.owner();
      expect(owner).to.equal(deployer.address);
    });
    it("has a name", async () => {
      const name = await dappzada.name();
      expect(name).to.equal("Dappzada");
    });
  });
});
