import { useState, useEffect, useMemo } from 'react';

const useContract = (instance, admin) => {
     const list = [
    '0xc537934a1A6537DF4549E43a3234d622f63Da124', 
    '0xb2f331950C73A0865a06cdc6BaA8beB520C40A00', 
    '0x43197DA71F8142b0EDA876BEf3bd498E30037444', 
    '0xD56AeAE8b0b0316Ca9BE6dbDb71ebeefA9B7C7E4'
  ]

    const [isValidated, setValidated] = useState(true)
    const [state, setState] = useState({
       // whiteList: null
    })

    const whiteList = () => {
        if (!instance) { return false }
        let array = []
         array = list.map( address => {
            instance.methods.whiteList(address).call()
            .then(result => {
                return {
                    isWhiteListed : result.isRegistered, 
                    address: address
                }
         }) 
        })
        return array
    }

    const add = async (address) => {
        console.log(admin)
        await instance.methods.addVoter(address).send({ from: admin })
    }
    
    return { whiteList, add }
}
export default useContract;
