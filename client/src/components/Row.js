import React, { useContext } from "react";
import { Web3Context } from "../context";
import useContract from "../context/useContract";

const styles = {
  button: {
    width: 100,
  },
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
export default Row;
