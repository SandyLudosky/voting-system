import React, { useState, useEffect, useCallback } from "react";
import withContext from "../../context";
import useContract from "../../context/useContract";

const Winner = ({ instance, admin }) => {
  const [winningProposal, setWinningProposal] = useState(null);

  const { getWinningProposal } = useContract(instance, admin);

  const getWinningProposalCallback = useCallback(() => {
    getWinningProposal(instance).then(setWinningProposal);
  }, [instance, getWinningProposal]);

  useEffect(() => {
    getWinningProposalCallback();
  }, [getWinningProposalCallback]);

  return (
    !!instance && (
      <div className="container">
        {winningProposal ? (
          <div className="row align-items-center border-bottom">
            <h2 className="alert alert-danger">Session de vote terminée</h2>
            <p className="text-center">
              La proposition <strong>{winningProposal.description}</strong> de{" "}
              <span>{winningProposal.owner} </span> remporte le vote !
            </p>
            <p className="text-center">
              {" "}
              Avec <b>{winningProposal.voteCount}</b> votes !
            </p>
          </div>
        ) : null}
      </div>
    )
  );
};
export default withContext(Winner);
