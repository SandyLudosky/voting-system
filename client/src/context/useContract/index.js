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

  const { count, whiteList, getProposals, countVoters, getWinningProposal } = ReadContract(
    instance
  );
  const [transactionStatus, setTransactionStatus] = useState({
    status: TRANSACTION_STATUS.NIL,
    event: null,
  });

  const [event, setEvent] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [status, setStatus] = useState(0);
  const [eventTxHash, setTxHash] = useState("");

  const getStatus = async () => {
    if (!instance) {
      return false;
    }
    instance.methods
      .status()
      .call()
      .then(([index]) => setStatus(index))

  };

  const updateStatus = (data) => setStatus(data.returnValues.newStatus);
  
  const registerEvent = (data) => {
    setTxHash(data.transactionHash);
    setEvent(data.event);
  };

  const displayToast = (message) => {
    setToast({ visible: true, message: message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2000);
  };

  const handleTransaction = async (data, message) => {
    return new Promise((resolve) => {
      setTransactionStatus({
        status: TRANSACTION_STATUS.PENDING,
        event: data.event,
      });
      const web3 = new Web3(window.ethereum);
      web3.eth.getTransactionReceipt(data.transactionHash).then((result) => {
        setTimeout(() => {
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
        }, 5000);
        resolve(data);
      });
    });
  };

  const subscribeEvents = () => {
    if (!instance) {
      return false;
    }
    instance.events.allEvents( {
      },(error,event)=> {
        if(error) {
          throw error
        }
        handleTransaction(event, `✅ ${event.event} !`)
        if(event.event == "WorkflowStatusChange"){
          updateStatus(event);
        } else if(event.event == "VotingSessionEnded"){
          document.location.reload()
        } else {
          registerEvent(event);
        }
      })
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
  }, [status, event, transactionStatus, count, eventTxHash, state, toast]);
};
export default useContract;
