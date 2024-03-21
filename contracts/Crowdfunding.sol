// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import necessary libraries and interfaces
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Crowdfunding {
    // Struct to represent a crowdfunding campaign
    struct Campaign {
        address creator;
        uint256 goal;
        uint256 deadline;
        uint256 raisedAmount;
        bool closed;
    }

    // Mapping to store all active campaigns
    mapping(uint256 => Campaign) public campaigns;
    uint256 public numCampaigns;

    // Event emitted when a new campaign is created
    event CampaignCreated(uint256 indexed campaignId, address indexed creator, uint256 goal, uint256 deadline);

    // Modifier to ensure only campaign creator can call certain functions
    modifier onlyCreator(uint256 _campaignId) {
        require(msg.sender == campaigns[_campaignId].creator, "Only campaign creator can call this function");
        _;
    }

    // Function to create a new crowdfunding campaign
    function createCampaign(uint256 _goal, uint256 _deadline) external {
        require(_goal > 0, "Goal must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        Campaign storage newCampaign = campaigns[numCampaigns++];
        newCampaign.creator = msg.sender;
        newCampaign.goal = _goal;
        newCampaign.deadline = _deadline;
        newCampaign.raisedAmount = 0;
        newCampaign.closed = false;

        emit CampaignCreated(numCampaigns - 1, msg.sender, _goal, _deadline);
    }

    // Function to contribute funds to a campaign
    function contribute(uint256 _campaignId, uint256 _amount) external payable {
        require(!campaigns[_campaignId].closed, "Campaign is closed");
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign deadline has passed");
        require(campaigns[_campaignId].raisedAmount + _amount <= campaigns[_campaignId].goal, "Contribution exceeds campaign goal");

        campaigns[_campaignId].raisedAmount += _amount;
        // Transfer funds to the contract
        // Assumes ERC20 token, adapt for ETH contributions
        IERC20 token = IERC20(msg.sender);
        token.transferFrom(msg.sender, address(this), _amount);
    }

    // Function to close a campaign
    function closeCampaign(uint256 _campaignId) external onlyCreator(_campaignId) {
        require(!campaigns[_campaignId].closed, "Campaign already closed");

        // Check if the goal is met
        if (campaigns[_campaignId].raisedAmount >= campaigns[_campaignId].goal) {
            // Release funds to campaign creator
            // Assumes ERC20 token, adapt for ETH contributions
            IERC20 token = IERC20(msg.sender);
            token.transfer(campaigns[_campaignId].creator, campaigns[_campaignId].raisedAmount);
        }

        campaigns[_campaignId].closed = true;
    }

    // Function signature for external verification
    function getFunctionSignature() external pure returns (bytes4) {
        return this.createCampaign.selector;
    }
}