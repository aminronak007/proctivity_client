import React from "react";
import Loader1 from "assets/images/Loaders/loader-1.svg";

const LoaderComponent = props => {
  return (
    <div className="loader-cards">
      <img src={Loader1} alt="loader" className="loader-img" />
    </div>
  );
};

export default LoaderComponent;
