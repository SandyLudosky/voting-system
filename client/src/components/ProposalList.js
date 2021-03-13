import React, { useContext, useState, useEffect } from "react";
import { Web3Context } from "../context";
import useContract from "../context/useContract";
import Table from "./Table";
import Row from "./Row";

const ProposalList = ({ width = "6" }) => {
  const { instance, admin } = useContext(Web3Context);
  const { addProposal, getProposals, status, eventTxHash } = useContract(
    instance,
    admin
  );
  const [proposal, setProposal] = useState(null);
  const [proposalsList, setProposalList] = useState(null);

  const handleOnChange = (e) => setProposal(e.target.value);
  const handleOnSubmit = (e) => {
    e.preventDefault();
    addProposal(proposal);
  };

  useEffect(() => {
    getProposals(instance).then(setProposalList);
  }, [instance]);
  useEffect(() => {
    getProposals(instance).then(setProposalList);
  }, [eventTxHash]);
  return (
    <div className={`col-md-${width}`}>
      <form
        onSubmit={handleOnSubmit}
        className="d-flex justify-content-between mt-5"
      >
        <div className="col-sm-8">
          <input
            type="text"
            className="form-control"
            onChange={handleOnChange}
          />
        </div>
        <button
          className="btn btn-secondary col-sm-3"
          disabled={!Boolean(parseInt(status) === 1)}
        >
          Add Proposal
        </button>
      </form>

      <Table header="Proposals">
        {!!proposalsList &&
          proposalsList.map((proposal, index) => {
            return <Row content={proposal.description} index={index} />;
          })}
      </Table>
    </div>
  );
};
export default ProposalList;
