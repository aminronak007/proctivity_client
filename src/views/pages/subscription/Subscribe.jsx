import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import SubscriptionCard from "./SubscriptionCard";
import CurrentSubscriptionCard from "./CurrentSubscriptionCard";
import { getPackages } from "services/packageServices";
import NavigationAction from "redux/navigation/actions";
import UpdateCardDetails from "./UpdateCardDetails";
import { getUserDetails, getUserPackageDetails } from "services/userServices";
import AuthActions from "redux/auth/actions";
import ViewUserSubscriptionHistory from "./ViewUserSubscriptionHistory";
import { Modal } from "reactstrap";
import CardDetailsModal from "./component/CardDetailsModal";
import ConformationModalUser from "components/common/ConformationModalUser";
import Warning from "assets/images/alert-circle.svg";
import CardLoader from "components/common/CardLoader";

const { setuser } = AuthActions;
const { success, error, fetching } = NavigationAction;

const Subscribe = props => {
  const { success, error, user, token, setuser } = props;
  const [activeTab, setActiveTab] = useState("");
  const [package_info, SetPackageInfo] = useState([]);
  const [userSubscriptionHistory, setUserSubscriptionHistory] = useState([]);
  const [modal, setmodal] = useState(false);
  const [addLoader, setAddloader] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({
    isOpen: false,
    confirmText: "",
    message: "",
    handleConfirm: {},
    cancleBtnTxt: "Cancel"
  });
  const [total_users_added, SetTotalUsersAdded] = useState(0);

  const closeConfirmModal = () => {
    setConfirmModalProps({
      isOpen: false,
      confirmText: "",
      message: "",
      handleConfirm: {}
    });
  };

  const toggle = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const loadUserCardDetails = async () => {
    setAddloader(true);
    await getUserDetails(token, user.id).then(data => {
      if (data.success) {
        setuser(data.data);
        setAddloader(false);
        success();
      } else {
        setAddloader(false);
        error(data.message);
      }
    });
  };

  const GetSubscriptionPackages = async () => {
    setAddloader(true);
    fetching();
    await getPackages(token).then(data => {
      if (data.success) {
        SetPackageInfo(data.data);
        setAddloader(false);
        success();
      } else {
        setAddloader(false);
        error(data.message);
      }
    });
  };

  const loadUserSubscriptionHistory = () => {
    setAddloader(true);
    getUserPackageDetails(token, user.id).then(data => {
      if (data.success) {
        const users = data.data.filter((row, index) => {
          return row.reference === "User" && row.user_deleted_or_not === 0;
        });
        setAddloader(false);
        SetTotalUsersAdded(users.length);
        setUserSubscriptionHistory(data.data);
        success();
      } else {
        setAddloader(false);
        error(data.message);
      }
    });
  };

  const loadActiveTab = () => {
    if (user?.package?.package_type === "Yearly") {
      setActiveTab("2");
    } else {
      setActiveTab("1");
    }
  };

  useEffect(() => {
    GetSubscriptionPackages();
    loadUserCardDetails();
    loadUserSubscriptionHistory();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadActiveTab();
    // eslint-disable-next-line
  }, [user?.package?.package_type]);

  return (
    <div>
      <div className="container-fluid">
        <div className="row title-sec">
          <div className="col-sm headline">Subscription</div>
        </div>
        {addLoader ? (
          <CardLoader />
        ) : (
          <div className="div-container subscribe-page">
            {
              <>
                <div className="row subscribe-card-row">
                  <div className="col-12">
                    <div className="grey-box">
                      {package_info && user && (
                        <CurrentSubscriptionCard
                          package_type="Monthly"
                          package_info={package_info}
                          key="1"
                          activeTab={activeTab}
                          userSubscriptionHistory={userSubscriptionHistory}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col subscribe-tab">
                    <Nav tabs>
                      <NavItem>
                        <NavLink
                          className={classnames(
                            {
                              active: activeTab === "1"
                            },
                            "doc-title"
                          )}
                          onClick={() => {
                            toggle("1");
                          }}
                          disabled={
                            user?.package?.package_type === "Yearly" &&
                            user?.package.difference_in_days >= 5
                              ? true
                              : false
                          }
                        >
                          Monthly
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames(
                            {
                              active: activeTab === "2"
                            },
                            "doc-title"
                          )}
                          onClick={() => {
                            toggle("2");
                          }}
                        >
                          Yearly
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </div>
                <div className="row subscribe-card-row">
                  <div className="col-md-7 col-xl-9">
                    <div className="grey-box">
                      <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                          {package_info && user && (
                            <SubscriptionCard
                              package_type="Monthly"
                              package_info={package_info}
                              key="1"
                              activeTab={activeTab}
                              total_users_added={total_users_added}
                            />
                          )}
                        </TabPane>
                        <TabPane tabId="2">
                          {package_info && user && (
                            <SubscriptionCard
                              package_type="Yearly"
                              package_info={package_info}
                              key="2"
                              activeTab={activeTab}
                              total_users_added={total_users_added}
                            />
                          )}
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                  <div className="col-md-5 col-xl-3">
                    <div className="grey-box card-box">
                      <h5>Card Details</h5>
                      <div className="card-box-detail">
                        {user.cardname ? (
                          <>
                            <UpdateCardDetails />
                            <button
                              onClick={() =>
                                setConfirmModalProps({
                                  confirmText: "Add Card",
                                  isOpen: true,
                                  message:
                                    "This will delete your previous card and you will be able to add a new card",
                                  handleConfirm: () => {
                                    setmodal(true);
                                    closeConfirmModal();
                                  }
                                })
                              }
                              type="button"
                              className="btn btn-bordered btn-block mt-3"
                            >
                              Update Card
                            </button>
                          </>
                        ) : (
                          <>
                            <h6>No Card Details</h6>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-4 pt-2">
                    {userSubscriptionHistory.length > 0 ? (
                      <ViewUserSubscriptionHistory
                        userSubscriptionHistory={userSubscriptionHistory}
                      />
                    ) : null}
                  </div>
                </div>
              </>
            }
          </div>
        )}
      </div>
      <Modal centered isOpen={modal} backdrop={true}>
        <CardDetailsModal setmodal={setmodal} modal={modal} />
      </Modal>

      <Modal centered isOpen={confirmModalProps.isOpen} backdrop={true}>
        {confirmModalProps.isOpen && (
          <ConformationModalUser
            isOpen={confirmModalProps.isOpen}
            onClose={() => closeConfirmModal()}
            confirmText={confirmModalProps.confirmText}
            message={confirmModalProps.message}
            handleConfirm={confirmModalProps.handleConfirm}
            cancleBtnTxt={confirmModalProps.cancleBtnTxt}
            customIcon={Warning}
          />
        )}
      </Modal>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user,
    tab: state.navigation.tab,
    isFetching: state.navigation.isFetching
  };
};

export default connect(mapStateToProps, {
  success,
  error,
  fetching,
  setuser
})(Subscribe);
