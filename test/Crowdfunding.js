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
            const tx = await crowdfunding.connect(address2).requestRefund(1);
            const result = await tx.wait();
            const event = result.logs[0].fragment.name;

            expect(event).to.equal("RefundCompleted");
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
            await crowdfunding.connect(address2).contribute(1, {value: etherToWei("2")});

            try {
                await crowdfunding.connect(address2).requestRefund(1);
                await crowdfunding.connect(address2).requestRefund(1);
                assert.fail("Expected already refunded exception")
            } catch (e) {
                expect(e.message).to.include("Nothing to be refunded");
            }
        });
    });

    describe("Create campaign", async () => {
        it ("Should not allow creating a campaign with goal not greater than 0", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.createCampaign(0, 2);
                assert.fail("Expected Goal must be greater than 0")
            } catch (e) {
                expect(e.message).to.include("Goal must be greater than 0");
            }
        });

        it ("Should not allow creating a campaign with deadline in the past", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.createCampaign(1, 0);
                assert.fail("Expected Deadline must be in the future")
            } catch (e) {
                expect(e.message).to.include("Deadline must be in the future");
            }
        });

        it ("Should be able to create a Campaign if everything is ok", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.createCampaign(6, dateToEpochTime('2025-05-22'));
                const campaign = await crowdfunding.getCampaign(6);
                expect(campaign).to.not.be.null;
                expect(campaign.closed).to.be.false;
            } catch (e) {
                assert.fail("Expected successful creation of the campaign")
            }
        });
    })

    describe("contribute", async () => {
        it ("Should not allow contributing when the campaign is closed", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.closeCampaign(1);
                await crowdfunding.contribute(1, 2);
                assert.fail("Expected Campaign is closed")
            } catch (e) {
                expect(e.message).to.include("Campaign is closed");
            }
        });

        it ("Should not allow contributing when the campaign's deadline has passed", async () => {
            await crowdfunding.connect(address1.address);

            try {
                const currentDate = new Date();
                const timestamp = currentDate.getTime();
                await crowdfunding.createCampaign(6, timestamp + 1);
                await crowdfunding.contribute(6, 2);
                assert.fail("Expected Campaign deadline has passed")
            } catch (e) {
                expect(e.message).to.include("Campaign deadline has passed");
            }
        });

        it ("Should not allow contributing when contribution exceeds campaign goal", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.contribute(1, 10);
                assert.fail("Expected Contribution exceeds campaign goal")
            } catch (e) {
                console.log(e.message)
                expect(e.message).to.include("Contribution exceeds campaign goal");
            }
        });

        it ("Should successfully contribute if everything is ok", async () => {
            await crowdfunding.connect(address1.address);

            await crowdfunding.contribute(1, 1, {value: "100000000000000000"});
            const campaign = await crowdfunding.getCampaign(1);
            expect(campaign.raisedAmount).to.equal(1);
        });
    })

    describe("closeCampaign", async () => {
        it ("Should not be able to close an already closed campagin", async () => {
            await crowdfunding.connect(address1.address);

            try {
                await crowdfunding.closeCampaign(1);
                await crowdfunding.closeCampaign(1);
                assert.fail("Expected Campaign already closed")
            } catch (e) {
                expect(e.message).to.include("Campaign already closed");
            }
        });

        it ("Should be able to close the campagin if everything is ok", async () => {
            await crowdfunding.connect(address1.address);

            await crowdfunding.closeCampaign(1);
            const campaign = await crowdfunding.getCampaign(1);
            expect(campaign.closed).to.equal(true);
        });
    })
});
