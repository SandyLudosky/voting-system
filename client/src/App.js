import React, { useEffect, useState, useMemo } from 'react';
import withContext from "./context";
import useContract from './context/useContract'
import './App.css';

function App({ connectWeb3, instance, admin }) {
  
  const { whiteList, add } = useContract(instance, admin)
 //  const [voters, setVoters] = useState([])
  const list = [
    '0xc537934a1A6537DF4549E43a3234d622f63Da124', 
    '0xb2f331950C73A0865a06cdc6BaA8beB520C40A00', 
    '0x43197DA71F8142b0EDA876BEf3bd498E30037444', 
    '0xD56AeAE8b0b0316Ca9BE6dbDb71ebeefA9B7C7E4'
  ]
  useEffect(() => {
    connectWeb3()

  }, [])


 const voters = useMemo(() => {
    console.log(whiteList())
    return whiteList()
 }, [instance])  
 

  return (
    <div className="App">
      {!instance && <div>Loading Web3, accounts, and instance...</div>}
      {!!instance &&
        <header>
          <p>{instance.options.address}</p>
        <ul>
          {voters.map(voter => <li>{voter.address}</li>)}
        </ul>
        <button onClick={() => add('0xc537934a1A6537DF4549E43a3234d622f63Da124')}> add </button>
        </header>
      }
    </div >
  );
}
export default withContext(App);
