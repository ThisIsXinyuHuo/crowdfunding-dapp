// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import necessary libraries and interfaces
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
        mapping(uint256 => Contribution) contributions; // campaign id to contribution
        Campaign[] createdCampaigns;
        uint256[] contributedCampaignIds;
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

    event ContributionCompleted(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    event RefundCompleted(
        uint256 indexed campaignId,
        address indexed to,
        uint256 amount
    );

    event CampaignCancelled(
        uint256 indexed campaignId,
        address indexed creator
    );


    event WithdrawCompleted(
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

    // Modifier to ensure the campaign is open
    modifier onlyOpen(uint256 _campaignId) {
        require(
            campaigns[_campaignId].state == State.OPEN,
            "Campaign is not open"
        );
        _;
    }

    // Modifier to ensure the deadline has passed
    modifier onlyAfterDeadline(uint256 _campaignId) {
        require(
            block.timestamp >= campaigns[_campaignId].deadline,
            "Deadline has not passed yet"
        );
        _;
    }

    modifier onlyBeforeDeadline(uint256 _campaignId) {
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign deadline has passed");
        _;
    }

    modifier onlyContributor(uint256 _campaignId, string memory reason) {
        require(msg.sender != campaigns[_campaignId].creator, reason);
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

        emit CampaignCreated(numCampaigns - 1, msg.sender, _goal, _deadline);
    }

    // Function to contribute funds to a campaign
    // the user pay ethers to the contract when calling this function (msg.value)

    function contribute(uint256 _campaignId) 
    onlyContributor(_campaignId, "Creator can not contribute to its own campaign")
    onlyBeforeDeadline(_campaignId)
    onlyOpen(_campaignId)
    external payable {
        campaigns[_campaignId].raisedAmount += msg.value;

        if (userProfileMap[msg.sender].contributions[_campaignId].amount > 0) {
            userProfileMap[msg.sender].contributions[_campaignId].amount += msg
                .value;
        } else {
            userProfileMap[msg.sender].contributions[
                _campaignId
            ] = Contribution(_campaignId, msg.value);
            userProfileMap[msg.sender].contributedCampaignIds.push(_campaignId);
        }

        campaigns[_campaignId].contributors.push(msg.sender);

        emit ContributionCompleted(_campaignId, msg.sender, msg.value);


    }

    // Function to cancel a campaign
    function cancelCampaign(
        uint256 _campaignId

    ) external 
    onlyCreator(_campaignId) 
    onlyOpen(_campaignId)
    {
        refund(_campaignId);

        campaigns[_campaignId].state = State.CANCEL;

        //emit action
        emit CampaignCancelled(_campaignId, msg.sender);
    }

    function payTo(address _to, uint256 _amount) internal {
        (bool success, ) = payable(_to).call{value: _amount}("");
        require(success);
    }


    function withdraw(uint256 _campaignId)  onlyCreator(_campaignId) onlyOpen(_campaignId) internal {
        address to = campaigns[_campaignId].creator;
        uint256 amount = campaigns[_campaignId].raisedAmount;
        payTo(to, amount);
        emit WithdrawCompleted(_campaignId, to, amount);
    }

    function refund(
        uint256 _campaignId,
        address _to
    ) internal onlyOpen(_campaignId) onlyContributor(_campaignId, "Creator cannot request refund") {
        
        require(
            block.timestamp > campaigns[_campaignId].deadline &&
                campaigns[_campaignId].raisedAmount <
                campaigns[_campaignId].goal,
            "Campaign deadline has not passed or the campaign is successful; in either case, you cannot withdraw"
        );

        require(
            userProfileMap[msg.sender].contributions[_campaignId].amount > 0,
            "Nothing to be refunded"
        );
        payTo(
            _to,
            userProfileMap[msg.sender].contributions[_campaignId].amount
        );
        emit RefundCompleted(
            _campaignId,
            _to,
            userProfileMap[msg.sender].contributions[_campaignId].amount
        );
        userProfileMap[msg.sender].contributions[_campaignId].amount = 0;
    }

    function refund(uint256 _campaignId) internal {
        // an internal function perform refunds to all the contributors of campaign _campaignId
        for (
            uint256 i = 0;
            i < campaigns[_campaignId].contributors.length;
            i++
        ) {
            address contributorAddress = campaigns[_campaignId].contributors[i];
            refund(_campaignId, contributorAddress);
        }
    }

    function requestWithdraw(
        uint256 _campaignId
    ) external {
        // an external function call by users to request withdraw
        // require: state is not CANCEL/CLOSE/SUCCESS; enough money is raised before deadline;
        // the msg.sender is project creator
        // creator can withdraw the fund before or after the deadline; but if he/she withdraw before ddl,
        // fundraising is ended and no more contributors are allowed
        // the campaign will be marked as SUCCESS after requestWithdraw;

        require(
            campaigns[_campaignId].raisedAmount >= campaigns[_campaignId].goal,
            "Campaign did not reach its goal"
        );

        withdraw(_campaignId);
        campaigns[_campaignId].state = State.SUCCESS;

    }

    function requestRefund(uint256 _campaignId) external {
        // an external function call by users to request refund
        // require: state is not CANCEL/CLOSE/SUCCESS a; the deadline is passed and does not raised enough money;
        // the campaign will be marked as CLOSE after requestRefund


        refund(_campaignId, msg.sender);
        campaigns[_campaignId].state = State.CLOSE;
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

    function getContributedCampaigns()
        public
        view
        returns (Contribution[] memory)
    {
        Contribution[] memory contributions = new Contribution[](
            userProfileMap[msg.sender].contributedCampaignIds.length
        );
        for (
            uint256 i = 0;
            i < userProfileMap[msg.sender].contributedCampaignIds.length;
            i++
        ) {
            uint256 campaignId = userProfileMap[msg.sender]
                .contributedCampaignIds[i];
            contributions[i] = userProfileMap[msg.sender].contributions[
                campaignId
            ];
        }

        return contributions;
    }

    function getCreatedCampaigns() public view returns (Campaign[] memory) {
        return userProfileMap[msg.sender].createdCampaigns;
    }
}
