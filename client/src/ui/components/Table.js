import React from "react";

const styles = {
  header: { display: "inherit", width: "98%" },
  table: {
    display: "block",
    height: "400px",
    overflow: "scroll",
  },
};
const Table = ({ header, children, isLoading }) => {
  return (
    !isLoading && (
      <table className="table">
        <thead style={styles.header}>
          <tr style={{ width: "100%" }}>
            <th scope="col">#</th>
            <th scope="col">{header}</th>
            <th scope="col">Select</th>
          </tr>
        </thead>
        <tbody style={styles.table}>{children}</tbody>
      </table>
    )
  );
};
export default Table;
