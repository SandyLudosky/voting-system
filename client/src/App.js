import React, { useEffect, useMemo, useContext } from "react";
import withContext, { Web3Context } from "./context";
import useContract from "./context/useContract";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VotersList from "./components/VotersList";
import ProposalList from "./components/ProposalList";
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

function App({ connectWeb3, instance, admin }) {
  const { transactionIsPending } = useContract(instance, admin);

  useEffect(() => {
    connectWeb3();
  }, [instance]);

  return (
    <>
      <Toast />
      <Header />
      <div className="container">
        {!transactionIsPending && (
          <p>Please wait while we are processing your transaction ...</p>
        )}

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
