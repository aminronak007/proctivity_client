import React, { Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import "react-datepicker/dist/react-datepicker.css";
import AuthActions from "redux/auth/actions";
import NavigationAction from "redux/navigation/actions";
import { decryptPlainText } from "helper/methods";

const { success, error, fetching } = NavigationAction;

const { setuser } = AuthActions;

const UpdateCardDetails = props => {
  const { user } = props;

  return (
    <Fragment>
      <div className="pa-15">
        <div className="row">
          <div className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="row">
              <div className="col-6">
                <h6>Name on Card:</h6>
              </div>
              <div className="col-6">
                <h6>{decryptPlainText(user?.cardname)}</h6>
              </div>
              <div className="col-6 mt-1">
                <h6>Card Number:</h6>
              </div>
              <div className="col-6 mt-1">
                <h6>
                  **** **** **** {decryptPlainText(user?.cardnumber)?.slice(-4)}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user
  };
};

export default compose(
  connect(mapStateToProps, { setuser, success, error, fetching })
)(UpdateCardDetails);
