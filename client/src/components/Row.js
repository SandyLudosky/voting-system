import React, { useContext, useMemo } from "react";
import { Web3Context } from "../context";
import useContract from "../context/useContract";

const styles = {
  button: {
    width: 100,
  },
};

const Row = ({ index, remove, content, id, isProposal = false }) => {
  const { instance, admin } = useContext(Web3Context);
  const { status, vote } = useContract(instance, admin);

  return (
    <tr>
      <th scope="row">{index + 1}</th>
      <td width="80%">{content}</td>
      <td width="20%">
        <div className="d-flex">
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
