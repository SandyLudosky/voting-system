import { useState, useEffect, useCallback } from "react";
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

  const {
    count,
    whiteList,
    getProposals,
    countVoters,
    getWinningProposal,
  } = ReadContract(instance);
  const [transactionStatus, setTransactionStatus] = useState({
    status: TRANSACTION_STATUS.NIL,
    event: null,
  });

  const [toast, setToast] = useState({ visible: false, message: "" });
  const [status, setStatus] = useState(0);
  const [eventTxHash, setTxHash] = useState("");

  const getStatus = useCallback(async () => {
    if (!instance) {
      return false;
    }
    instance.methods
      .status()
      .call()
      .then(([index]) => setStatus(index));
  }, [instance]);

  const updateStatus = (data) => setStatus(data.returnValues.newStatus);

  const registerEvent = (data) => {
    setTxHash(data.transactionHash);
  };

  const displayToast = (message) => {
    setToast({ visible: true, message: message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2000);
  };

  const handleTransaction = useCallback(
    async (data, message) => {
      return new Promise((resolve) => {
        setTransactionStatus({
          status: TRANSACTION_STATUS.PENDING,
          event: data.event,
        });
        const web3 = new Web3(window.ethereum);
        web3.eth.getTransactionReceipt(data.transactionHash).then((result) => {
          console.dir(result);
          setTransactionStatus({
            status: result.status
              ? TRANSACTION_STATUS.COMPLETED
              : TRANSACTION_STATUS.NIL,
            event: data.event,
          });
          countVoters();
          if (data.event !== "WorkflowStatusChange") {
            displayToast(message);
          }
          resolve(data);
        });
      });
    },
    [
      countVoters,
      TRANSACTION_STATUS.PENDING,
      TRANSACTION_STATUS.COMPLETED,
      TRANSACTION_STATUS.NIL,
    ]
  );

  const subscribeEvents = useCallback(() => {
    if (!instance) {
      return false;
    }
    instance.events.allEvents({}, (error, event) => {
      if (error) {
        throw error;
      }
      handleTransaction(event, `✅ ${event.event} !`);
      if (event.event === "WorkflowStatusChange") {
        updateStatus(event);
      } else if (event.event === "VotingSessionEnded") {
        document.location.reload();
      } else {
        registerEvent(event);
      }
    });
  }, [instance, handleTransaction]);

  useEffect(() => {
    subscribeEvents();
    getStatus();
    countVoters();
  }, [getStatus, countVoters, subscribeEvents]);

  return {
    TRANSACTION_STATUS,
    transactionStatus,
    status,
    count,
    eventTxHash,
    toast,
    whiteList,
    getProposals,
    getWinningProposal,
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
export default useContract;
