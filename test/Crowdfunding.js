const { ethers } = require("hardhat");
const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");



const etherToWei = (n) => {
    return ethers.parseUnits(n, 'ether')
}

const dateToEpochTime = (date) => {
    return Math.round(new Date(date).getTime() / 1000).toString()
}


describe("Crowdfunding", function () {
    beforeEach(async function () {
        [address1, address2, ...address] = await ethers.getSigners();

        Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        crowdfunding = await Crowdfunding.deploy();

        await Promise.all(["1", "2", "3", "4", "5"].map(async (idx) => {
            await crowdfunding.createCampaign(idx, "test", dateToEpochTime('2025-05-22'), 123, "testURL");
        }));
    });

    describe("Get campaigns", async () => {
        it ("Should return individual campaign", async () => {
            await crowdfunding.connect(address1.address);
            const campaign = await crowdfunding.getCampaign(1);

            expect(campaign).to.not.be.null;
            expect(campaign.state).to.equal(0);
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

        it("Should return all campaigns user has created", async () => {
            await crowdfunding.connect(address1.address);
            const user1Campaigns = await crowdfunding.connect(address1).getCreatedCampaigns();
            const user2Campaigns = await crowdfunding.connect(address2).getCreatedCampaigns();

            expect(user1Campaigns.length).to.equal(5);
            expect(user2Campaigns.length).to.equal(0);
        });

        it("Should return all campaigns user has contributed to", async () => {
            await crowdfunding.connect(address2).contribute(1, {value: etherToWei("2")});
            const user1Campaigns = await crowdfunding.connect(address1).getContributedCampaigns();
            const user2Campaigns = await crowdfunding.connect(address2).getContributedCampaigns();

            expect(user1Campaigns.length).to.equal(0);
            expect(user2Campaigns.length).to.equal(1);
        });
    });

    describe("Refund", async () => {
        it("Should refund when requested", async () => {


            await crowdfunding.connect(address2).contribute(1, {value: etherToWei("2")});
            await crowdfunding.connect(address2).contribute(1, {value: etherToWei("2")});
            const tx = await crowdfunding.connect(address2).requestRefund(1);


            const result = await tx.wait();
            const event = result.logs[0].fragment.name;

            expect(event).to.equal("RefundCompleted");


            expect(result.logs[0].args[2]).to.equal(etherToWei("4"));


        });

        it("Should not refund when requester is creator", async () => {
            await crowdfunding.connect(address2).contribute(1, {value: etherToWei("2")});

            try {
                await crowdfunding.connect(address1).requestRefund(1);
                assert.fail("Expected is creator exception")
            } catch (e) {
                expect(e.message).to.include("Creator cannot request refund");
            }
        });

        // it("Should not refund when campaign is closed", async () => {
        //     await crowdfunding.connect(address2).contribute(1, {value: etherToWei("2")});

        //     try {
        //         const tx = await crowdfunding.connect(address1).requestRefund(1);
        //         const result = await tx.wait();
        //         const event = result.logs[0].fragment.name;
        //         assert.fail("Expected is creator exception")
        //     } catch (e) {
        //         expect(e.message).to.include("Campaign must be open to request refund");
        //     }
        // });

        it("Should not refund when already refunded", async () => {
           
            await crowdfunding.connect(address1);
            const timestamp = await time.latest();
            await crowdfunding.createCampaign("test", "test", timestamp + 60, 123, "testURL");


            await crowdfunding.connect(address2).contribute(5, {value: 2});
            await time.increase(3600);
            await crowdfunding.connect(address2).requestRefund(5);

            try {
                await crowdfunding.connect(address2).requestRefund(5);
                assert.fail("Expected already refunded exception")
            } catch (e) {
                expect(e.message).to.include("Campaign must be open to request refund");
            }
        });
    });

    describe("Create campaign", async () => {
        it ("Should not allow creating a campaign with goal not greater than 0", async () => {
            await crowdfunding.connect(address1.address);
            "test", dateToEpochTime('2025-05-22'), 123, "testURL"

            try {
                await crowdfunding.createCampaign("test", "test", dateToEpochTime('2025-05-22'), 0, "testURL");
                assert.fail("Expected Goal must be greater than 0")
            } catch (e) {
                expect(e.message).to.include("Funding goal cannot be zero");
            }
        });

        it ("Should not allow creating a campaign with deadline in the past", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.createCampaign("test", "test", dateToEpochTime('2023-05-22'), 123, "testURL");
                assert.fail("Expected Deadline must be in the future")
            } catch (e) {
                expect(e.message).to.include("Deadline must be in the future");
            }
        });

        it ("Should be able to create a Campaign if everything is ok", async () => {
            await crowdfunding.connect(address1.address);
            await crowdfunding.createCampaign("test", "test", dateToEpochTime('2025-05-22'), 123, "testURL");
            const campaign = await crowdfunding.getCampaign(5);
            expect(campaign).to.not.be.null;

        });
    })

    describe("contribute", async () => {
        it ("Should the contributed amount be correct if contributed multiple times", async () => {
            await crowdfunding.connect(address2).contribute(1, {value: etherToWei("2")});
            await crowdfunding.connect(address2).contribute(1, {value: etherToWei("2")});

            const contributedCampaigns = await crowdfunding.connect(address2).getContributedCampaigns();
            const campaign = await crowdfunding.getCampaign(1);
            expect(contributedCampaigns.length).to.equal(1);
            expect(contributedCampaigns[0][1]).to.equal(etherToWei("4"));
            expect(campaign[7]).to.equal(etherToWei("4"));
        });

        it ("Should not allow contributing when the campaign is closed", async () => {
            
     

            try {
                await crowdfunding.connect(address1).cancelCampaign(1);
                await crowdfunding.connect(address2).contribute(1, {value: 1});

                assert.fail("Expected Campaign is closed");
            } catch (e) {
              
                expect(e.message).to.include("Campaign is not open");
            }
        });

        it ("Should not allow contributing when the campaign's deadline has passed", async () => {
        

            try {
                await crowdfunding.connect(address1);
                const timestamp = await time.latest();
                await crowdfunding.createCampaign("test", "test", timestamp + 60, 123, "testURL");
                await time.increase(3600);
                await crowdfunding.connect(address2).contribute(5, {value: "1"});

                assert.fail("Expected Campaign deadline has passed")
            } catch (e) {
                expect(e.message).to.include("Campaign deadline has passed");
            }
        });

    

        it ("Should successfully contribute if everything is ok", async () => {


            const tx = await crowdfunding.connect(address2).contribute(1, {value: etherToWei("1")});
            const result = await tx.wait();
            const event = result.logs[0].fragment.name;

            expect(event).to.equal("ContributionCompleted");
            expect(result.logs[0].args[2]).to.equal(etherToWei("1"));



            const campaign = await crowdfunding.getCampaign(1);
            expect(campaign.raisedAmount).to.equal(etherToWei("1"));
        });
    })

    describe("cancelCampaign", async () => {
        it ("Should not be able to close an already closed campagin", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.cancelCampaign(1);
                await crowdfunding.cancelCampaign(1);
                assert.fail("Expected Campaign already closed")
            } catch (e) {
                expect(e.message).to.include("Campaign is not open");
            }
        });

        it ("Should be able to close the campagin if everything is ok", async () => {
            await crowdfunding.connect(address1.address);

            await crowdfunding.cancelCampaign(1);
            const campaign = await crowdfunding.getCampaign(1);
            expect(campaign.state).to.equal(1);
        });
    })
});
