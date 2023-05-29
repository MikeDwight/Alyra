// Voici mon système de voting !

// J'ai conscience que je n'ai pas réspecté 100% des recos et exigences, 
// mais le contrat fonctionne :D:D.
// Je suis assez satisfait du resultat,
// lorsque j'ai pris connaissance de l'énnoncé j'était complétement perdu,
// mais j'ai finalement appris beaucoup de choses.

// PS : Pour mettre en perspective ce code et mon niveau, j'ai passé environ 12h sur l'élaboration de ce smart contract.

// Bonne lecture / correction ! :)

// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol';

contract Voting is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }  

    // Je n'ai pas su utiliser les enum correctement
    // j'ai commencé mais je n'ai pas su comment les implémenter,
    // ni comment contraidre les voteurs
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }  

    WorkflowStatus startRegistration = WorkflowStatus.RegisteringVoters;
    WorkflowStatus startPoposals = WorkflowStatus.ProposalsRegistrationStarted;
    WorkflowStatus endPoposals = WorkflowStatus.ProposalsRegistrationEnded;
    WorkflowStatus startVote = WorkflowStatus.VotingSessionStarted;
    WorkflowStatus endVote = WorkflowStatus.VotingSessionEnded;
    WorkflowStatus results = WorkflowStatus.VotesTallied;

    // Administrateur = celui qui déploie le contrat
    address admin = msg.sender;
    
    Proposal[] proposals;

    mapping (address => bool) whitelist;
    mapping (address => Voter) voters;

    // Pas su implémenter cet 'event'
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
  
    // Permet d'avoir une trace de : 
    // l'adresse enregistré, 
    // la proposition soumise (le nom et pas l'index), 
    // l'adresse du voteur et son vote
    event VoterRegistered (address voterAddress);
    event ProposalRegistered (string _proposal);
    event Voted (address voter, uint vote);

    // utilisation d'un 'modifier' pour optimiser le code
    modifier onlyWhiteListed {
        require(whitelist[msg.sender] == true, "You are not allowed");
        _;
    }

    // L'admin whiteliste les adresses
    function authorize(address voterAddress) public onlyOwner {
       require(whitelist[voterAddress] != true, "Already whitelisted"); 
       whitelist[voterAddress] = true;
       emit VoterRegistered(voterAddress);
    }

    // Permet de savoir si une adresse est whitelistée ou non 
    function isWhiteListed(address _addr) public view returns (bool) {
        return whitelist[_addr];
    }
   
    // Permet à ceux qui sont whitelistés de faire une ou plusieurs proposition(s)
    function addProposal(string memory proposal) public onlyWhiteListed {
         proposals.push(Proposal({
             description: proposal,
             voteCount: 0
         }));
         emit ProposalRegistered(proposal);
    }

    // Permet de visualiser les propositions soumises avec leurs nombres de voix
    function viewProposal() public view returns(Proposal[] memory _proposals){
        return proposals;
    }

    // Permet à ceux qui sont whitelistés de voter, 1 seule fois, pour la proposition qu'ils souhaitent.
    // Il doivent renseigner le numéro de la proposition, la proposition 1 étant la numéro 1.
    // On voit qui à voté quoi
    function vote(uint _vote) public onlyWhiteListed {
        Voter storage sender = voters[msg.sender];
        require(!sender.hasVoted, "Already voted");
        sender.hasVoted = true;
        sender.votedProposalId = _vote;
        proposals[_vote - 1].voteCount ++;
        emit Voted(msg.sender, _vote);
    }

    // Retourne le nom de la proposition qui à eu le plus de voix
    function getWinner() public view returns(string memory winner) {
        uint winningVoteCount = 0;
        for(uint i = 0; i < proposals.length; i++) {
            if(proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                return proposals[i].description;
            }
        }
    }
   
}
