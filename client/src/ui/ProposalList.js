import React, { useContext, useState, useEffect, useMemo } from "react";
import { Web3Context } from "../context";
import useContract from "../context/useContract";
import Table from "./components/Table";
import Row from "./components/Row";
import Spinner from "./components/Spinner";

const ProposalList = ({ width = "6" }) => {
  const [proposal, setProposal] = useState(null);
  const [proposalsList, setProposalList] = useState(null);
  const { instance, admin } = useContext(Web3Context);
  const {
    status,
    eventTxHash,
    transactionStatus,
    TRANSACTION_STATUS,
    getProposals,
    addProposal,
    removeProposal,
  } = useContract(instance, admin);

  const handleOnChange = (e) => setProposal(e.target.value);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    addProposal(proposal);
    setProposal(null);
  };
  useEffect(() => {
    getProposals(instance).then(setProposalList);
  }, [instance]);
  useEffect(() => {
    getProposals(instance).then(setProposalList);
  }, [eventTxHash]);
  const isProposalsRegistrationOpen = useMemo(
    () => !Boolean(!!proposal && parseInt(status) === 1),
    [proposal]
  );
  const isPending = useMemo(() => {
    if (
      transactionStatus.status === TRANSACTION_STATUS.PENDING &&
      transactionStatus.event === "ProposalRegistered"
    ) {
      return true;
    }
    if (
      transactionStatus.status === TRANSACTION_STATUS.PENDING &&
      transactionStatus.event === "ProposalRemoved"
    ) {
      return true;
    }
    return false;
  }, [eventTxHash, transactionStatus]);
  const hasErrors = useMemo(() => !!proposal && parseInt(status) !== 1, [
    proposal,
  ]);
  return (
    <div className={`col-md-${width}`}>
      <form
        onSubmit={handleOnSubmit}
        className="d-flex flex-row justify-content-between mt-5"
      >
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            aria-describedby="proposalErrorText"
            value={proposal}
            onChange={handleOnChange}
          />
          {hasErrors && (
            <div
              id="proposalErrorText"
              className="form-text"
              style={{ color: "crimson", height: "auto" }}
            >
              Proposals' session currently closed
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-secondary col-sm-3"
          disabled={isProposalsRegistrationOpen}
        >
          Add Proposal
        </button>
      </form>
      <Spinner isLoading={isPending} />
      <Table header="Proposals" isLoading={isPending}>
        {!!proposalsList &&
          proposalsList.map((proposal, index) => {
            return (
              <Row
                {...proposal}
                index={index}
                isProposal={true}
                content={proposal.description}
                remove={() => removeProposal(proposal.id)}
                key={proposal.id}
              />
            );
          })}
      </Table>
    </div>
  );
};
export default ProposalList;
