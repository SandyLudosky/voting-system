import React from "react";

const styles = {
  button: {
    width: 100,
  },
};

const Row = ({ index, remove, content }) => (
  <tr>
    <th scope="row">{index + 1}</th>
    <td>{content}</td>
    <td>
      <button
        className="btn btn-danger btn-sm"
        style={styles.button}
        onClick={() => remove(content)}
      >
        remove
      </button>
    </td>
  </tr>
);
export default Row;
