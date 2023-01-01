pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaignAddress = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaignAddress);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) requestApprovals;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public contributors;

    // count the total number of contributors
    uint256 public contributersCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint256 minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);

        // sender can contribute only once
        require(!contributors[msg.sender]);

        contributors[msg.sender] = true;
        contributersCount++;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request({
            // we have to initialize the value types
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            // we don't have to initialize the reference types
        });

        requests.push(newRequest);
    }

    // vote for a particular funding request
    function approveRequest(uint256 index) public {
        Request storage currentRequest = requests[index];

        // check if sender is a contributer
        require(contributors[msg.sender]);

        // check if sender has not voted already. Person can only vote once per request
        require(!currentRequest.requestApprovals[msg.sender]);

        // store current sender to a list of approvals
        currentRequest.requestApprovals[msg.sender] = true;
        currentRequest.approvalCount++;
    }

    // finalize the particular request (by manager)
    function finalizeRequest(uint256 index) public restricted {
        Request storage currentRequest = requests[index];

        // to finalize the request must NOT be completed
        require(!currentRequest.complete);
        // at least 50% of contributers should vote fo this request to proceed
        require(currentRequest.approvalCount > (contributersCount / 2));

        // transfer money to recipient + mark request as true
        currentRequest.recipient.transfer(currentRequest.value);
        currentRequest.complete = true;
    }

    function getSummary() view public returns(uint256, uint256, uint256, uint256, address) {
      return (
        minimumContribution,
        this.balance,
        requests.length,
        contributersCount,
        manager
      );
    }

    function getRequestsCount() public view returns(uint256) {
      return requests.length;
    }
}
