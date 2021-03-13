import React, { useContext, useState, useEffect, useMemo } from "react";
import { Web3Context } from "../context";
import useContract from "../context/useContract";
import Table from "./Table";
import Row from "./Row";

const ProposalList = ({ width = "6" }) => {
  const [proposal, setProposal] = useState(null);
  const [proposalsList, setProposalList] = useState(null);
  const { instance, admin } = useContext(Web3Context);
  const {
    status,
    eventTxHash,
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
              Proposals' session not opened yet
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

      <Table header="Proposals">
        {!!proposalsList &&
          proposalsList.map(({ description, address, id }, index) => {
            return (
              <Row
                remove={() => removeProposal(index)}
                content={description}
                index={index}
                isProposal={true}
                address={address}
                id={id}
              />
            );
          })}
      </Table>
    </div>
  );
};
export default ProposalList;
