import React, { useContext, useState, useEffect } from "react";
import { Web3Context } from "../context";
import useContract from "../context/useContract";
import Table from "./Table";
import Row from "./Row";

const VotersList = ({ width = "6" }) => {
  const { instance, admin } = useContext(Web3Context);
  const { add, whiteList, eventTxHash } = useContract(instance, admin);
  const [voters, setVoters] = useState([]);
  const [voterAddress, setVoterAddress] = useState(null);
  const [approved, setApproved] = useState([]);

  const handleOnChange = (e) => setVoterAddress(e.target.value);
  const handleOnSubmit = (e) => {
    e.preventDefault();
    add(voterAddress);
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
            value={voterAddress}
            onChange={handleOnChange}
          />
        </div>
        <button className="btn btn-secondary col-sm-3" disabled={!voterAddress}>
          Add Voter
        </button>
      </form>
      <Table header="Voters">
        {!!approved &&
          approved.map((voter, index) => {
            return <Row content={voter.address} index={index} />;
          })}
      </Table>
    </div>
  );
};
export default VotersList;
