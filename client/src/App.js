import React, { useEffect, useMemo, useContext, useState } from "react";
import withContext, { Web3Context } from "./context";
import useContract from "./context/useContract";
import Header from "./ui/components/Header";
import Footer from "./ui/components/Footer";
import Winner from "./ui/components/Winner";
import VotersList from "./ui/VotersList";
import ProposalList from "./ui/ProposalList";
import Spinner from "./ui/components/Spinner";
import "./App.css";

const Toast = () => {
  const { instance, admin } = useContext(Web3Context);
  const {
    toast: { visible, message },
  } = useContract(instance, admin);
  const visibility = useMemo(() => (visible ? "show" : "hide"), [visible]);

  return (
    <div className="position-fixed bottom-5 end-0 p-3" style={{ zIndex: 5 }}>
      <div
        id="liveToast"
        className={`toast ${visibility}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header d-flex justify-content-between">
          <small>just now</small>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
};

function App({ connectWeb3, instance, admin, endVoting}) {
  const { eventTxHash, transactionStatus, TRANSACTION_STATUS } = useContract(
    instance,
    admin,
  );
  

  useEffect(() => {
    connectWeb3();
  }, [instance]);

  const isPending = useMemo(() => {
    return (
      transactionStatus.status === TRANSACTION_STATUS.PENDING &&
      transactionStatus.event === "WorkflowStatusChange"
    );
  }, [eventTxHash, transactionStatus]);
  return (
    <>
      <Toast />
      <Header />
      <Spinner isLoading={isPending}>
        Please wait while we are processing your transaction ...
      </Spinner>
      {endVoting ? <Winner/> : null}
         <div className="container">
        <div className="row">
          <VotersList />
          <ProposalList />
        </div>
      </div>       
      <Footer />
    </>
  );
}
export default withContext(App);
