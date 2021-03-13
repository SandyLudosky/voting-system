import React, { useMemo, useState } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "./getWeb3";
import { Web3Context } from ".";

const { Provider } = Web3Context;

const Web3Provider = ({ children }) => {
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null,
    admin: null,
  });

  const connectWeb3 = new Promise(async (resolve) => {
    const web3 = await getWeb3();
    resolve(web3);
  });

  const connectBlockchain = (web3) =>
    new Promise(async (resolve) => {
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];

      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      instance && console.log("connected to blockchain");
      resolve({ web3, instance, accounts });
    });

  const getBalance = (web3, accounts) => {
    web3.eth.getBalance(accounts[0], (err, wei) => {
      const balance = web3.utils.fromWei(wei, "ether"); // convertir la valeur en ether
      console.log(balance);
    });
  };

  const connect = () => {
    connectWeb3
      .then(connectBlockchain, console.error)
      .then(({ web3, instance, accounts }) => {
        setState({ web3, accounts, contract: instance, admin: accounts[0] });
        getBalance(web3, accounts);
      });
  };
  const value = useMemo(() => {
    return {
      connectWeb3: connect,
      instance: state.contract,
      ...state,
    };
  }, [state]);
  return <Provider value={value}>{children}</Provider>;
};
export default Web3Provider;
