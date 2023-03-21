import React, { Fragment, useEffect } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import enhancer from "./enhancer/EditSubUserProfileEnhancer";
import NavigationActions from "redux/navigation/actions";
import { connect } from "react-redux";
import { updateSubUser } from "services/subUsersServices";
import AuthActions from "redux/auth/actions";
import { ProfileLockScreen } from "../../../helper/constant";

import { User, Phone, Mail } from "react-feather";

const { setuser } = AuthActions;
const { success, error, fetching } = NavigationActions;

const EditSubUserProfile = props => {
  const { success, error, user, setIsEdit, setuser, token } = props;

  const handleEdit = async e => {
    e.preventDefault();
    fetching();
    let { values, isValid, handleSubmit } = props;
    if (isValid) {
      await updateSubUser(token, user.id, values).then(data => {
        if (data.success) {
          success(data.message);
          setIsEdit(false);
          setuser({
            ...values,
            phone: values?.phone?.length === 9 ? 0 + values.phone : values.phone
          });
          // props.history.push("/login");
        } else {
          error(data.message);
        }
      });
    }
    handleSubmit();
  };

  const {
    handleChange,
    handleBlur,
    errors,
    values,
    touched,
    submitCount,
    setValues
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

  useEffect(() => {
    setValues({ ...user });
    // eslint-disable-next-line
  }, [user]);

  return (
    <Fragment>
      <form onSubmit={e => handleEdit(e)}>
        <div className="row edit-profile-main">
          <div className="col-xl-4 mb-5 mb-xl-0 profile-shade border-sm-0">
            <div className="profile-image media align-items-center justify-content-center">
              <div className="position-relative">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URI ||
                    ProfileLockScreen}/${user.logoPath}`}
                  alt="Name"
                />

                {/* <button
                  className='upload-image'
                  onClick={() => resetUploadDialog(true)}
                  type='button'
                >
                  <Edit3 />
                </button> */}
              </div>
              <div className="col-auto px-0 user-name">{user.username}</div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="row">
              <div className="col-md-6">
                <div className="profile-row form-group">
                  <User className="form-icons" />
                  <label>
                    Username <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="username"
                    name="username"
                    onChange={handleChange}
                    value={values.username}
                    onBlur={handleBlur}
                    placeholder="Username"
                  />
                  <Error field="username" />
                </div>
              </div>

              <div className="col-md-6">
                <div className="profile-row form-group">
                  <Mail className="form-icons" />
                  <label>
                    Email <span className="error-msg">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control react-form-input"
                    id="email"
                    disabled
                    placeholder="Email"
                    defaultValue={values.email}
                  />
                  <Error field="email" />
                </div>
              </div>

              <div className="col-md-6">
                <div className="profile-row form-group">
                  <Phone className="form-icons" />
                  <label>
                    Phone <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Phone"
                    value={values.phone}
                  />
                  <Error field="phone" />
                </div>
              </div>

              <div className="col-md-6">
                <div className="profile-row form-group">
                  <User className="form-icons" />
                  <label>
                    Role <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="role"
                    disabled
                    placeholder="Role"
                    defaultValue={values.role}
                  />
                  <Error field="email" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 text-center border-top pt-4 mt-4">
            <div className="row justify-content-center">
              <div className="col-sm-auto pr-sm-2">
                <button
                  // style={buttonBack}
                  type="submit"
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
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    token: state.auth.accessToken
  };
};
export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { setuser, success, error })
)(EditSubUserProfile);
