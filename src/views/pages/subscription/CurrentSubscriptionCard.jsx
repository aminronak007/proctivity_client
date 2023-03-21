import React, { useState } from "react";
import moment from "moment";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import { Modal } from "reactstrap";
import SubscriptionCardModal from "./component/SubscriptionCardModal";
import {
  CancelUserSubscription,
  update_autorenew
} from "services/subscriptionServices";
import { requestFreeTrial } from "services/userServices";
import ConformationModalUser from "components/common/ConformationModalUser";
import AuthActions from "redux/auth/actions";
import { checkApi } from "services/authServices";
import Warning from "assets/images/alert-circle.svg";

const { success, error, fetching } = NavigationActions;
const { check, setuser } = AuthActions;

const CurrentSubscriptionCard = props => {
  const {
    user,
    success,
    error,
    token,
    fetching,
    setuser,
    userSubscriptionHistory
  } = props;
  const package_info = props.package_info;
  const [modal, setmodal] = useState(false);
  const [isOpen, toggleOpen] = useState(false);
  // const [checkAddress, setCheckAddress] = useState("");
  let price = 0;
  // let price_id = "";
  if (package_info) {
    if (props.package_type === "Yearly") {
      price = package_info.yearly_price;
      // price_id = package_info.yearly_stripe_price_id;
    } else {
      price = package_info.monthly_price;
      // price_id = package_info.monthly_stripe_price_id;
    }
  }
  if (price !== undefined) price = parseFloat(price).toFixed(2);

  const current_package_info = user.package;
  let current_plan = "";
  let is_current_plan_expired = true;
  let current_plan_difference_in_days = 0;
  let free_trial_count = userSubscriptionHistory?.filter(
    x => x?.package_type === "Trial"
  );

  if (current_package_info.id !== undefined) {
    current_plan = current_package_info.name;
    is_current_plan_expired = current_package_info.expired;
    current_plan_difference_in_days = current_package_info.difference_in_days;
  }

  const CancelSubscription = async e => {
    const cancel_payload = {};
    if (user.package) {
      cancel_payload.subscription_id = user.package.subscription_id;
      cancel_payload.user_id = user.id;
      cancel_payload.user_package_id = user.package.user_package_id;
      await CancelUserSubscription(token, cancel_payload).then(data => {
        if (data.success) {
          success(data.message);
          window.location.reload(true);
        } else {
          error(data.message);
        }
      });
    }
  };

  const HandleChangeAutoRenew = autoRenew => {
    fetching();
    update_autorenew(token, {
      subscription_id: user.package.subscription_id,
      autoRenew: autoRenew
    }).then(data => {
      if (data.success) {
        setuser({
          ...user,
          package: { ...user.package, autoRenew: autoRenew }
        });
        success(data.message);
      } else {
        error(data.message);
      }
    });
  };

  const requestUserFreeTrial = async () => {
    fetching();
    await requestFreeTrial(token, { user_id: user.id }).then(data => {
      if (data.success) {
        setuser({ ...user, is_request: 1 });
        success(data.message);
        toggleOpen(false);
      } else {
        error(data.message);
        toggleOpen(false);
      }
    });
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col-xl-8 subscribe-content">
            <h3 className="subscribe-plan">
              Current Plan:{" "}
              <span className="text-blue">
                {user?.package?.package_type
                  ? user.package.package_type === "Trial"
                    ? user.package.name
                    : `${user.package.name} (${user.package.package_type})`
                  : current_plan}
              </span>
            </h3>
            {is_current_plan_expired === true && (
              <>
                <p className="text-danger">
                  You are not subscribed to any Plan !
                </p>

                {user.is_request === 0 &&
                free_trial_count?.length < 2 &&
                userSubscriptionHistory.length < 2 ? (
                  <button
                    onClick={() => toggleOpen(true)}
                    className="btn btn-link mt-2 pl-0 text-decoration-none"
                  >
                    Request Free Trial
                  </button>
                ) : user.is_request && user.is_request === 1 ? (
                  <p className="text-info mt-2">
                    Your request for extend the free trail is in progress !
                  </p>
                ) : (
                  <></>
                )}
              </>
            )}

            {is_current_plan_expired === false && (
              <p className="subscribe-days mb-2">
                <span
                  className={`${
                    current_plan_difference_in_days <= 5 ? "text-danger" : ""
                  }`}
                >
                  {current_plan_difference_in_days}
                </span>{" "}
                days remaining in your subscription cycle.
              </p>
            )}
          </div>
          {is_current_plan_expired === false &&
          user.package.package_type !== "Trial" ? (
            <div className="col-xl-4 mt-3 mt-xl-0">
              <div className="form-group">
                <div className="custom-toggle custom-control custom-checkbox">
                  <div className="pretty p-switch p-fill">
                    <input
                      // value={user.package.autoRenew}
                      checked={user.package.autoRenew}
                      onChange={e => HandleChangeAutoRenew(e.target.checked)}
                      type="checkbox"
                    />

                    <div className="state">
                      <label>
                        Auto Renewal:&nbsp;
                        {user.package.autoRenew ? "ON" : "OFF"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {user.package.autoRenew ? (
                <div className="col-12">
                  Renewal Date:{" "}
                  <span>
                    {moment(user.package.package_expiry_date).format(
                      "DD-MM-YYYY"
                    )}
                  </span>
                </div>
              ) : null}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Modal centered isOpen={modal} backdrop={true}>
        {/* {checkAddress ? ( */}
        <SubscriptionCardModal
          setmodal={setmodal}
          modal={modal}
          package_info={package_info}
          package_type={props.package_type}
          CancelSubscription={CancelSubscription}
        />
        {/* ) : (
          <CheckAddressModal setmodal={setmodal} modal={modal} />
        )} */}
      </Modal>
      <Modal centered isOpen={isOpen} backdrop={true}>
        <ConformationModalUser
          isOpen={isOpen}
          onClose={() => toggleOpen(false)}
          confirmText={"Send Request"}
          customIcon={Warning}
          message={"Are you sure you want to request free trial ?"}
          handleConfirm={() => requestUserFreeTrial()}
          cancleBtnTxt={"Cancel"}
        />
      </Modal>
    </>
  );
};
const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user
  };
};

// export default connect(mapStateToProps, null)(SubscriptionCard);
export default compose(
  connect(mapStateToProps, { check, success, error, fetching, setuser })
)(CurrentSubscriptionCard);
