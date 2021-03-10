import React, { useEffect, useState } from 'react';
import withContext from "./context";
import useContract from './context/useContract'
import './App.css';

function App({ connectWeb3, instance, admin }) {
  
  const { methods } = useContract(instance)

  useEffect(() => {
    connectWeb3()
  }, [])


  return (
    <div className="App">
      {!instance && <div>Loading Web3, accounts, and instance...</div>}
      {!!instance &&
        <header>
          <p>{instance.options.address}</p>
        </header>
      }
    </div >
  );
}
export default withContext(App);
