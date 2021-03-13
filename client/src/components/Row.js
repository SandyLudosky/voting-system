import React from "react";

const styles = {
  button: {
    width: 100,
  },
};

const Row = ({ index, remove, content }) => (
  <tr>
    <th scope="row">{index + 1}</th>
    <td width="80%">{content}</td>
    <td width="20%">
      <button
        className="btn btn-danger btn-sm"
        style={styles.button}
        onClick={remove}
      >
        remove
      </button>
    </td>
  </tr>
);
export default Row;
