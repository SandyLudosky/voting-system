import React, { useEffect, useMemo } from "react";
import withContext from "../context";
import useContract from "../hooks/useContract";
import Header from "../ui/components/Header";
import Footer from "../ui/components/Footer";
import VotersList from "../ui/VotersList";
import ProposalList from "../ui/ProposalList";
import Spinner from "../ui/components/Spinner";
import Toast from "../ui/components/Toast";
import "./App.css";

function App({ connectWeb3, instance, admin }) {
  const { eventTxHash, transactionStatus, TRANSACTION_STATUS } = useContract(
    instance,
    admin
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
