import React, { useMemo, useContext } from "react";
import { Web3Context } from "../../context";
import useContract from "../../hooks/useContract";

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
export default Toast;
