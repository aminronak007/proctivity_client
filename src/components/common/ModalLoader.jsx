import React from "react";
import Loader1 from "assets/images/Loaders/loader-1.svg";

const ModalLoader = props => {
  let message = props.message;
  return (
    <div className="col-12 text-center mb-4">
      <img width={100} height={100} src={Loader1} alt="loader-1" />
      <div className="pt-3">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ModalLoader;
