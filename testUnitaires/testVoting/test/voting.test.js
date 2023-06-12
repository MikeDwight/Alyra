const { ethers } = require('hardhat');
const { expect, assert } = require('chai');
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

describe("Test voting", function () {

    let voting, owner, Mike, Prissy

    beforeEach(async function () {
        let votingContract = await ethers.getContractFactory("Voting") // Récupère le contrat "Voting"
        voting = await votingContract.deploy() // "voting" = contrat déployé
        await voting.deployed();

        [owner, Mike, Prissy] = await ethers.getSigners() // Récupère les comptes hardhat de test
    })

    describe("Initialization", function () {
        it('should deploy the smart contract', async function () {
            let theOwner = await voting.owner() // .owner() renvois le owner (ownable d'openzeppelin)
            assert.equal(owner.address, theOwner) // je m'attends à ce que l'adresse du owner est bien le owner
        })
    })

    describe("Test Getter", function () {

        describe("Test GetVoter", function () {

            it("should return the information of a voter", async function () {
                await voting.addVoter(Mike.address); // Avec le owwner, je whitelist Mike

                const voter = await voting.connect(Mike.address).getVoter(Mike.address); // Avec Mike, j'utilise la fonction getVoter() sur Mike

                expect(voter.isRegistered).to.be.true; // J'attend que isRegistered soit true
                expect(voter.hasVoted).to.be.oneOf([true, false]); // J'attend que hasVoted soit false ou true en fonction de si je lance getVote() avant ou après qu'il est voté
                expect(voter.votedProposalId).to.be.instanceOf(ethers.BigNumber); // J'attend que votedProposalId soit un nombre, 0 s'il n'a pas voté, l'ID de la proposal s'il à voté
            });

            it("should revert when the function is call by a non whitelisted", async function () {
                await expectRevert(voting.connect(Mike.address).getVoter(Mike.address), "You're not a voter"); // Je m'attends à avoir un message d'erreur si j'appelle la fonction avec une adresse non-whitelisté
            });
        })

        describe("Test getOneProposal", function () {

            it("should return the information of a valid proposal", async function () {
                await voting.addVoter(Mike.address);

                await voting.startProposalsRegistering(); // Je lance la fonction startProposalsRegistering() avec owner

                await voting.connect(Mike).addProposal("Proposal 1"); // J'ajoute une proposition avec Mike

                const proposalId = 1;

                const proposal = await voting.connect(Mike.address).getOneProposal(proposalId); // Je lance la fonction getOneProposal() sur l'id 1 avec Mike

                expect(proposal.description).to.equal("Proposal 1"); // Je m'attends à ce que la déscription de la proposition à l'id 1 soit Proposal 1
                expect(proposal.voteCount).to.equal(0); // Je m'attends à ce que le voteCount de la propositon à l'id 1 soit 0 car personne n'a encore voté pour cette proposition
            });

            it("should return 'GENESIS' and '0' if no proposal submit yet", async function () {
                await voting.addVoter(Mike.address);

                await voting.startProposalsRegistering();

                const proposal = await voting.connect(Mike.address).getOneProposal(0); // Je lance la fonction getOneProposal() sur l'id 0 avec Mike

                expect(proposal.description).to.equal("GENESIS"); // Je m'attends à ce que la déscription de la proposition à l'id 0 soit GENESIS
                expect(proposal.voteCount).to.equal(0); // Je m'attends à ce que le voteCount de la propositon à l'id 0 soit 0 
            });

            it("should revert if the proposal phase isn't start", async function () {
                await voting.addVoter(Mike.address);
                expect(voting.connect(Mike.address).getOneProposal(0), "Proposals are not allowed yet"); // Je m'attends à ce que ça revert si je demande la proposal 0 sans être dans la phase de proposition
            })

            it("should revert when the function is call by a non whitelisted", async function () {
                await expectRevert(voting.connect(Mike.address).getOneProposal(Mike.address), "You're not a voter"); // Je m'attends à ceque ça revert si j'appelle la fonction getOneProposal() avec une adresse non whitelisté
            });
        })
    })

    describe("Test Registration", function () {

        it("sould add a voter to a whitelist", async function () {
            await voting.addVoter(Mike.address);
            const voter = await voting.connect(Mike.address).getVoter(Mike.address); // Je lance la fonction getVoter() avec Mike
            expect(voter.isRegistered).to.be.true; // Je m'attends à ce que l'enregistrement de Mike renvoie true
        })

        it("sould emit an event with the adress of the registered", async function () {
            let voter = (await voting.addVoter(Mike.address));
            await expect(voter)
                .to.emit(voting, "VoterRegistered")
                .withArgs(Mike.address);
            // J'ai essayé avec cette synthaxe en vain, sans jamais comprend pourquoi :'(
            // await expectEvent(voter, "VoterRegistered", { voterAddress: Mike.address });  
        })

        it("should revert if address is already registered", async function () {
            await voting.addVoter(Mike.address);
            await expectRevert(voting.addVoter(Mike.address), "Already registered"); // Je m'attends à ce que Mike soit déja enregistré
        })

        it("should revert if the Workflow status isn't RegisteringVoters", async function () {
            await voting.startProposalsRegistering(); // Je sors du status RegisteringVoters
            await expectRevert(voting.addVoter(Mike.address), "Voters registration is not open yet"); // Je m'attends à ce que ça revert car je ne suis pas dans le statut RegisteringVoters
        })

        it("should revert if isn't the owner who try to register a voter", async function () {
            await expectRevert(voting.connect(Mike).addVoter(Mike.address), "Ownable: caller is not the owner"); // Je m'attends à ce que ça revert car je n'appelle pas la fonction avec le owner
        })
    })

    describe("Test Proposal", function () {

        it("should register a proposal", async function () {
            await voting.addVoter(Mike.address);
            await voting.startProposalsRegistering(); // J'entre dans la phase d'enregistrement de proposition

            await voting.connect(Mike).addProposal("Proposal 1"); // J'ajoute une proposition avec Mike

            const proposalId = 1;
            const Proposal = await voting.connect(Mike.address).getOneProposal(proposalId); // Je lance la fonction getOneProposal(1) sur l'id 0 avec Mike
            expect(Proposal.description).to.equal("Proposal 1"); // Je m'attends à ce que la description de la proposition à l'id 1 soit Proposal 1
            expect(Proposal.voteCount).to.equal(0); // Je m'attends à ce que le voteCount de la propositon à l'id 1 soit 0  
        })

        it("sould revert if a non voter try to add a proposal", async function () {
            await expectRevert(voting.connect(Mike).addProposal(Mike.address), "You're not a voter");
        })

        it("should revert if the Workflow status isn't ProposalsRegistrationStarted", async function () {
            await voting.addVoter(Mike.address);
            await expectRevert(voting.connect(Mike).addProposal("Proposal 1"), "Proposals are not allowed yet");
        })

        it("should revert if the proposal is empty", async function () {
            await voting.addVoter(Mike.address);
            await voting.startProposalsRegistering();
            await expectRevert(voting.connect(Mike).addProposal(""), "Vous ne pouvez pas ne rien proposer"); // Je m'attends à ce que ça revert car j'ai émis une proposition vide
        })
        it("should emit an event with the ID of the proposition", async function () {
            await voting.addVoter(Mike.address);
            await voting.startProposalsRegistering();
            proposalId = 1;
            proposal = await voting.connect(Mike).addProposal("Proposal 1");
            await expect(proposal)
                .to.emit(voting, "ProposalRegistered")
                .withArgs(proposalId);
        })
    })

    describe("Test Vote", function () {

        it("should register a vote", async function () {
            await voting.addVoter(Mike.address);

            await voting.startProposalsRegistering(); // J'entre dans la phase de proposition
            await voting.connect(Mike).addProposal("Proposal 1"); // J'ajoute la proposal 1 avec Mike
            await voting.endProposalsRegistering(); // Je ferme la phase de proposition
            await voting.startVotingSession(); // J'entre dans la phase de vote

            const vote = await voting.connect(Mike).setVote(1) // Je vote 1 avec Mike

            const mike = await voting.connect(Mike).getVoter(Mike.address); // Je récupère les informations de Mike
            const proposalId = 1;
            const proposal = await voting.connect(Mike).getOneProposal(proposalId); // Je récupére les informations de la proposition 1


            expect(mike.votedProposalId).to.equal(proposalId); // Je m'attends à ce que l'id du vote de Mike soit 1
            expect(mike.hasVoted).to.equal(true); // Je m'attendss à ce que mike est voté
            expect(proposal.voteCount).to.equal(1); // Je m'attends à ce que le voteCount de l'id 1 a été incrémenté de 1.0 -> 1
        })

        it("sould revert if a non voter try to vote", async function () {
            await expectRevert(voting.connect(Mike).setVote(1), "You're not a voter");
        })

        it("should revert if the Workflow status isn't VotingSessionStarted", async function () {
            await voting.addVoter(Mike.address);
            await expectRevert(voting.connect(Mike).setVote(1), "Voting session havent started yet");
        })

        it("should revert if the voter has already voted", async function () {
            await voting.addVoter(Mike.address);

            await voting.startProposalsRegistering();
            await voting.connect(Mike).addProposal("Proposal 1");
            await voting.endProposalsRegistering();
            await voting.startVotingSession();

            const vote = await voting.connect(Mike).setVote(1)

            await expectRevert(voting.connect(Mike).setVote(1), "You have already voted"); // Je m'attends à ce que ça revert car Mike à déja voté
        })

        it("should revert if the proposal isn't found", async function () {
            await voting.addVoter(Mike.address);

            await voting.startProposalsRegistering();
            await voting.endProposalsRegistering();
            await voting.startVotingSession();

            await expectRevert(voting.connect(Mike).setVote(1), "Proposal not found"); // Je m'attends à ce qu'auncune proposition ne soit trouvé à l'id 1
        })

        it("should emit an event with the address of the voter and the ID of his vote", async function () {
            await voting.addVoter(Mike.address);

            await voting.startProposalsRegistering();
            await voting.connect(Mike).addProposal("Proposal 1");
            await voting.endProposalsRegistering();
            await voting.startVotingSession();

            const proposalId = 1;
            const vote = await voting.connect(Mike).setVote(proposalId)

            await expect(vote)
                .to.emit(voting, "Voted")
                .withArgs(Mike.address, proposalId);
        })
    })

    describe("Test States", function () {
        describe("Test startProposalsRegistering", function () {

            it("sould start the proposal registration and add the index 0 proposal to 'GENESIS'", async function () {
                await voting.addVoter(owner.address);

                await voting.startProposalsRegistering();

                const status = await voting.workflowStatus();
                expect(status).to.equal(1); // Je verifie que le statut est bien passé a 1 soit ProposalsRegistrationStarted

                await voting.addProposal("GENESIS"); // J'ajoute la proposition GENESIS avec owner
                const proposal = await voting.getOneProposal(0);
                expect(proposal.description).to.equal("GENESIS"); // Je m'attends à ce que la decription de la proposition 0 soit GENESIS
            })

            it("should revert if isn't the owner who try to change the state", async function () {
                expectRevert(voting.connect(Mike).startProposalsRegistering(), "Ownable: caller is not the owner"); // Je m'attends à ce que sa revert car ce n'est pas le owner qui change le status
            })

            it("should revert if if the status isn't RegisteringVoters", async function () {
                await voting.startProposalsRegistering();
                expectRevert(voting.startProposalsRegistering(), "Registering proposals cant be started now");

            })

            it("should emit an event with the previous and the new status", async function () {
                const previousStatus = await voting.workflowStatus();

                await voting.addVoter(owner.address);

                const startStatus = await voting.startProposalsRegistering();
                const newStatus = await voting.workflowStatus();

                await voting.addProposal("GENESIS");
                const proposal = await voting.getOneProposal(0);
                expect(proposal.description).to.equal("GENESIS");

                await expect(startStatus)
                    .to.emit(voting, "WorkflowStatusChange")
                    .withArgs(previousStatus, newStatus);
            })

        })

        describe("Test endProposalsRegistering", function () {

            it("should end the proposal registration", async function () {
                await voting.addVoter(owner.address);


                await voting.startProposalsRegistering();

                await voting.endProposalsRegistering();

                const status = await voting.workflowStatus();
                expect(status).to.equal(2); // Je m'attends à ce que le status soit passé à ProposalsRegistrationEnded
            })

            it("should revert if isn't the owner who try to change de state", async function () {
                expectRevert(voting.connect(Mike).endProposalsRegistering(), "Ownable: caller is not the owner");
            })

            it("should revert if if the status isn't ProposalsRegistrationStarted", async function () {
                expectRevert(voting.endProposalsRegistering(), "Registering proposals havent started yet");
                expectRevert(voting.startVotingSession(), "Registering proposals havent started yet");
                expectRevert(voting.endVotingSession(), "Registering proposals havent started yet");
                expectRevert(voting.tallyVotes(), "Registering proposals havent started yet");
            })

            it("should emit an event with the previous and the new status", async function () {
                await voting.addVoter(owner.address);

                await voting.startProposalsRegistering();
                const previousStatus = await voting.workflowStatus();

                startStatus = await voting.endProposalsRegistering();
                const newStatus = await voting.workflowStatus();



                const status = await voting.workflowStatus();
                expect(status).to.equal(2);

                await expect(startStatus)
                    .to.emit(voting, "WorkflowStatusChange")
                    .withArgs(previousStatus, newStatus);
            })

        })

        describe("Test startVotingSession", function () {

            it("should start the voting session", async function () {
                await voting.addVoter(owner.address);

                await voting.startProposalsRegistering();

                await voting.endProposalsRegistering();

                await voting.startVotingSession();

                const status = await voting.workflowStatus();
                expect(status).to.equal(3);
            })

            it("should revert if isn't the owner who try to change de state", async function () {
                expectRevert(voting.connect(Mike).startVotingSession(), "Ownable: caller is not the owner");
            })

            it("should revert if the status isn't ProposalsRegistrationEnded", async function () {
                expectRevert(voting.startVotingSession(), "Registering proposals phase is not finished");
                expectRevert(voting.startProposalsRegistering(), "Registering proposals phase is not finished");
                expectRevert(voting.endVotingSession(), "Registering proposals phase is not finished");
                expectRevert(voting.tallyVotes(), "Registering proposals phase is not finished");

            })

            it("should emit an event with the previous and the new status", async function () {
                await voting.addVoter(owner.address);

                await voting.startProposalsRegistering();

                await voting.endProposalsRegistering();
                const previousStatus = await voting.workflowStatus();

                const startStatus = await voting.startVotingSession();
                const newStatus = await voting.workflowStatus();


                const status = await voting.workflowStatus();
                expect(status).to.equal(3);


                await expect(startStatus)
                    .to.emit(voting, "WorkflowStatusChange")
                    .withArgs(previousStatus, newStatus);
            })

        })

        describe("Test endVotingSession", function () {

            it("should end the voting session", async function () {
                await voting.addVoter(owner.address);

                await voting.startProposalsRegistering();

                await voting.endProposalsRegistering();

                await voting.startVotingSession();

                await voting.endVotingSession();


                const status = await voting.workflowStatus();
                expect(status).to.equal(4);

            })

            it("should revert if isn't the owner who try to change de state", async function () {
                expectRevert(voting.connect(Mike).endVotingSession(), "Ownable: caller is not the owner");
            })

            it("should revert if if the status isn't VotingSessionStarted", async function () {
                expectRevert(voting.endProposalsRegistering(), "Voting session havent started yet");
                expectRevert(voting.startProposalsRegistering(), "Voting session havent started yet");
                expectRevert(voting.endVotingSession(), "Voting session havent started yet");
                expectRevert(voting.tallyVotes(), "Voting session havent started yet");

            })

            it("should emit an event with the previous and the new status", async function () {
                await voting.addVoter(owner.address);

                await voting.startProposalsRegistering();

                await voting.endProposalsRegistering();

                await voting.startVotingSession();
                const previousStatus = await voting.workflowStatus();

                const startStatus = await voting.endVotingSession();
                const newStatus = await voting.workflowStatus();

                const status = await voting.workflowStatus();
                expect(status).to.equal(4);

                await expect(startStatus)
                    .to.emit(voting, "WorkflowStatusChange")
                    .withArgs(previousStatus, newStatus);
            })

        })

        describe("Test tallyVotes", function () {

            it("should return the winner proposal", async function () {
                await voting.addVoter(owner.address);
                await voting.addVoter(Mike.address);
                await voting.addVoter(Prissy.address);

                await voting.startProposalsRegistering();

                await voting.connect(Mike).addProposal("Proposal 1");
                await voting.connect(Prissy).addProposal("Proposal 2");

                await voting.endProposalsRegistering();

                await voting.startVotingSession();

                await voting.connect(Mike).setVote(1);
                await voting.connect(Prissy).setVote(1);

                await voting.endVotingSession();

                await voting.tallyVotes();

                const P1 = await voting.getOneProposal(1);
                const P2 = await voting.getOneProposal(2);
                expect(P1.voteCount).to.equal(2); // Je m'attends à ce que le nombre de vote de la proposition 1 soit de 2
            })

            it("should revert if isn't the owner who change the state", async function () {
                expectRevert(voting.connect(Mike).tallyVotes(), "Ownable: caller is not the owner");
            })

            it("should revert if the status isn't VotingSessionEnded", async function () {
                expectRevert(voting.startProposalsRegistering(), "Current status is not voting session ended");
                expectRevert(voting.endProposalsRegistering(), "Current status is not voting session ended");
                expectRevert(voting.startVotingSession(), "Current status is not voting session ended");
                expectRevert(voting.tallyVotes(), "Current status is not voting session ended");
            })

            it("should emit an event with the previous and the new status", async function () {
                await voting.addVoter(owner.address);
                await voting.addVoter(Mike.address);
                await voting.addVoter(Prissy.address);

                await voting.startProposalsRegistering();

                await voting.connect(Mike).addProposal("Proposal 1");
                await voting.connect(Prissy).addProposal("Proposal 2");

                await voting.endProposalsRegistering();

                await voting.startVotingSession();

                await voting.connect(Mike).setVote(1);
                await voting.connect(Prissy).setVote(1);

                await voting.endVotingSession();
                const previousStatus = await voting.workflowStatus();

                const startStatus = await voting.tallyVotes();
                const newStatus = await voting.workflowStatus();

                const P1 = await voting.getOneProposal(1);
                const P2 = await voting.getOneProposal(2);
                expect(P1.voteCount).to.equal(2);

                await expect(startStatus)
                    .to.emit(voting, "WorkflowStatusChange")
                    .withArgs(previousStatus, newStatus);
            })

        })
    })
})