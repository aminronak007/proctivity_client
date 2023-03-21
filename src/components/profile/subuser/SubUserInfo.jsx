import React, { Fragment } from "react";
import EditSubUserProfile from "./EditSubUserProfile";
import { ProfileLockScreen } from "../../../helper/constant";
import { Mail, Phone, User } from "react-feather";
import CardLoader from "components/common/CardLoader";

const SubUserInfo = ({ isFetching, titleStyle, isEdit, user, ...other }) => {
  return isEdit ? (
    <EditSubUserProfile titleStyle={titleStyle} user={user} {...other} />
  ) : (
    <Fragment>
      {isFetching ? (
        <CardLoader />
      ) : (
        <div className="row view-profile-main">
          <div className="col-xl-4 mb-5 mb-xl-0 profile-shade border-sm-0">
            <div className="profile-image media align-items-center justify-content-md-center">
              <img
                src={`${process.env.REACT_APP_BACKEND_URI ||
                  ProfileLockScreen}/${user.logoPath}`}
                alt="Name"
              />
              <div className="col-auto px-0 user-name">{user.username}</div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="row">
              <div className="col-md-6">
                <div className="profile-row">
                  <div className="Work-title font-medium">
                    <Mail className="label-icons" />
                    Email
                  </div>
                  <div className="Work-text">{user.email}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="profile-row">
                  <div className="Work-title font-medium">
                    <User className="label-icons" />
                    Role
                  </div>
                  <div className="Work-text">{user.role}</div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="profile-row">
                  <div className="Work-title font-medium">
                    <Phone className="label-icons" />
                    Phone
                  </div>
                  <div className="Work-text">{user.phone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="col-md-12 col-lg-4 col-xl-4 profile-shade">
                    <div className="text-center profile-image">
                        <div className="headline mt-3"></div>
                    </div>
                </div> */}

          {/* <div className="col-md-12 col-lg-4 col-xl-4 profile-shade">
                    <div className="profile-row">
                        <div className="Work-title font-medium"><MapPin className="label-icons"/>Address</div>
                        <div className="Work-text">
                            {`${user.address_line1 ? user.address_line1 : ""} ${
                                user.address_line2
                                    ? `, ${user.address_line2}`
                                    : ""
                            }`}
                        </div>
                    </div>

                    <div className="profile-row">
                        <div className="Work-title font-medium"><MapPin className="label-icons"/>Postal Code</div>
                        <div className="Work-text">{user.postal_code}</div>
                    </div>
                </div> */}

          {/* <div className="col-md-12 col-lg-4 col-xl-4">
                    <div className="profile-row">
                        <div className="Work-title font-medium"><Home className="label-icons"/>City</div>
                        <div className="Work-text">{user.city}</div>
                    </div>

                    <div className="profile-row">
                        <div className="Work-title font-medium"><Map className="label-icons"/>State</div>
                        <div className="Work-text">{user.state}</div>
                    </div>
                </div> */}
        </div>
      )}
    </Fragment>
  );
};

export default SubUserInfo;
