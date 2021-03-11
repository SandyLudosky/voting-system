import React, { useMemo, useState } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "./getWeb3";
import { Web3Context } from '.'


const { Provider } = Web3Context;

const Web3Provider = ({ children }) => {
    const [state, setState] = useState({
        web3: null,
        accounts: null,
        contract: null,
        admin: '0x6db64B65E05cFdffcc59aed245B65278E8AaDd79',
    })
    const [toast, setToast] = useState({ visible: false, message: '' })

    const displayToast = (event) => {
        console.log(event)
        setToast({ visible: true, message: '✅ New voter added' })
        setTimeout(() => setToast({ visible: false, message: '' }), 4000);
    }
    const connectWeb3 = new Promise(async (resolve) => {
        const web3 = await getWeb3();
        resolve(web3)
    });

    const connectBlockchain = (web3) =>
        new Promise(async (resolve) => {
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = VotingContract.networks[networkId];
        
            const instance = new web3.eth.Contract(
                VotingContract.abi, 
                deployedNetwork && deployedNetwork.address,);
            instance && console.log('connected to blockchain')
            resolve({ web3, instance, accounts })
        })
    const subscribeEvents = ({ web3, instance, accounts }) => new Promise(async (resolve) => {
        // instance.events.WorkflowStatusChange({})
        //     .on('data', console.log)
        //     .on('error', console.error)

        // instance.events.VoterRegistered('0xe5f117D1A8E114B9a47d1a6490b81c85F8124E6E')
        //     .on('data', displayToast)
        //     .on('error', console.error)
        resolve({ web3, instance, accounts })
    });

    const getBalance = (web3, accounts) => {
        web3.eth.getBalance(accounts[0], (err, wei) => {
            const balance = web3.utils.fromWei(wei, 'ether'); // convertir la valeur en ether
            console.log(balance);
        });
    }

    const connect = () => {
        connectWeb3
            .then(connectBlockchain, console.error)
            .then(subscribeEvents, console.error)
            .then(({ web3, instance, accounts }) => {
                setState({ web3, accounts, contract: instance, admin: accounts[0] })
                getBalance(web3, accounts)
            })
    }
    const value = useMemo(() => {
        return {
            connectWeb3: connect,
            instance: state.contract,
            toast,
            ...state,
        }
    }, [toast, state])
    return <Provider value={value}>{children}</Provider>
}
export default Web3Provider;