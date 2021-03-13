import { useState, useEffect, useMemo } from "react";

// readContract
// writeContract
const useContract = (instance, admin) => {
  const list = [
    "0xc537934a1A6537DF4549E43a3234d622f63Da124",
    "0xb2f331950C73A0865a06cdc6BaA8beB520C40A00",
    "0x43197DA71F8142b0EDA876BEf3bd498E30037444",
    "0xD56AeAE8b0b0316Ca9BE6dbDb71ebeefA9B7C7E4",
    "0x7309f9401f931f81Ff1715FC73E8f0fcd370B0cD",
  ];

  const [toast, setToast] = useState({ visible: false, message: "" });
  const [isValidated, setValidated] = useState(true);
  const [eventTxHash, setTxHash] = useState("");
  const [state, setState] = useState({
    status: 0,
    count: 0,
    event: "",
    currentVoter: null,
  });

  const handleEvent = async ({ transactionHash, event }, message) => {
    countVoters();
    setTxHash(transactionHash);
    setToast({ visible: true, message: message });
    setState({ ...state, event: event });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  const countVoters = async () => {
    if (!instance) {
      return false;
    }
    const votersCount = await instance.methods.votersCount().call();
    setState({ ...state, count: votersCount });
  };

  const updateStatus = (e) =>
    setState({ ...state, status: e.returnValues.newStatus, event: e.event });

  const subscribeEvents = () => {
    if (!instance) {
      return false;
    }
    instance.events
      .WorkflowStatusChange()
      .on("data", updateStatus)
      .on("error", console.error);
    instance.events
      .VoterRegistered(state.currentVoter)
      .on("data", (data) => handleEvent(data, "✅ New voter added"))
      .on("error", console.error);
    instance.events
      .VoterRemoved(state.currentVoter)
      .on("data", (data) => handleEvent(data, "❌ voter removed"))
      .on("error", console.error);
    instance.events
      .ProposalRegistered()
      .on("data", (data) => handleEvent(data, "✅ New proposal added"))
      .on("error", console.error);
    instance.events
      .NewVotingSystem()
      .on("data", (data) => handleEvent(data, "Voting System reset"))
      .on("error", console.error);
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
    ).then((values) => values);
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

  const getStatus = async () => {
    if (!instance) {
      return false;
    }
    return await Promise.all(await instance.methods.status().call()).then(
      ([index]) => {
        setState({ ...state, status: index });
      }
    );
  };

  const add = async (address) => {
    await instance.methods
      .addVoter(address)
      .send({ from: admin })
      .then((result) => {
        setValidated(false);
        setTimeout(() => {
          setValidated(result.status);
        }, 5000);
      });
    setState({ ...state, currentVoter: address });
  };

  const remove = async (address) => {
    setState({ ...state, currentVoter: address });
    await instance.methods
      .deleteVoter(address)
      .send({ from: admin })
      .then((result) => {
        setValidated(false);
        setTimeout(() => {
          setValidated(result.status);
        }, 5000);
      });
  };

  const addProposal = async (content) => {
    await instance.methods.addProposal(content).send({ from: admin });
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
      eventTxHash,
      isValidated,
      toast,
      whiteList,
      getProposals,
      add,
      remove,
      startProposal,
      endProposal,
      startVotingSession,
      endVotingSession,
      resetVotingSession,
      addProposal,
    };
  }, [state, eventTxHash, isValidated, toast]);
  return value;
};
export default useContract;
