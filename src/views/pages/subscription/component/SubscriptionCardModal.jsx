import React, { Fragment, useEffect, useState } from "react";
import moment from "moment";
import { ModalHeader, ModalBody } from "reactstrap";
import DatepickerWrapper from "components/forms/alldatepickers/datepicker.style";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import enhancer from "../enhancer/SubscriptionEnhancer";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import { connect } from "react-redux";
import CardImg from "../../../../assets/images/card-img.png";
import UpdateCardDetails from "../UpdateCardDetails";
import { userSubscribe } from "services/subscriptionServices";
import AuthActions from "redux/auth/actions";
import { CreditCard } from "react-feather";
import { decryptPlainText } from "helper/methods";
import ModalLoader from "components/common/ModalLoader";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const SubscriptionCardModal = props => {
  const {
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setmodal,
    modal,
    errors,
    touched,
    token,
    submitCount,
    user,
    setValues,
    error,
    fetching,
    handleReset
  } = props;
  const package_info = props.package_info;
  const total_users_added = props.total_users_added;
  const [existingCard, setExistingCard] = useState(
    user.cardname ? "existing" : "new"
  );
  const [addLoader, setAddLoader] = useState(false);

  let price = 0;

  let user_price = 0;
  if (package_info) {
    if (props.package_type === "Yearly") {
      price = package_info.yearly_price;

      user_price =
        parseFloat(total_users_added) *
        parseFloat(package_info.monthly_price_per_user * 12);
      price = parseFloat(price) + parseFloat(user_price);
      // console.log(price, user_price);
    } else {
      price = package_info.monthly_price;

      user_price =
        parseFloat(total_users_added) *
        parseFloat(package_info.monthly_price_per_user);
      price = parseFloat(price) + parseFloat(user_price);
    }
  }
  if (price !== undefined) price = parseFloat(price).toFixed(2);

  values.package_id = package_info.id;
  values.package_price = price;
  values.package_type = props.package_type;

  let currentMonth = new Date();
  let days = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  let monthlyAutoRenewDate = new Date();
  monthlyAutoRenewDate.setDate(monthlyAutoRenewDate.getDate() + days);

  let yearlyAutoRenewDate = new Date();
  yearlyAutoRenewDate.setDate(yearlyAutoRenewDate.getDate() + 365);

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

  const handleSubscribe = async e => {
    e.preventDefault();
    let { values, isValid, handleSubmit } = props;
    let cardData = {
      ...values,
      expirydate: moment(values.expirydate).format("MM/YYYY")
    };

    if (isValid) {
      fetching();
      setAddLoader(true);
      handleSubmit();
      await userSubscribe(token, user.id, cardData).then(data => {
        if (data.success) {
          setAddLoader(false);
          setmodal(!modal);
          window.location.href = data.data.url;
        } else {
          setAddLoader(false);
          error(data.message);
        }
        handleReset();
      });
    }
  };

  useEffect(() => {
    setValues({
      ...user,
      cardname: user.cardname ? decryptPlainText(user.cardname) : "",
      cardnumber: user.cardnumber ? decryptPlainText(user.cardnumber) : "",
      autoRenew: user.autoRenew ? user.autoRenew : true,
      cvv: user.cvv ? decryptPlainText(user.cvv) : "",
      expirydate: user.expirydate
        ? moment(decryptPlainText(user.expirydate), "MM/YYYY")._d
        : undefined
    });

    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <ModalHeader toggle={() => setmodal(!modal)}>
        Subscribe - ${price}/{props.package_type}
      </ModalHeader>
      <ModalBody>
        <form>
          {addLoader ? (
            <ModalLoader message="Please wait, while we redirecting you to stripe checkout page." />
          ) : (
            <>
              {user.cardname ? (
                <div className="row">
                  <div className="col-6 mb-3">
                    <div className="pretty p-default p-round">
                      <input
                        type="radio"
                        name="radio1"
                        value={"existing"}
                        checked={existingCard === "existing"}
                        onChange={() => {
                          setExistingCard("existing");
                          setValues({
                            ...user,
                            cardname: user.cardname
                              ? decryptPlainText(user.cardname)
                              : "",
                            cardnumber: user.cardnumber
                              ? decryptPlainText(user.cardnumber)
                              : "",
                            autoRenew: user.autoRenew ? user.autoRenew : true,
                            cvv: user.cvv ? decryptPlainText(user.cvv) : "",
                            expirydate: user.expirydate
                              ? moment(
                                  decryptPlainText(user.expirydate),
                                  "MM/YYYY"
                                )._d
                              : undefined
                          });
                        }}
                      />
                      <div className="state">
                        <label>Existing Card</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="pretty p-default p-round">
                      <input
                        type="radio"
                        name="radio1"
                        value={"new"}
                        checked={existingCard === "new"}
                        onChange={() => {
                          setExistingCard("new");
                          setValues({
                            ...user,
                            cardname: "",
                            cardnumber: "",
                            expirydate: undefined,
                            cvv: "",
                            autoRenew: true
                          });
                        }}
                      />
                      <div className="state">
                        <label>New Card</label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}

              {existingCard === "new" ? (
                <>
                  <div className="form-group">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      aria-describedby="emailHelp"
                      placeholder="Name on Card"
                      id="cardname"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.cardname}
                    />
                    <Error field="cardname" />
                  </div>

                  <div className="form-group">
                    <img
                      src={CardImg}
                      alt=""
                      className="form-icons form-icons-right"
                    />
                    <label>Card Number</label>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      placeholder="Card Number"
                      id="cardnumber"
                      autoComplete=""
                      onBlur={handleBlur}
                      onChange={handleChange}
                      maxLength="16"
                      value={values.cardnumber}
                    />
                    <Error field="cardnumber" />
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <div className="form-group">
                        <label>Card Expiry</label>

                        <DatepickerWrapper {...props}>
                          <DatePicker
                            selected={values.expirydate}
                            onChange={date => {
                              if (date) {
                                setFieldValue("expirydate", date);
                              }
                            }}
                            id="expirydate"
                            className="custom-datepicker"
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            onBlur={handleBlur}
                            minDate={moment().startOf("month")._d}
                          />
                        </DatepickerWrapper>
                        <Error field="expirydate" />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-group">
                        <CreditCard className="form-icons form-icons-right" />
                        <label>CVV</label>
                        <input
                          type="text"
                          className="form-control react-form-input"
                          placeholder="CVV"
                          id="cvv"
                          autoComplete=""
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.cvv}
                          maxLength="3"
                        />
                        <Error field="cvv" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grey-box card-box mb-3">
                  <div className="card-box-detail">
                    {user.cardname ? (
                      <UpdateCardDetails updateFalse={true} />
                    ) : (
                      <h6>No Card Details</h6>
                    )}
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <div className="custom-toggle custom-control custom-checkbox">
                      <div className="pretty p-switch p-fill">
                        <input
                          // value={values.autoRenew}
                          checked={values.autoRenew}
                          onChange={e =>
                            setFieldValue("autoRenew", e.target.checked)
                          }
                          type="checkbox"
                        />

                        <div className="state">
                          <label>
                            Auto Renewal:&nbsp;
                            {values.autoRenew ? "ON" : "OFF"}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <button
            className="btn btn-blue w-100 border-0"
            onClick={e => handleSubscribe(e)}
            disabled={addLoader}
          >
            Subscribe
          </button>
        </form>
      </ModalBody>
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    user: state.auth.user
  };
};
export default compose(
  enhancer,
  connect(mapStateToProps, { success, error, setuser, fetching })
)(SubscriptionCardModal);
