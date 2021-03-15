import getWeb3 from "../../getWeb3";

const useUtils = () => {
  const getAccounts = () =>
    new Promise(async (resolve) => {
      const web3 = await getWeb3();
      web3.eth.getAccounts(console.log);
    });
  const getCurrentUser = new Promise(async (resolve) => {
    const accounts = await getAccounts();
    resolve(accounts[0]);
  });

  return {
    getCurrentUser,
  };
};
export default useUtils;
