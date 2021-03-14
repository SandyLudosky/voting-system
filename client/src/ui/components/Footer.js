import React from "react";
import withContext from "../../context";

const Footer = ({ instance }) => {
  return (
    !!instance && (
      <nav className="navbar navbar-light bg-light fixed-bottom">
        <div className="container-fluid float-end">
          <p></p>
          <p>
            <strong>contract's address</strong> : {instance.options.address}
          </p>
        </div>
      </nav>
    )
  );
};
export default withContext(Footer);
