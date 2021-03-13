import React, { useContext, useState, useEffect, useMemo } from "react";
import { Web3Context } from "../context";
import useContract from "../context/useContract";

import Table from "./Table";
import Row from "./Row";

const VotersList = ({ width = "6" }) => {
  const [voters, setVoters] = useState([]);
  const [voterAddress, setVoterAddress] = useState(null);
  const [approved, setApproved] = useState([]);
  const { instance, admin } = useContext(Web3Context);
  const { eventTxHash, status, whiteList, addVoter, removeVoter } = useContract(
    instance,
    admin
  );

  const handleOnChange = (e) => setVoterAddress(e.target.value);
  const handleOnSubmit = (e) => {
    e.preventDefault();
    addVoter(voterAddress);
    setVoterAddress(null);
  };
  const approveVoters = (array) => {
    if (!array) {
      return false;
    }
    const votersWhitelisted = array.filter((voter) => voter.isWhitelisted);
    setApproved(votersWhitelisted);
  };

  useEffect(() => {
    whiteList(instance).then(setVoters);
  }, [instance]);
  useEffect(() => {
    whiteList(instance).then(setVoters);
  }, [eventTxHash]);
  useEffect(() => {
    approveVoters(voters);
  }, [voters]);
  const hasErrors = useMemo(() => !!voterAddress && parseInt(status) !== 0, [
    voterAddress,
  ]);
  const isVoterRegistrationOpen = useMemo(
    () => !Boolean(!!voterAddress && parseInt(status) === 0),
    [voterAddress]
  );
  return (
    <div className={`col-md-${width}`}>
      <form
        onSubmit={handleOnSubmit}
        className="d-flex justify-content-between mt-5"
      >
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            aria-describedby="voterErrorText"
            value={voterAddress}
            onChange={handleOnChange}
          />
          {hasErrors && (
            <div
              id="voterErrorText"
              className="form-text"
              style={{ color: "crimson", height: "auto" }}
            >
              Voters registration is closed now
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-secondary col-sm-3"
          disabled={isVoterRegistrationOpen}
        >
          Add Voter
        </button>
      </form>
      <Table header="Voters">
        {!!approved &&
          approved.map(({ address }, index) => {
            return <Row remove={removeVoter} content={address} index={index} />;
          })}
      </Table>
    </div>
  );
};
export default VotersList;
