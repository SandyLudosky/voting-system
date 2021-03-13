import React from "react";
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
export default Table;
