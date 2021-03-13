import { useState } from "react";

const WriteContract = (instance, admin) => {
  const [isPending, setPending] = useState(true);
  const [currentVoter, setCurrentVoter] = useState(null);

  const addVoter = async (address) => {
    setPending(false);
    setCurrentVoter(address);
    await instance.methods
      .addVoter(address)
      .send({ from: admin })
      .then((result) => {
        setTimeout(() => {
          setPending(result.status);
        }, 5000);
      });
  };

  const removeVoter = async (address) => {
    setPending(false);
    setCurrentVoter(address);
    await instance.methods
      .deleteVoter(address)
      .send({ from: admin })
      .then((result) => {
        setTimeout(() => {
          setPending(result.status);
        }, 5000);
      });
  };

  const addProposal = async (content) => {
    setPending(false);
    await instance.methods
      .addProposal(content)
      .send({ from: admin })
      .then((result) => {
        setTimeout(() => {
          setPending(result.status);
        }, 5000);
      });
  };

  const removeProposal = async (content) => {
    setPending(false);
    await instance.methods
      .deleteProposal(content)
      .send({ from: admin })
      .then((result) => {
        setTimeout(() => {
          setPending(result.status);
        }, 5000);
      });
  };

  const vote = async (id) => {
    await instance.methods.vote(id).send({ from: admin });
  };
  const startProposalSession = async () => {
    await instance.methods.startProposalRegistration().send({ from: admin });
  };
  const endProposalSession = async () => {
    await instance.methods.endProposalRegistration().send({ from: admin });
  };
  const startVotingSession = async () => {
    await instance.methods.startVotingSession().send({ from: admin });
  };
  const endVotingSession = async () => {
    await instance.methods.endVotingSession().send({ from: admin });
  };
  const resetVotingSession = async () => {
    await instance.methods.resetVotingSession().send({ from: admin });
  };

  return {
    isPending,
    currentVoter,
    addVoter,
    removeVoter,
    startProposalSession,
    endProposalSession,
    startVotingSession,
    endVotingSession,
    resetVotingSession,
    addProposal,
    removeProposal,
    vote,
  };
};
export default WriteContract;
