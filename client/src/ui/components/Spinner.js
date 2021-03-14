import React from "react";
const Spinner = ({ isLoading, children = "Loading" }) =>
  isLoading && (
    <div
      style={{ width: "100%" }}
      className="d-flex align-items-center flex-column mt-5"
    >
      <p className="text-secondary">{children}</p>
      <div
        style={{ opacity: "0.7" }}
        className="spinner-border text-secondary"
        role="status"
      ></div>
    </div>
  );
export default Spinner;
