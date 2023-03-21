import React, { useState } from "react";
import { connect } from "react-redux";
import Info from "components/profile/info/Info";
import SubUserInfo from "components/profile/subuser/SubUserInfo";
import NavigationAction from "redux/navigation/actions";
import AuthActions from "redux/auth/actions";
import { Edit3, Eye } from "react-feather";
const { success, error, fetching } = NavigationAction;
const { setuser } = AuthActions;
const UserProfile = props => {
  const { user, isFetching } = props;
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="Profile-component">
      <div className="container-fluid">
        <div className="row title-sec align-items-center">
          <div className="col-sm headline">{isEdit ? "Edit" : ""} Profile</div>
          <div className="col-sm-auto ml-auto">
            <button
              className="btn btn-blue btn-sm"
              onClick={() => setIsEdit(!isEdit)}
            >
              {isEdit ? <Eye /> : <Edit3 className="mr-2" />}{" "}
              {isEdit ? "View" : "Edit"} Profile
            </button>
          </div>
        </div>
        <div className="div-container">
          {user.parent !== 0 ? (
            <SubUserInfo
              user={user}
              isEdit={isEdit}
              setIsEdit={e => setIsEdit(e)}
              isFetching={isFetching}
            />
          ) : (
            <Info
              user={user}
              isEdit={isEdit}
              setIsEdit={e => setIsEdit(e)}
              isFetching={isFetching}
            />
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
export default connect(mapStateToProps, { success, error, fetching, setuser })(
  UserProfile
);
