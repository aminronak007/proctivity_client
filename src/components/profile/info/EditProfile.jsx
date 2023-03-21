import React, { Fragment, useEffect, useState } from "react";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import enhancer from "./enhancer/EditFormEnhancer";
import NavigationActions from "redux/navigation/actions";
import { connect } from "react-redux";
import { editProfile } from "services/userServices";
import AuthActions from "redux/auth/actions";
import ProfileUploaderDialog from "components/filemanager/ProfileUploaderDialog";
import { ProfileLockScreen } from "../../../helper/constant";
import { usePlacesWidget } from "react-google-autocomplete";
import {
  User,
  Briefcase,
  Phone,
  MapPin,
  Mail,
  Home,
  Map,
  Edit3
} from "react-feather";

const { setuser } = AuthActions;
const { success, error, fetching } = NavigationActions;

const EditProfile = props => {
  const { success, error, user, setIsEdit, setuser, token } = props;
  const [logo, setLogo] = useState({});
  const [uploadDetails, setUploadDetails] = useState(null);
  const [uploadDialog, resetUploadDialog] = useState(false);
  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: place => {
      FormatePlaces(place);
    },
    options: {
      componentRestrictions: { country: "au" },
      fields: ["address_components", "geometry"],
      types: ["address"]
    }
  });

  const FormatePlaces = place => {
    let address1 = "";
    let postcode = "";
    let state = "";
    let city = "";
    console.log(place);
    for (const component of place.address_components) {
      // @ts-ignore remove once typings fixed
      const componentType = component.types[0];

      switch (componentType) {
        case "street_number": {
          address1 = `${component.long_name} ${address1}`;
          break;
        }

        case "route": {
          address1 += component.long_name;
          break;
        }

        case "postal_code": {
          postcode = `${component.long_name}${postcode}`;
          break;
        }

        case "postal_code_suffix": {
          postcode = `${postcode}-${component.long_name}`;
          break;
        }
        case "locality":
          city = component.long_name;
          break;
        case "administrative_area_level_1": {
          state = component.short_name;
          break;
        }
        default: {
        }
      }
    }

    setValues({
      ...user,
      address_line1: address1,
      city: city,
      state: state,
      postal_code: postcode
    });
  };
  const handleEdit = async e => {
    e.preventDefault();
    fetching();
    let { values, isValid, handleSubmit } = props;
    if (isValid) {
      var formData = new FormData();
      for (const property in values) {
        formData.append(property, values[property]);
      }
      formData.append("logo", logo.name ? logo : user.logo);

      await editProfile(token, user.id, formData).then(data => {
        if (data.success) {
          success(data.message);
          setIsEdit(false);
          setuser({
            ...values,
            phone: values.phone.length === 9 ? 0 + values.phone : values.phone,
            logoPath: data.data.filename,
            logo: data.data.logo
          });
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

  const uploadProfile = () => {
    resetUploadDialog(false);
  };

  const getThumb = (file, cb) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      cb(reader.result);
    };
    reader.onerror = function(error) {
      console.log("Error: ", error);
    };
  };

  const acceptedFile = file => {
    if (file && file.length) {
      getThumb(file[0], thumb => {
        setUploadDetails({
          name: file[0].name,
          thumb
        });
      });
      setLogo(file[0]);
    }
  };

  useEffect(() => {
    setValues({
      ...user,
      address_line1: user.address_line1 ? user.address_line1 : "",
      city: user.city ? user.city : "",
      state: user.state ? user.state : "",
      postal_code: user.postal_code ? user.postal_code : ""
    });
    // eslint-disable-next-line
  }, [user]);

  return (
    <Fragment>
      <form onSubmit={e => handleEdit(e)}>
        <div className="row edit-profile-main">
          <div className="col-xl-4 mb-5 mb-xl-0 profile-shade border-sm-0">
            <div className="profile-image media align-items-center justify-content-center">
              <div className="position-relative">
                {uploadDetails ? (
                  <img src={uploadDetails.thumb} alt="thumb" />
                ) : (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URI ||
                      ProfileLockScreen}/${user.logoPath}`}
                    alt="Name"
                  />
                )}
                <button
                  className="upload-image"
                  onClick={() => resetUploadDialog(true)}
                  type="button"
                >
                  <Edit3 />
                </button>
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
                  <Briefcase className="form-icons" />
                  <label>
                    Company Name <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="companyname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.companyname}
                    placeholder="Company Name"
                  />
                  <Error field="companyname" />
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

              {/* <div className="col-md-6">
                <div className="profile-row form-group">
                  <label>
                    Brand Color <span className="error-msg">*</span>
                  </label>
                  <input
                    type="color"
                    className="form-control react-form-input"
                    id="brandcolor"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Brand Color"
                    value={values.brandcolor}
                  />
                  <Error field="brandcolor" />
                </div>
              </div> */}

              <div className="col-md-6">
                <div className="profile-row form-group">
                  <MapPin className="form-icons" />
                  <label>
                    Address Line 1 <span className="error-msg">*</span>
                  </label>
                  <textarea
                    type="text"
                    className="form-control react-form-input"
                    id="address_line1"
                    onChange={handleChange}
                    value={values.address_line1}
                    onBlur={handleBlur}
                    placeholder="Address Line 1"
                    ref={ref}
                  />
                  <Error field="address_line1" />
                </div>
              </div>

              <div className="col-md-6">
                <div className="profile-row form-group">
                  <MapPin className="form-icons" />
                  <label>Address Line 2</label>
                  <textarea
                    type="text"
                    className="form-control react-form-input"
                    id="address_line2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.address_line2}
                    placeholder="Address Line 2"
                  />
                  <Error field="address_line2" />
                </div>
              </div>

              <div className="col-md-6">
                <div className="profile-row form-group mb-md-0">
                  <Home className="form-icons" />
                  <label>
                    City <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="city"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="City"
                    value={values.city}
                  />
                  <Error field="city" />
                </div>
              </div>

              <div className="col-md-6">
                <div className="profile-row form-group mb-0">
                  <Map className="form-icons" />
                  <label>
                    State <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="state"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="State"
                    value={values.state}
                  />
                  <Error field="state" />
                </div>
              </div>

              <div className="col-md-6">
                <div className="profile-row form-group mt-4">
                  <MapPin className="form-icons" />
                  <label>
                    Postal Code <span className="error-msg">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control react-form-input"
                    id="postal_code"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Postal Code"
                    value={values.postal_code}
                  />
                  <Error field="postal_code" />
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
      <ProfileUploaderDialog
        className="media-modal"
        modal={uploadDialog}
        setmodal={resetUploadDialog}
        maxSize={10000000}
        uploadedFileDetail={uploadDetails}
        resetUploadDialog={() => {
          resetUploadDialog();
          setUploadDetails(null);
        }}
        acceptedFile={acceptedFile}
        uploadFileHandler={uploadProfile}
      />
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
)(EditProfile);
