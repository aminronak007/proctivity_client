import React from "react";
import enhancer from "./enhancer/ChangePasswordEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { changePassword } from "services/userServices";
import { Lock } from "react-feather";
import CardLoader from "components/common/CardLoader";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const ChangePassword = props => {
  const {
    token,
    user,
    success,
    error,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    submitCount,
    fetching,
    isFetching,
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

  console.log(user);

  const handleChangePassword = async e => {
    const { values, isValid, handleSubmit } = props;
    e.preventDefault();
    handleSubmit();

    if (isValid) {
      fetching();
      await changePassword(token, user.id, values).then(data => {
        if (data.success) {
          success(data.message);
          setuser({ ...user, access_key_send: 0 });
          props.history.push("/intro");
        } else {
          error(data.message);
        }
      });
    }
  };

  return (
    <div className="container-fluid">
      {isFetching ? (
        <CardLoader />
      ) : (
        <>
          <div className="row title-sec">
            <div className="col-sm headline">Change Password</div>
          </div>

          <div className="div-container d-flex align-items-center">
            <div className="col-12">
              <div className="row justify-content-center">
                <div className="col-md-5">
                  <form
                    className="form-with-icons"
                    onSubmit={handleChangePassword}
                  >
                    <div className="form-group">
                      <Lock className="form-icons" />
                      <label>
                        Current Password <span className="error-msg">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control react-form-input"
                        id="currentpassword"
                        placeholder="Current Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.currentpassword}
                      />
                      <Error field="currentpassword" />
                    </div>
                    <div className="form-group">
                      <Lock className="form-icons" />
                      <label>
                        New Password <span className="error-msg">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control react-form-input"
                        id="newpassword"
                        placeholder="New Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.newpassword}
                      />
                      <Error field="newpassword" />
                    </div>
                    <div className="form-group">
                      <Lock className="form-icons" />
                      <label>
                        Confirm Password <span className="error-msg">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control react-form-input"
                        id="confirmpassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.confirmpassword}
                      />
                      <Error field="confirmpassword" />
                    </div>

                    <div className="text-center">
                      <button className="btn btn-blue w-100">
                        CHANGE PASSWORD
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
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
)(ChangePassword);
