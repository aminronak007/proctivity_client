import React, { Fragment, useEffect, useState } from "react";
import moment from "moment";
import { ModalHeader, ModalBody } from "reactstrap";
import DatepickerWrapper from "components/forms/alldatepickers/datepicker.style";
import DatePicker from "react-datepicker";
import enhancer from "../enhancer/SubscriptionEnhancer";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import { connect } from "react-redux";
import { updateCardDetails } from "services/userServices";
import AuthActions from "redux/auth/actions";
import { CreditCard } from "react-feather";
import CardImg from "../../../../assets/images/card-img.png";
import { encryptPlainText } from "helper/methods";
import ModalLoader from "components/common/ModalLoader";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const CardDetailsModal = props => {
  const {
    values,
    handleChange,
    handleBlur,
    setFieldValue,
    setmodal,
    modal,
    handleReset,
    errors,
    touched,
    token,
    submitCount,
    user,
    setValues,
    success,
    error,
    setuser
  } = props;

  const [addLoader, setAddLoader] = useState(false);
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

  const handleCardDetails = async e => {
    e.preventDefault();
    let { values, isValid, handleSubmit } = props;
    let cardData = {
      ...values,
      expirydate: moment(values.expirydate).format("MM/YYYY")
    };

    if (isValid) {
      handleSubmit();
      fetching();
      setAddLoader(true);
      await updateCardDetails(token, user.id, cardData).then(data => {
        if (data.success) {
          setuser({
            ...cardData,
            cardname: encryptPlainText(values.cardname),
            cardnumber: encryptPlainText(values.cardnumber),
            cvv: encryptPlainText(values.cvv),
            expirydate: encryptPlainText(
              moment(values.expirydate).format("MM/YYYY")
            )
          });
          success(data.message);
          setmodal(!modal);
          setAddLoader(false);
        } else {
          error(data.message);
          setAddLoader(false);
        }
        handleReset();
      });
    }
  };

  useEffect(() => {
    setValues({
      ...user,
      cardname: "",
      cardnumber: "",
      cvv: "",
      expirydate: undefined,
      autoRenew: true
    });
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      <ModalHeader toggle={() => setmodal(!modal)}>
        Add Card Details
      </ModalHeader>
      <ModalBody>
        <form>
          {addLoader ? (
            <ModalLoader message="Please wait, while we processing your request." />
          ) : (
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
                  maxLength="16"
                  onBlur={handleBlur}
                  onChange={handleChange}
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
                        onChange={date => setFieldValue("expirydate", date)}
                        id="expirydate"
                        className="custom-datepicker"
                        dateFormat="MM/yyyy"
                        value={values.expirydate}
                        onBlur={handleBlur}
                        minDate={moment().startOf("month")._d}
                        showMonthYearPicker
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
          )}
          <button
            className="btn btn-blue w-100"
            onClick={e => handleCardDetails(e)}
            disabled={addLoader}
          >
            Add
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
)(CardDetailsModal);
