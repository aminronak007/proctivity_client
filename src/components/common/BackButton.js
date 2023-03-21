import React from "react";
import { CornerUpLeft } from "react-feather";

function BackButton(props) {
  return (
    <button
      onClick={() => props.history.goBack()}
      className="btn-bordered btn-blue btn-back"
    >
      <CornerUpLeft /> Back
    </button>
  );
}

export default BackButton;
