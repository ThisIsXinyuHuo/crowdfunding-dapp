// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import necessary libraries and interfaces
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";


contract Crowdfunding {
    // state variables
    address private owner;
    uint256 private numCampaigns;
    // array to store all active campaigns
    // id => campaign
    Campaign[] private campaigns;

    mapping(address => Profile) userProfileMap;

    // creators

    constructor() {
        owner = msg.sender;
    }

    // the state of th campaign
    enum State {
        OPEN,
        CANCEL, // the campaign is canclled by the creator; the campaign will become CANCEL after the creator cancel the project and the contributors will get refund
        SUCCESS, // the campaign raises enough ether before deadline; the campaign will become SUCESS after the creator withdraw ethers after the deadline
        CLOSE // the campaign does not raise enough money before deadline; the campaign will become CLOSE after refund to contributors
    }

    struct Profile {
        Contribution[] contributions;
        Campaign[] createdCampaigns;
    }

    // Struct to represent a crowdfunding campaign
    struct Campaign {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        string imageURL;
        uint256 raisedAmount;
        State state;
        // list of contributors
        address[] contributors;
    }

    struct Contribution {
        uint256 campaignId;
        uint256 amount;
    }

    // Event emitted when a new campaign is created
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 goal,
        uint256 deadline
    );

    event RefundCompleted(
        uint256 indexed campaignId,
        address indexed to,
        uint256 amount
    );

    // Modifier to ensure only campaign creator can call certain functions
    modifier onlyCreator(uint256 _campaignId) {
        require(
            msg.sender == campaigns[_campaignId].creator,
            "Only campaign creator can call this function"
        );
        _;
    }

    // Function to create a new crowdfunding campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _deadline,
        uint256 _goal,
        string memory _imageURL
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_goal > 0, "Funding goal cannot be zero");

        Campaign memory campaign;
        campaign.id = numCampaigns;
        numCampaigns += 1;
        campaign.creator = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.goal = _goal;
        campaign.deadline = _deadline;
        campaign.imageURL = bytes(_imageURL).length > 0
            ? _imageURL
            : "URL of a default placeholder";
        campaign.raisedAmount = 0;
        campaign.state = State.OPEN;
        campaign.contributors = new address[](0);

        campaigns.push(campaign);
        userProfileMap[msg.sender].createdCampaigns.push(campaign);

        emit CampaignCreated(numCampaigns, msg.sender, _goal, _deadline);
    }

    // Function to contribute funds to a campaign
    // the user pay ethers to the contract when calling this function (msg.value)
    function contribute(uint256 _campaignId) external payable {
        require(
            msg.sender != campaigns[_campaignId].creator,
            "Creator can not contribute to its own campaign"
        );
        require(
            campaigns[_campaignId].state == State.OPEN,
            "Campaign is not open"
        );
        require(
            block.timestamp < campaigns[_campaignId].deadline,
            "Campaign deadline has passed"
        );
        /* require(
            campaigns[_campaignId].raisedAmount + _amount <=
                campaigns[_campaignId].goal,
            "Contribution exceeds campaign goal"
        ); cam raise more money than goal*/

        campaigns[_campaignId].raisedAmount += msg.value;
        userProfileMap[msg.sender].contributions.push(Contribution(_campaignId, msg.value));
        campaigns[_campaignId].contributors.push(msg.sender);
    }

    function cancelCampaign(
        uint256 _campaignId
    ) external onlyCreator(_campaignId) {
        require(
            campaigns[_campaignId].state == State.OPEN,
            "Campaign is not open"
        );

        refund(_campaignId);

        campaigns[_campaignId].state = State.CANCEL;

        //emit action
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function withdraw(uint256 _campaignId) internal {
        address to = campaigns[_campaignId].creator;
        uint256 amount = campaigns[_campaignId].raisedAmount;
        payTo(to, amount);
        //emit action
    }

    function refund(uint256 _campaignId, address _to) internal {
        require(campaigns[_campaignId].state == State.OPEN, "Campaign must be open to request refund");
        require(msg.sender != campaigns[_campaignId].creator, "Creator cannot request refund");

        for (uint256 i = 0; i < userProfileMap[msg.sender].contributions.length; i++) {
            if (userProfileMap[msg.sender].contributions[i].campaignId == _campaignId) {
                require(userProfileMap[msg.sender].contributions[i].amount > 0, "Nothing to be refunded");
                payTo(_to, userProfileMap[msg.sender].contributions[i].amount);
                userProfileMap[msg.sender].contributions[i].amount = 0;
                emit RefundCompleted(_campaignId, _to, userProfileMap[msg.sender].contributions[i].amount);
                break;
            }
        }
    }

    function refund(uint256 _campaignId) internal {
        // an internal function perform refunds to all the contributors of campaign _campaignId
        for (uint256 i = 0; i < campaigns[_campaignId].contributors.length; i++) {
            address contributorAddress = campaigns[_campaignId].contributors[i];
            refund(_campaignId, contributorAddress);
        }
    }

    function requestWithdraw(uint256 _campaignId) external {
        // an external function call by users to request withdraw
        // require: state is not CANCEL/CLOSE/SUCCESS; enough money is raised before deadline;
        // the msg.sender is project creator
        // creator can withdraw the fund before or after the deadline; but if he/she withdraw before ddl,
        // fundraising is ended and no more contributors are allowed
        // the campaign will be marked as SUCCESS after requestWithdraw;
    }

    function requestRefund(uint256 _campaignId) external {
        // an external function call by users to request refund
        // require: state is not CANCEL/CLOSE/SUCCESS a; the deadline is passed and does not raised enough money;
        refund(_campaignId, msg.sender);
    }

    // Function signature for external verification
    function getFunctionSignature() external pure returns (bytes4) {
        return this.createCampaign.selector;
    }

    function getCampaign(
        uint256 _campaignId
    ) public view returns (Campaign memory) {
        require(_campaignId < numCampaigns, "Invalid campaign index");

        return campaigns[_campaignId];
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numCampaigns);

        for (uint256 i = 0; i < numCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }

        return allCampaigns;
    }

    function getCampaigns(
        uint256 _page,
        uint256 _pageSize
    ) public view returns (Campaign[] memory) {
        uint256 startIndex = _page * _pageSize;
        require(startIndex < numCampaigns, "Invalid page number");

        uint256 endIndex = (startIndex + _pageSize) > numCampaigns
            ? numCampaigns
            : (startIndex + _pageSize);
        Campaign[] memory campaignPage = new Campaign[](endIndex - startIndex);

        for (uint256 i = startIndex; i < endIndex; i++) {
            campaignPage[i - startIndex] = campaigns[i];
        }

        return campaignPage;
    }

    function getContributors(
        uint256 _campaignId
    ) public view returns (address[] memory) {
        return campaigns[_campaignId].contributors;
    }

    function getContributedCampaigns() public view returns (Contribution[] memory) {
        return userProfileMap[msg.sender].contributions;
    }

    function getCreatedCampaigns() public view returns (Campaign[] memory) {
        return userProfileMap[msg.sender].createdCampaigns;
    }
}
