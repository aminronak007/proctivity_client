import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { checkApi } from "services/authServices";

import { success_subscription } from "services/subscriptionServices";
import NavigationAction from "redux/navigation/actions";
import CardLoader from "components/common/CardLoader";
import authActions from "redux/auth/actions";

const { success, error, toggleSubscriptionLoader } = NavigationAction;
const { check } = authActions;

const SubscriptionSucess = props => {
  const history = useHistory();
  const {
    success,
    error,
    token,
    toggleSubscriptionLoader,
    isSubscriptionSuccess
  } = props;

  const search = useLocation().search;

  const GetSubscriptionPackages = async () => {
    toggleSubscriptionLoader(true);
    const id = new URLSearchParams(search).get("session_id");
    await success_subscription(token, id).then(async data => {
      if (data.success) {
        success(data.message);
        await checkApi(token).then(res => {
          if (res.success) {
            check(res.data);
            history.push("/subscription/");
          }
        });
      } else {
        toggleSubscriptionLoader(false);
        error(data.message);
      }
    });
  };

  useEffect(() => {
    GetSubscriptionPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="row title-sec">
          <div className="col-sm headline">Subscription</div>
        </div>
        {isSubscriptionSuccess ? <CardLoader /> : null}
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user,
    isSubscriptionSuccess: state.navigation.isSubscriptionSuccess
  };
};

export default connect(mapStateToProps, {
  success,
  error,
  toggleSubscriptionLoader
})(SubscriptionSucess);
