const { ethers } = require("hardhat");
const { expect } = require("chai");

const etherToWei = (n) => {
    return ethers.parseUnits(n, 'ether')
}

const dateToEpochTime = (date) => {
    return Math.round(new Date(date).getTime() / 1000).toString()
}


describe("Crowdfunding", function () {
    beforeEach(async function () {
        [address1, address2, ...address] = await ethers.getSigners();

        const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        crowdfunding = await Crowdfunding.deploy();

        await Promise.all([1, 2, 3, 4, 5].map(async (idx) => {
            await crowdfunding.createCampaign(idx, dateToEpochTime('2025-05-22'));
        }));
    });

    describe("Get campaigns", async () => {
        it ("Should return individual campaign", async () => {
            await crowdfunding.connect(address1.address);
            const campaign = await crowdfunding.getCampaign(1);

            expect(campaign).to.not.be.null;
            expect(campaign.closed).to.be.false;
        });

        it ("Should fail if invalid index", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.getCampaign(99);
                assert.fail("Expected invalid campaign index")
            } catch (e) {
                expect(e.message).to.include("Invalid campaign index");
            }
        });

        it("Should return all campaigns", async () => {
            await crowdfunding.connect(address1.address);
            const campaigns = await crowdfunding.getCampaigns();

            expect(campaigns.length).to.equal(5);
        });

        it("Should return all campaigns with correct page size", async () => {
            await crowdfunding.connect(address1.address);
            const campaigns = await crowdfunding.getCampaigns(1, 2);

            expect(campaigns.length).to.equal(2);
        });

        it("Should fail if page number is invalid", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.getCampaigns(5, 2);
                assert.fail("Expected invalid page number")
            } catch (e) {
                expect(e.message).to.include("Invalid page number");
            }
        });
    })

});