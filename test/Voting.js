const { assert } = require("chai");
const should = require("chai").should();
const Voting = artifacts.require("Voting");
const truffleAssert = require("truffle-assertions");

contract("Voting", (accounts) => {
  let [account1, account2, account3, account4] = accounts;
  let owner = account1;
  let whitelisted = account4;
  let votingInstance;
  let proposal = "Diego";

  beforeEach(async () => {
    votingInstance = await Voting.new();
    await votingInstance.addVoter(whitelisted, { from: owner }); //adding to whitelist
  });

  it("should deploy", async () => {
    should.exist(votingInstance.address);
  });

  it("should be status == RegisteringVoters", async () => {
    const status = await votingInstance.status();
    assert.equal(status.toNumber(), 0,"status is not RegisteringVoters");
  });

  context("add/delete voter", () => {
    it("should be able to add voter as a owner", async () => {
      await votingInstance.addVoter(account3, { from: owner });
      const voter = await votingInstance.whiteList.call(account3);
      assert(voter);
    });

    it("should not be able to add voter as a non owner", async () => {
      await truffleAssert.reverts(
        votingInstance.addVoter(account4, {
          from: account2,
        })
      );
    });
    it("should be able to delete voter as a owner", async () => {
      await votingInstance.deleteVoter(account3, { from: owner });
      const voter = await votingInstance.whiteList.call(account3);
      should.not.exist(voter.address);
    });
    it("should not be able to delete voter as non owner", async () => {
      try {
        await votingInstance.deleteVoter(account3, { from: account2 });
        assert(false);
      } catch (err) {
        should.exist(err);
      }
    });
  });
  context("startProposalRegistration", () => {
    it("should be status == ProposalsRegistrationStarted", async () => {
      await votingInstance.startProposalRegistration({ from: owner });
      const status = await votingInstance.status.call();
      assert.equal(status.toNumber(), 1);
    });
    it("should fail to startProposalRegistration as non owner", async () => {
      await truffleAssert.reverts(
        votingInstance.startProposalRegistration({
          from: account2,
        })
      );
    });
    it("should be able to add proposal if status == ProposalsRegistrationStarted", async () => {
      await votingInstance.startProposalRegistration({ from: owner });
      assert.ok(
        await votingInstance.addProposal(proposal, { from: whitelisted })
      );
    });
  });

  context("startVotingSession", () => {
    // await votingInstance.startVotingSession({ from: owner });
    //await votingInstance.addProposal(proposal, { from: whitelisted })
    it("should fail to start voting session if not owner", async () => {
      await truffleAssert.reverts(
        votingInstance.startVotingSession({
          from: account2,
        })
      );
    });
  });
});
