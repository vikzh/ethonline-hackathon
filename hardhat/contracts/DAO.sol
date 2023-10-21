// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CelestialToken.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract DAO {
    using EnumerableSet for EnumerableSet.AddressSet;

    // The DAO token contract
    CelestialToken public celestialToken;
    uint256 public  _tableId;
    // Table prefix for the table (custom value)
    string public constant _TABLE_PREFIX = "celestial_table";

    // Proposal struct
    struct Proposal {
        uint256 id;
        address proposer;
        string name;
        string description;
        string x;
        string y;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
    }

    // Array of all proposals
    Proposal[] public  proposals;

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    // Mapping to check if an address has an active proposal
    mapping(address => bool) public activeProposals;

    // Event for a new proposal
    event NewProposal(uint256 indexed proposalId, address indexed proposer, string name, string description);

    // Event for a proposal execution
    event ProposalExecuted(uint256 indexed proposalId, address indexed proposer, address indexed recipient);

    constructor(CelestialToken _celestialToken) {
        celestialToken = _celestialToken;

        _tableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
            "id integer primary key," // Notice the trailing comma
            "x text,"
            "y text,"
            "description text",
            _TABLE_PREFIX
            )
        );
    }

    // Function to create a new proposal
    function createProposal(string memory _name, string memory _description, string memory _x, string memory _y) external {
        Proposal memory newProposal = Proposal({
            id: proposals.length,
            proposer: msg.sender,
            name: _name,
            description: _description,
            x: _x,
            y: _y,
            yesVotes: 0,
            noVotes: 0,
            executed: false
        });
        proposals.push(newProposal);
        activeProposals[msg.sender] = true;
        emit NewProposal(newProposal.id, msg.sender, _name, _description);
    }

    // Function to vote on a proposal
    function vote(uint256 _proposalId, bool _support) external {
        Proposal storage proposal = proposals[_proposalId];
        if (_support) {
            proposal.yesVotes += 1;
        } else {
            proposal.noVotes += 1;
        }
    }

    // Function to execute a proposal
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Proposal has already been executed");

        require(proposal.yesVotes > proposal.noVotes, "Proposal not approved by the community");
        celestialToken.mint(proposal.proposer, 1000000000000000000);
        proposal.executed = true;
        activeProposals[proposal.proposer] = false;

          TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toInsert(
            _TABLE_PREFIX,
            _tableId,
            "id,x,y,description",
            string.concat(
                Strings.toString(proposal.id), // Convert to a string
                ",",
                SQLHelpers.quote(proposal.x), // Wrap strings in single quotes
                ",",
                SQLHelpers.quote(proposal.y),
                ",",
                SQLHelpers.quote(proposal.description)
            )
            )
        );
        emit ProposalExecuted(_proposalId, proposal.proposer, proposal.proposer);
    }
}