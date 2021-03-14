import { useState, useEffect, useMemo } from "react";
import Web3 from "web3";
import WriteContract from "./writeContract";
import ReadContract from "./readContract";

const useContract = (instance, admin) => {
  const TRANSACTION_STATUS = {
    NIL: "null",
    PENDING: "pending",
    COMPLETED: "completed",
  };
  const {
    state,
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

  const { count, whiteList, getProposals, countVoters } = ReadContract(
    instance
  );
  const [transactionStatus, setTransactionStatus] = useState(
    TRANSACTION_STATUS.NIL
  );

  const [event, setEvent] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [status, setStatus] = useState(0);
  const [eventTxHash, setTxHash] = useState("");

  const handleTransactionStatus = async (transactionHash) => {
    setTransactionStatus(TRANSACTION_STATUS.PENDING);
    const web3 = new Web3(window.ethereum);
    web3.eth.getTransactionReceipt(transactionHash).then((result) => {
      setTimeout(() => {
        setTransactionStatus(TRANSACTION_STATUS.COMPLETED);
        console.log(result.status);
      }, 5000);
    });
  };
  const handleEvent = ({ transactionHash, event }, message) => {
    countVoters();
    handleTransactionStatus(transactionHash);
    setTxHash(transactionHash);
    setToast({ visible: true, message: message });
    setEvent(event);
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  const updateStatus = (e) => {
    handleTransactionStatus(e.transactionHash);
    setStatus(e.returnValues.newStatus);
    setEvent(e.event);
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
    countVoters();
  }, [instance]);

  return useMemo(() => {
    return {
      TRANSACTION_STATUS,
      transactionStatus,
      status,
      count,
      eventTxHash,
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
  }, [status, event, transactionStatus, count, eventTxHash, state, toast]);
};
export default useContract;
