import React, { useEffect } from "react";
import enhancer from "./enhancer/stripeSetingsEnhancer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import NavigationAction from "redux/navigation/actions";
import AuthActions from "redux/auth/actions";
import { Row, Col } from "reactstrap";
import { updateStripeDetails } from "services/settingsServices";
const { success, error, fetching } = NavigationAction;
const { setuser } = AuthActions;
const Settings = props => {
  const {
    user,
    token,
    isFetching,
    handleChange,
    handleBlur,
    setValues,
    handleSubmit,
    values,
    errors,
    touched,
    isValid,
    submitCount,
    setuser
  } = props;

  const Error = props => {
    const field1 = props.field;
    if ((errors[field1] && touched[field1]) || submitCount > 0) {
      return (
        <span className={props.class ? props.class : "error-msg"}>
          {errors[field1]}
        </span>
      );
    } else {
      return <span />;
    }
  };

  const handleSettingSubmit = e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      updateStripeDetails(token, values).then(data => {
        if (data.success) {
          success(data.message);
          setuser({
            ...user,
            stripe_public_key: values.stripe_public_key,
            stripe_secret_key: values.stripe_secret_key
          });
        } else {
          error(data.message);
        }
      });
    }
  };

  useEffect(() => {
    setValues({
      ...values,
      stripe_public_key: user.stripe_public_key ? user.stripe_public_key : "",
      stripe_secret_key: user.stripe_secret_key ? user.stripe_secret_key : ""
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="Profile-component">
      <div className="container-fluid">
        <div className="row title-sec align-items-center">
          <div className="col-sm headline">Stripe Settings</div>
          <div className="col-sm-auto ml-auto"></div>
        </div>
        <div className="div-container">
          {user.parent === 0 ? (
            <>
              <Row className="mt-10">
                <Col sm="6">
                  <div className="form-group">
                    <label>
                      Stripe Private key
                      <span className="error-msg">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      id="stripe_secret_key"
                      name="stripe_secret_key"
                      onChange={handleChange}
                      value={values.stripe_secret_key}
                      onBlur={handleBlur}
                      placeholder="Stripe private key"
                    />
                    <Error field="stripe_secret_key" />
                  </div>
                </Col>
                <Col sm="6">
                  <div className="form-group">
                    <label>
                      Stripe Public Key
                      <span className="error-msg">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      id="stripe_public_key"
                      name="stripe_public_key"
                      value={values.stripe_public_key}
                      placeholder="Stripe public key"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Error field="stripe_public_key" />
                  </div>
                </Col>
              </Row>
              <div className="col-12 text-center border-top pt-4 mt-4">
                <div className="row justify-content-center">
                  <div className="col-sm-auto pr-sm-2">
                    <button
                      // style={buttonBack}
                      disabled={isFetching}
                      type="button"
                      onClick={e => handleSettingSubmit(e)}
                      className="btn btn-blue w-100 mb-3"
                    >
                      Save
                    </button>
                  </div>
                  <div className="col-sm-auto pl-sm-2">
                    <button
                      type="button"
                      // style={buttonBack}
                      className="btn btn-bordered w-100"
                      onClick={() => props.history.goBack()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user,
    isFetching: state.navigation.isFetching
  };
};

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(Settings);
