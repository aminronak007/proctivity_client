import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { ProfileLockScreen } from "./../../helper/constant";

const ProfileInfoComponent = ({ activeColor, user }) => {
  return (
    <div>
      <div className="text-center profile-image">
        <img
          src={`${process.env.REACT_APP_BACKEND_URI || ProfileLockScreen}/${
            user.logo
          }`}
          alt="Name"
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

// export default ProfileInfoComponent;
export default compose(
  withRouter,
  connect(mapStateToProps, null)
)(ProfileInfoComponent);
