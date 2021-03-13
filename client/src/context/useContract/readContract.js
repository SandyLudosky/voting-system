const ReadContract = (instance) => {
  const countVoters = () => {
    return new Promise((resolve) => {
      if (!instance) {
        return false;
      }
      instance.methods.votersCount().call().then(resolve);
    });
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
  return {
    whiteList,
    getProposals,
    countVoters,
    getProposals,
  };
};
export default ReadContract;
