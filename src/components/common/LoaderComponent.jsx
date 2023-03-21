import React from "react";
import LoaderSvg from "assets/images/Loaders/loader-1.svg";

const LoaderComponent = props => {
  return (
    <div className="loader-design">
      <div className="text-center loader-center">
        <img src={LoaderSvg} alt="loader" className="loader-img" />
      </div>
    </div>
  );
};

export default LoaderComponent;
