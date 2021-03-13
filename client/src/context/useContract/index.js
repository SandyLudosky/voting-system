import { useState, useEffect, useMemo } from "react";
import WriteContract from "./writeContract";
import ReadContract from "./readContract";

const useContract = (instance, admin) => {
  const {
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
  } = WriteContract(instance, admin);

  const { whiteList, getProposals, countVoters } = ReadContract(instance);

  const [count, setCount] = useState(0);
  const [event, setEvent] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [status, setStatus] = useState(0);
  const [eventTxHash, setTxHash] = useState("");

  const handleEvent = async ({ transactionHash, event }, message) => {
    countVoters().then(setCount);
    setTxHash(event, transactionHash);
    setToast({ visible: true, message: message });
    setEvent(event);
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  const updateStatus = (e) => {
    setStatus(e.returnValues.newStatus);
    setEvent(event);
  };
  const getStatus = async () => {
    if (!instance) {
      return false;
    }
    instance.methods
      .status()
      .call()
      .then(([index]) => setStatus(index));
  };

  const subscribeEvents = () => {
    if (!instance) {
      return false;
    }
    instance.events
      .WorkflowStatusChange()
      .on("data", updateStatus)
      .on("error", console.error);
    instance.events
      .VoterRegistered(currentVoter)
      .on("data", (data) => handleEvent(data, "✅ New voter added"))
      .on("error", console.error);
    instance.events
      .VoterRemoved(currentVoter)
      .on("data", (data) => handleEvent(data, "❌ voter removed"))
      .on("error", console.error);
    instance.events
      .ProposalRegistered()
      .on("data", (data) => handleEvent(data, "✅ New proposal added"))
      .on("error", console.error);
    instance.events
      .ProposalRemoved()
      .on("data", (data) => handleEvent(data, "✅ proposal removed"))
      .on("error", console.error);
    instance.events
      .NewVotingSystem()
      .on("data", (data) => handleEvent(data, "Voting System reset"))
      .on("error", console.error);
  };

  useEffect(() => {
    subscribeEvents();
    getStatus();
    countVoters().then(setCount);
  }, [instance]);

  return useMemo(() => {
    return {
      status,
      count,
      eventTxHash,
      transactionIsPending: isPending,
      toast,
      whiteList,
      getProposals,
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
  }, [status, count, eventTxHash, isPending, toast]);
};
export default useContract;
