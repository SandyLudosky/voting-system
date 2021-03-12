import React, { useEffect, useState, useMemo, useContext } from "react";
import withContext, { Web3Context } from "./context";
import useContract from "./context/useContract";
import "./App.css";

const styles = {
  approved: { color: "ref" },
  button: {
    width: 100,
  },
};

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

const Table = ({ header, children }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">{header}</th>
          <th scope="col">Select</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};
const Row = ({ index, bool = true, content }) => {
  const { instance, admin } = useContext(Web3Context);
  const { add, remove } = useContract(instance, admin);
  return (
    <tr>
      <th scope="row">{index + 1}</th>
      <td>{content}</td>
      <td>
        {bool ? (
          <button
            className="btn btn-danger btn-sm"
            style={styles.button}
            onClick={() => remove(content)}
          >
            {" "}
            remove{" "}
          </button>
        ) : (
          <button
            className="btn btn-success btn-sm"
            style={styles.button}
            onClick={() => add(content)}
          >
            {" "}
            add{" "}
          </button>
        )}
      </td>
    </tr>
  );
};

function App({ connectWeb3, instance, admin }) {
  const {
    status,
    eventTxHash,
    isValidated,
    whiteList,
    getProposals,
    startProposal,
    endProposal,
    startVotingSession,
    endVotingSession,
    resetVotingSession,
    addProposal,
  } = useContract(instance, admin);

  const [input, setInput] = useState(null);
  const [voters, setVoters] = useState([]);
  const [approved, setApproved] = useState([]);
  const [proposals, setProposals] = useState([]);

  const workflowStatus = [
    "RegisteringVoters",
    "ProposalsRegistrationStarted",
    "ProposalsRegistrationEnded",
    "VotingSessionStarted",
    "VotingSessionEnded",
    "VotesTallied",
  ];

  const handleOnSubmit = (e) => {
    e.preventDefault();
    addProposal(input);
  };
  const handleOnChange = (e) => setInput(e.target.value);
  const approveVoters = (array) => {
    if (!array) {
      return false;
    }
    const votersWhitelisted = array.filter((voter) => voter.isWhitelisted);
    setApproved(votersWhitelisted);
  };
  useEffect(() => {
    connectWeb3().then(async (instance) => {
      await getProposals(instance).then(setProposals);
      const array = await whiteList(instance);
      setVoters(array);
    });
  }, [instance]);

  useEffect(() => {
    approveVoters(voters);
  }, [voters]);

  useEffect(() => {
    whiteList(instance).then(setVoters);
    getProposals(instance).then(setProposals);
  }, [eventTxHash]);

  return (
    <>
      <Toast />
      {!instance && <div>Loading Web3, accounts, and instance...</div>}
      {!!instance && (
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <div className="d-flex">
              <button
                onClick={startProposal}
                className="btn btn-secondary btn-sm"
                disabled={!Boolean(!!approved.length && parseInt(status) === 0)}
              >
                Start Proposals Session
              </button>
              &nbsp;
              <button
                onClick={endProposal}
                disabled={!Boolean(parseInt(status) === 1)}
                className="btn btn-secondary btn-sm"
              >
                End Proposals Session
              </button>
              &nbsp;
              <button
                onClick={startVotingSession}
                className="btn btn-secondary btn-sm"
                disabled={!Boolean(parseInt(status) === 2)}
              >
                Start Voting Session
              </button>
              &nbsp;
              <button
                onClick={endVotingSession}
                disabled={!Boolean(parseInt(status) === 3)}
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
      )}
      <div className="container">
        {!isValidated && (
          <p>Please wait while we are processing your transaction ...</p>
        )}
        <div>
          <div className="row">
            <div className="col-md-6">
              <div style={{ marginTop: "85px" }}></div>
              <Table header="Voters">
                {!!voters &&
                  voters.map((voter, index) => {
                    return (
                      <Row
                        content={voter.address}
                        bool={voter.isWhitelisted}
                        index={index}
                      />
                    );
                  })}
              </Table>
            </div>
            <div className="col-md-6">
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
                {!!proposals &&
                  proposals.map((proposal, index) => {
                    return <Row content={proposal.description} index={index} />;
                  })}
              </Table>
            </div>
          </div>
        </div>
      </div>
      {!instance && <div>Loading Web3, accounts, and instance...</div>}
      {!!instance && (
        <nav className="navbar navbar-light bg-light fixed-bottom">
          <div className="container-fluid float-end">
            <p></p>
            <p>
              <strong>contract's address</strong> : {instance.options.address}
            </p>
          </div>
        </nav>
      )}
    </>
  );
}
export default withContext(App);
