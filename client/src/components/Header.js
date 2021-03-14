import React, { useEffect, useMemo, useState } from "react";
import withContext from "../context";
import useContract from "../context/useContract";

const Header = ({ instance, admin }) => {
  const {
    count,
    status,
    event,
    startProposalSession,
    endProposalSession,
    startVotingSession,
    endVotingSession,
    resetVotingSession,
  } = useContract(instance, admin);
  const workflowStatus = [
    "RegisteringVoters",
    "ProposalsRegistrationStarted",
    "ProposalsRegistrationEnded",
    "VotingSessionStarted",
    "VotingSessionEnded",
    "VotesTallied",
  ];

  const isDisabled = (index) => !Boolean(parseInt(status) === index);

  const isProposalsRegistrationOpen = useMemo(
    () => !Boolean(count > 0 && parseInt(status) === 0),
    [count, status, event]
  );

  return (
    !!instance && (
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <div className="d-flex">
            <button
              onClick={startProposalSession}
              className="btn btn-secondary btn-sm"
              disabled={isProposalsRegistrationOpen}
            >
              Start Proposals Session
            </button>
            &nbsp;
            <button
              onClick={endProposalSession}
              disabled={isDisabled(1)}
              className="btn btn-secondary btn-sm"
            >
              End Proposals Session
            </button>
            &nbsp;
            <button
              onClick={startVotingSession}
              className="btn btn-secondary btn-sm"
              disabled={isDisabled(2)}
            >
              Start Voting Session
            </button>
            &nbsp;
            <button
              onClick={endVotingSession}
              disabled={isDisabled(3)}
              className="btn btn-secondary btn-sm"
            >
              End Voting Session
            </button>
            &nbsp;
            <button
              onClick={resetVotingSession}
              disabled={!Boolean(parseInt(status) !== 0)}
              className="btn btn-danger btn-sm"
            >
              Reset
            </button>
          </div>
          <span className="navbar-brand mb-0 h1">
            status : {workflowStatus[status]}
          </span>
        </div>
      </nav>
    )
  );
};
export default withContext(Header);
