import { useState, useEffect, useMemo } from "react";

const useContract = (instance, admin) => {
  const list = [
    "0xc537934a1A6537DF4549E43a3234d622f63Da124",
    "0xb2f331950C73A0865a06cdc6BaA8beB520C40A00",
    "0x43197DA71F8142b0EDA876BEf3bd498E30037444",
    "0xD56AeAE8b0b0316Ca9BE6dbDb71ebeefA9B7C7E4",
    "0x7beD5d8779c09702dD4385020A11aa622863edfE",
  ];

  const [toast, setToast] = useState({ visible: false, message: "" });
  const [isValidated, setValidated] = useState(true);
  const [eventTxHash, setTxHash] = useState("");
  const [state, setState] = useState({
    status: 0,
    event: "",
    currentVoter: null,
  });

  const displayToast = (data, message) => {
    setTxHash(data.event.transactionHash);
    setToast({ visible: true, message: message });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  const updateStatus = (e) => setState({ ...state, event: e.event });
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
      .on("data", (data) => displayToast(data, "✅ New voter added"))
      .on("error", console.error);
    instance.events
      .VoterRemoved(state.currentVoter)
      .on("data", (data) => displayToast(data, "❌ voter removed"))
      .on("error", console.error);
    instance.events
      .ProposalRegistered()
      .on("data", (data) => displayToast(data, "✅ New proposal added"))
      .on("error", console.error);
  };

  const whiteList = async (instance) => {
    if (!instance) {
      return false;
    }
    return await Promise.all(
      list.map(async (address) => {
        const { isRegistered } = await instance.methods
          .whiteList(address)
          .call();
        return {
          isWhitelisted: isRegistered,
          address: address,
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
    console.log(proposalCount);
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

  useEffect(() => {
    subscribeEvents();
    getStatus();
  }, [instance]);
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
    addProposal,
  };
};
export default useContract;
