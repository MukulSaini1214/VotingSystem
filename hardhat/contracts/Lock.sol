// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract voting_system {
    address public ELECTION_COMMISSION;
    uint256 public TOTAL_VOTES;
    uint256 public current_election =2025;
    bool public is_active = true; // Flag to indicate whether the contract is active
    mapping(string => uint256) private CONTESTENT; // Mapping for contestants' votes
    mapping(address => uint256) private total_voters; // Maps voters to eligibility (1 = eligible, 0 = already voted or not eligible)

    modifier only_owner() {
        require(msg.sender == ELECTION_COMMISSION, "Only the owner can perform this action.");
        _;
    }

    address[] private voter_addresses = [
        0xA305d2A348cd8fE0eD15C9385f85a42Ee4CB39a9,
        0x7fbc450ad0Ec2e8753EefEcfe8E1Bbd8A63c4c54,
        0x617F2E2fD72FD9D5503197092aC168c91465E7f2,
        0x583031D1113aD414F02576BD6afaBfb302140225,
        0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB,
        0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c,
        0x789DEF0123456789AbC123456789DEF012345678,
        0x17F6AD8Ef982297579C203069C1DbfFE4348c372,
        0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,
        0xDEf6789Abc0123456789deFAbC123456789dEf01
    ];

    string[] public  CONTESTENT_NAME = ["John", "Peter", "Mike"]; // Contestant names

    constructor(address election_commission ) {
        ELECTION_COMMISSION = election_commission; // Set the deployer as the election commission
        addContestents();
        add_voters();
    }

    // Function to initialize contestants with 0 votes
    function addContestents() private {
        for (uint256 i = 0; i < CONTESTENT_NAME.length; i++) {
            CONTESTENT[CONTESTENT_NAME[i]] = 1;
        }
    }

    // Function to add voters and make them eligible to vote
    function add_voters() private {
        for (uint256 i = 0; i < voter_addresses.length; i++) {
            total_voters[voter_addresses[i]] = 1; // Mark them eligible to vote
        }
    }

    // Function to vote for a candidate
    function VOTE_CANDIDATE(string memory nameContestent) public {
        require(total_voters[msg.sender] == 1, "You are not eligible for voting or have already voted."); // Ensure the voter is eligible
        require(CONTESTENT[nameContestent] > 0 || bytes(nameContestent).length > 0, "Invalid candidate."); // Ensure valid candidate

        total_voters[msg.sender] = 0; // Mark voter as having voted
        TOTAL_VOTES++; // Increment total votes
        CONTESTENT[nameContestent] += 1; // Increment votes for the selected candidate
    }

    // Function to get the total number of votes (only callable by the owner)
    function callTOTAL_VOTES() public view returns (uint256) {
        return TOTAL_VOTES;
    }

    // Function to get the number of votes for a specific candidate
    function CANDIDATE_STATUS(string memory NAME_CONTESTENT) public view returns (uint256) {
        return CONTESTENT[NAME_CONTESTENT]-1;
    }
    // Function to get the percentage of abstention
    function Percectage_Abstention() public view returns (uint256) {
        return (voter_addresses.length-callTOTAL_VOTES())*10;
    }

        // Function to deactivate the contract
    function deactivateContract() public only_owner {
        is_active = false; // Set the active flag to false
    }

    // Function to reactivate the contract (if needed)
    function reactivateContract() public only_owner {
        is_active = true; // Set the active flag to true
    }
    function getContestants() public view returns (string[] memory) {
    return CONTESTENT_NAME;
}
}