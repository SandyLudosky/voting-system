import { useState, useEffect, useMemo } from "react";

const useContract = (instance, admin) => {
  const [isPending, setPending] = useState(true);
  const [currentVoter, setCurrentVoter] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [status, setStatus] = useState(0);
  const [count, setCount] = useState(0);
  const [eventTxHash, setTxHash] = useState("");
  const [state, setState] = useState({
    event: "",
    currentVoter: null,
  });

  const handleEvent = async ({ transactionHash, event }, message) => {
    countVoters();
    setTxHash(event, transactionHash);
    setToast({ visible: true, message: message });
    setState({ ...state, event: event });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  const countVoters = async () => {
    if (!instance) {
      return false;
    }
    const votersCount = await instance.methods.votersCount().call();
    setCount(votersCount);
  };

  const updateStatus = (e) => {
    setStatus(e.returnValues.newStatus);
    setState({ ...state, event: e.event });
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

  const getStatus = async () => {
    if (!instance) {
      return false;
    }
    instance.methods
      .status()
      .call()
      .then(([index]) => setStatus(index));
  };

  const whiteList = async (instance) => {
    if (!instance) {
      return false;
    }
    const voters = await instance.methods.getVoters().call();
    return await Promise.all(
      voters.map(async (address) => {
        const {
          isRegistered,
          _address,
          hasVoted,
        } = await instance.methods.whiteList(address).call();

        return {
          address: _address,
          isWhitelisted: isRegistered,
          hasVoted: hasVoted,
        };
      })
    ).then((values) => values.filter((value) => value.isWhitelisted));
  };
  const getProposals = async (instance) => {
    if (!instance) {
      return false;
    }
    let propals = [];
    const proposalCount = await instance.methods.proposalIds().call();
    return new Promise(async (resolve) => {
      for (let i = 0; i <= proposalCount; i++) {
        const proposal = await instance.methods.proposals(i).call();
        if (!!proposal.description.length) {
          propals.push(proposal);
        }
      }
      resolve(propals);
    }).then((values) => values);
  };

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
  const startProposal = async () => {
    await instance.methods.startProposalRegistration().send({ from: admin });
  };
  const endProposal = async () => {
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

  useEffect(() => {
    subscribeEvents();
    getStatus();
    countVoters();
  }, [instance]);

  const value = useMemo(() => {
    return {
      ...state,
      status,
      count,
      eventTxHash,
      transactionIsPending: isPending,
      toast,
      whiteList,
      getProposals,
      addVoter,
      removeVoter,
      startProposal,
      endProposal,
      startVotingSession,
      endVotingSession,
      resetVotingSession,
      addProposal,
      removeProposal,
      vote,
    };
  }, [status, count, eventTxHash, isPending, toast]);
  return value;
};
export default useContract;
