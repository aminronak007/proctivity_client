import React, { useState } from "react";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import { Modal } from "reactstrap";
import SubscriptionCardModal from "./component/SubscriptionCardModal";
import { CancelUserSubscription } from "services/subscriptionServices";
import Warning from "assets/images/alert-circle.svg";
import ConformationModalUser from "components/common/ConformationModalUser";

const { success, error, fetching } = NavigationActions;

const SubscriptionCard = props => {
  const {
    user,
    success,
    error,
    token,
    activeTab,
    fetching,
    isFetching
  } = props;
  const package_info = props.package_info;
  const [modal, setmodal] = useState(false);
  const total_users_added = props.total_users_added;
  // console.log(package_info);
  // const [isOpen, toggleOpen] = useState(false);
  // const [checkAddress, setCheckAddress] = useState("");
  let price = 0;

  let user_price = 0;
  if (package_info) {
    if (props.package_type === "Yearly") {
      price = package_info.yearly_price;
      user_price =
        total_users_added * (package_info.monthly_price_per_user * 12);
      // price_id = package_info.yearly_stripe_price_id;
    } else {
      price = package_info.monthly_price;
      user_price = total_users_added * package_info.monthly_price_per_user;
      // price_id = package_info.monthly_stripe_price_id;
    }
  }

  if (price !== undefined) price = parseFloat(price).toFixed(2);

  const current_package_info = user.package;
  let current_plan = "";
  let is_current_plan_expired = true;

  let current_is_free = 1;
  if (current_package_info.id !== undefined) {
    current_plan = current_package_info.name;
    is_current_plan_expired = current_package_info.expired;

    current_is_free = current_package_info.is_free;
  }

  const CancelSubscription = async e => {
    const cancel_payload = {};
    if (user.package) {
      fetching();
      cancel_payload.subscription_id = user.package.subscription_id;
      cancel_payload.user_id = user.id;
      cancel_payload.user_package_id = user.package.user_package_id;
      await CancelUserSubscription(token, cancel_payload).then(data => {
        if (data.success) {
          success(data.message);
          setConfirmModalProps({
            isOpen: false
          });
          window.location.reload(true);
        } else {
          error(data.message);
        }
      });
    }
  };

  const closeConfirmModal = () => {
    setConfirmModalProps({
      isOpen: false,
      confirmText: "",
      message: "",
      handleConfirm: {}
    });
  };
  const [confirmModalProps, setConfirmModalProps] = useState({
    isOpen: false,
    confirmText: "",
    message: "",
    handleConfirm: {},
    cancleBtnTxt: "Cancel"
  });
  return (
    <>
      <div>
        <div className="row">
          <div className="col-xl-8 subscribe-content">
            <h3 className="subscribe-plan">
              Subscription Plan:{" "}
              <span className="text-blue">{props.package_type}</span>
            </h3>

            <p className="subscribe-days">
              Price/
              {props.package_type === "Monthly" ? "Month" : "Year"}: ${price}
            </p>
            {user_price > 0 && (
              <p className="subscribe-days">
                Price/Users: $
                {props.package_type === "Monthly"
                  ? package_info.monthly_price_per_user
                  : package_info.monthly_price_per_user * 12}
              </p>
            )}
            {user_price > 0 && (
              <p className="subscribe-days">
                Total User Price ({total_users_added}): ${user_price.toFixed(2)}
              </p>
            )}
          </div>

          <div className="col-xl-4 mt-3 mt-xl-0">
            {user?.package?.package_type === "Monthly" && activeTab === "2" ? (
              <button
                className="btn btn-blue w-100"
                onClick={() => {
                  if (current_plan === "Monthly") {
                  } else {
                    setConfirmModalProps({
                      isOpen: true,
                      confirmText: "Confirm",
                      message:
                        "Your monthly subscription will be upgraded to yearly subscription and you will be charged for the whole year",
                      handleConfirm: () => {
                        setmodal(!modal);
                        closeConfirmModal();
                      },
                      cancleBtnTxt: "Cancel"
                    });
                  }
                }}
              >
                Subscribe Now
              </button>
            ) : (
              <button
                className="btn btn-blue w-100"
                disabled={
                  current_package_info.difference_in_days <= 5
                    ? false
                    : is_current_plan_expired === false && current_is_free !== 1
                    ? true
                    : false
                }
                onClick={() => setmodal(!modal)}
              >
                Subscribe Now
              </button>
            )}

            <button
              onClick={() =>
                setConfirmModalProps({
                  isOpen: true,
                  confirmText: "Cancel Subscription",
                  message: "Are you sure you want to cancel the subscription?",
                  handleConfirm: () => CancelSubscription(),
                  cancleBtnTxt: "Close"
                })
              }
              className="btn btn-link btn-block mt-2"
              disabled={
                user?.package?.name === "Free Trial"
                  ? true
                  : user?.package?.package_type === "Monthly" &&
                    activeTab === "2"
                  ? true
                  : !user.package.id
                  ? true
                  : false
              }
            >
              Cancel Subscription
            </button>
          </div>
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
          total_users_added={total_users_added}
        />
      </Modal>

      <Modal centered isOpen={confirmModalProps.isOpen} backdrop={true}>
        <ConformationModalUser
          isOpen={confirmModalProps.isOpen}
          onClose={() => closeConfirmModal()}
          confirmText={confirmModalProps.confirmText}
          message={confirmModalProps.message}
          handleConfirm={confirmModalProps.handleConfirm}
          cancleBtnTxt={confirmModalProps.cancleBtnTxt}
          customIcon={Warning}
          addLoader={isFetching}
        />
      </Modal>
    </>
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

// export default connect(mapStateToProps, null)(SubscriptionCard);
export default compose(connect(mapStateToProps, { success, error, fetching }))(
  SubscriptionCard
);
