import React, { useEffect, useState } from "react";
import { useParams, withRouter } from "react-router-dom";
import {
  getQuoteDetailsByQuoteID,
  AcceptQuote,
  CancelQuote
} from "services/customer/quotes/customerQuotesService";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { CheckCircle } from "react-feather";
import Loader1 from "assets/images/Loaders/loader-1.svg";
import Warning from "assets/images/alert-circle.svg";

const { success, error } = NavigationActions;

const CustomerQuotesAccept = props => {
  const { success, error } = props;

  const { id, user_id } = useParams();
  const [qouteDetails, setQuoteDetails] = useState({});
  const [addLoader, setAddLoader] = useState(false);
  const [successQuote, setSuccess] = useState(false);

  const getQuoteDetails = async () => {
    await getQuoteDetailsByQuoteID(user_id, id).then(data => {
      if (data.success) {
        setQuoteDetails(data.data);
        if (
          data.data.quote_status === "accepted" ||
          data.data.quote_status === "canceled"
        ) {
          setSuccess(data.data.quote_status);
          // props.history.push(
          //     `/customer-entries/${data.data.group_id}/${data.data.status_id}/${data.data.customer_id}/quotes`
          // );
        }
        success();
      } else {
        error(data.message);
      }
    });
  };

  const Accept_Quote = async () => {
    setAddLoader(true);
    await AcceptQuote(qouteDetails.id, {
      quote_id: id,
      user_id: user_id,
      customer_id: qouteDetails.customer_id
    }).then(data => {
      if (data.success) {
        setQuoteDetails(data.data);
        success();
        setAddLoader(false);
        setSuccess("accepted");
      } else {
        error(data.message);
        setSuccess("error");
        setAddLoader(false);
      }
    });
  };

  const cancel_quote = async () => {
    setAddLoader(true);
    await CancelQuote(qouteDetails.id, {
      quote_id: id,
      user_id: user_id
    }).then(data => {
      if (data.success) {
        setQuoteDetails(data.data);
        success();
        setAddLoader(false);
        setSuccess("canceled");
      } else {
        error(data.message);
        setSuccess("error");
        setAddLoader(false);
      }
    });
  };
  useEffect(() => {
    getQuoteDetails();
    // eslint-disable-next-line
  }, [id]);

  let inititalQuantity = 0;
  let totalQuantity = qouteDetails?.line_items?.reduce(
    (previousValue, currentValue) =>
      previousValue + parseInt(currentValue.item_quantity),
    inititalQuantity
  );

  let inititalPrice = 0;
  let totalPrice = qouteDetails?.line_items?.reduce(
    (previousValue, currentValue) =>
      previousValue +
      parseFloat(currentValue.item_price) *
        parseInt(currentValue.item_quantity),
    inititalPrice
  );

  return (
    <div className="quote-accept-page">
      {addLoader ? (
        <>
          <div className="col-12 text-center">
            <img width={100} height={100} src={Loader1} alt="loader-1" />
          </div>
          <div className="col-12 text-center mt-1">
            <p>Please wait, while we process your request.</p>
          </div>
        </>
      ) : successQuote !== false ? (
        <div className="form-container" style={{ boxShadow: "none" }}>
          {successQuote === "error" ? (
            <>
              {" "}
              {/* <div className="circle-mail-icon warming-circle"> */}
              <div className="col-12 text-center">
                <div className="mx-auto mb-4">
                  <img width={80} height={80} src={Warning} alt="logo" />
                </div>
              </div>
              <div className="login-title text-center">
                <span>Somthing went wrong. Please contact administrator.</span>
              </div>
            </>
          ) : (
            <>
              <div className="circle-mail-icon success-circle">
                <CheckCircle />
              </div>
              <div className="login-title text-center">
                Quote {successQuote === "accepted" ? "Accepted" : "Canceled"}
                <span>
                  Your quote has been{" "}
                  {successQuote === "accepted" ? "accepted" : "canceled"}{" "}
                  successfully.
                </span>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="container quote-accept-content pb-3 py-md-2">
          <div className="roe-card-style">
            <div className="roe-card-body pt-3">
              <>
                <Row>
                  <Col sm="6">
                    <div className="form-group">
                      <label>
                        Customer Name <span className="error-msg">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        placeholder="Name"
                        id="name"
                        value={qouteDetails.fullName}
                        disabled
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="form-group">
                      <label>
                        Customer Email <span className="error-msg">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        placeholder="Email"
                        id="email"
                        value={qouteDetails.email}
                        disabled
                      />
                    </div>
                  </Col>
                </Row>
                <hr />
                <h5 className="pb-3">Items</h5>
                {qouteDetails?.line_items?.map((x, i) => (
                  <Row>
                    <Col sm={6}>
                      <div className="form-group">
                        <label>
                          Item Name <span className="error-msg">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control react-form-input"
                          placeholder="Item Name"
                          id={`line_items[${i}].item_name`}
                          value={x.item_name}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col sm={6} md={2}>
                      <div className="form-group">
                        <label>
                          Item Price <span className="error-msg">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control react-form-input"
                          placeholder="Price"
                          id={`line_items[${i}].item_price`}
                          value={x.item_price}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col sm={6} md={2}>
                      <div className="form-group">
                        <label>
                          Quantity <span className="error-msg">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control react-form-input"
                          placeholder="Quantity"
                          id={`line_items[${i}].item_quantity`}
                          value={x.item_quantity}
                          disabled
                        />
                      </div>
                    </Col>

                    <Col sm={6} md={2}>
                      <div className="form-group">
                        <label>
                          Total <span className="error-msg">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control react-form-input"
                          placeholder="Total"
                          value={
                            x.item_quantity && x.item_price
                              ? parseFloat(x.item_price) *
                                parseInt(x.item_quantity)
                              : null
                          }
                          disabled
                        />
                      </div>
                    </Col>
                  </Row>
                ))}
                <hr />
                <Row>
                  <Col sm={6}>
                    <label>
                      Total Items: {qouteDetails.line_items?.length}
                    </label>
                  </Col>
                  <Col sm={6}>
                    <label>Sub Total: {totalPrice ? totalPrice : null}</label>
                  </Col>
                  <Col sm={6}>
                    <label>
                      Total Quantity: {totalQuantity ? totalQuantity : null}
                    </label>
                  </Col>
                  <Col sm={6}>
                    <label>Total Price: {totalPrice ? totalPrice : null}</label>
                  </Col>
                </Row>
              </>
            </div>
            <div className="col-12 text-center mt-4">
              <div className="row justify-content-center">
                <div className="col-sm-auto pr-sm-2">
                  <button
                    // style={buttonBack}
                    disabled={addLoader}
                    type="button"
                    onClick={e => Accept_Quote(e)}
                    className="btn btn-blue w-100 mb-3"
                  >
                    Accept
                  </button>
                </div>
                <div className="col-sm-auto pl-sm-2">
                  <button
                    type="button"
                    // style={buttonBack}
                    className="btn btn-bordered w-100"
                    onClick={e => cancel_quote(e)}
                    disabled={addLoader}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    isFetching: state.navigation.isFetching
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { success, error })
)(CustomerQuotesAccept);
