import React from "react";
import { connect } from "react-redux";

const Dashboard = props => {
  return (
    <div>
      <div>
        <div className="row ma-0">
          <div className="col-12 col-xl-4 col-lg-12 col-md-12 col-sm-12 pa-3">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, null)(Dashboard);
