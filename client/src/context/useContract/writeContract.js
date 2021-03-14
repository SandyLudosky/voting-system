import { useState } from "react";

const WriteContract = (instance, admin) => {
  const [currentVoter, setCurrentVoter] = useState(null);

  const addVoter = async (address) => {
    setCurrentVoter(address);
    await instance.methods.addVoter(address).send({ from: admin });
  };
  const removeVoter = async (address) => {
    setCurrentVoter(address);
    await instance.methods.deleteVoter(address).send({ from: admin });
  };
  const addProposal = async (content) => {
    await instance.methods.addProposal(content).send({ from: admin });
  };
  const removeProposal = async (content) => {
    await instance.methods.deleteProposal(content).send({ from: admin });
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
