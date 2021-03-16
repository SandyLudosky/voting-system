import React, { useContext, useMemo } from "react";
import { Web3Context } from "../../context";
import useContract from "../../context/useContract";

const styles = {
  button: {
    width: 100,
  },
};

const VotesCount = ({ votesCount }) => {
  return (
    votesCount > 0 && (
      <span>
        {votesCount <= 1 ? (
          <>
            <i className="fas fa-check" style={{ color: "#27ae60" }}></i>{" "}
            {votesCount}
          </>
        ) : (
          <>
            <i className="fas fa-check-double" style={{ color: "#27ae60" }}></i>{" "}
            {votesCount}
          </>
        )}
      </span>
    )
  );
};

const Row = ({
  index,
  remove,
  content,
  id,
  voteCount = 0,
  isProposal = false,
}) => {
  const { instance, admin } = useContext(Web3Context);
  const { status, vote } = useContract(instance, admin);
  const hasVotes = useMemo(() => isProposal && voteCount > 0, [voteCount]);
  return (
    <tr>
      <th scope="row">{index + 1}</th>
      <td width="60%">{content}</td>
      <td width="20%">{hasVotes && <VotesCount votesCount={voteCount} />}</td>
      <td width="20%">
        <div
          className="d-flex"
          style={{
            marginRight: !isProposal && 20,
            marginLeft: !isProposal && "-15px",
          }}
        >
          {isProposal && parseInt(status) === 3 && (
            <button className="btn btn-info btn-sm" onClick={() => vote(id)}>
              vote
            </button>
          )}
          &nbsp;
          <button
            className="btn btn-danger btn-sm"
            style={styles.button}
            onClick={remove}
          >
            remove
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Row;
