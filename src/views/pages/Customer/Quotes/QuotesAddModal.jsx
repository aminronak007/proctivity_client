import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/QuotesEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button, Row, Col } from "reactstrap";
import {
  addQuotes,
  getQuotesById,
  updateQuotes
} from "services/customer/quotes/customerQuotesService";
import { useParams } from "react-router-dom";
import { Minus, Plus } from "react-feather";
import ModalLoader from "components/common/ModalLoader";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const QuotesAddModal = props => {
  const {
    token,
    success,
    error,
    isEdit,
    onClose,
    values,
    handleChange,
    handleSubmit,
    setValues,
    isValid,
    handleBlur,
    errors,
    touched,
    submitCount,
    toggleRefresh,
    editId,
    customer_detail
  } = props;

  const [addLoader, setAddLoader] = useState(false);

  const { id } = useParams();

  const ItemsError = props => {
    const field1 = props.field;
    const index = props.index;
    if (
      (errors &&
        errors.hasOwnProperty("line_items") &&
        errors?.line_items[index] &&
        errors?.line_items[index][field1] &&
        touched &&
        touched.hasOwnProperty("line_items") &&
        touched?.line_items[index] &&
        touched?.line_items[index][field1]) ||
      submitCount > 0
    ) {
      return (
        <span className={props.class ? props.class : "error-msg"}>
          {errors &&
            errors.hasOwnProperty("line_items") &&
            errors?.line_items[index] &&
            errors?.line_items[index][field1]}
        </span>
      );
    } else {
      return <span />;
    }
  };

  const handleQuotesSubmit = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      setAddLoader(true);
      var quotesData = {
        ...values,
        customer_id: id,
        quotes: values.quotes
      };
      isEdit
        ? updateQuotes(token, values.id, quotesData).then(data => {
            if (data.success) {
              success(data.message);
              onClose();
              toggleRefresh(true);
              setAddLoader(false);
            } else {
              error(data.message);
              setAddLoader(false);
            }
          })
        : addQuotes(token, quotesData).then(data => {
            if (data.success) {
              success(data.message);
              toggleRefresh(true);
              setAddLoader(false);
              onClose();
            } else {
              error(data.message);
              setAddLoader(false);
            }
          });
    }
  };

  let inititalQuantity = 0;
  let totalQuantity = values.line_items.reduce(
    (previousValue, currentValue) =>
      previousValue + parseInt(currentValue.item_quantity),
    inititalQuantity
  );

  let inititalPrice = 0;
  let totalPrice = values.line_items.reduce(
    (previousValue, currentValue) =>
      previousValue +
      parseFloat(currentValue.item_price) *
        parseInt(currentValue.item_quantity),
    inititalPrice
  );
  const getQuoteDetails = () => {
    fetching();
    getQuotesById(token, editId).then(data => {
      if (data.success) {
        success();
        setValues(data.data);
      } else {
        error(data.message);
      }
    });
  };
  useEffect(() => {
    setValues({
      ...values,
      customer_id: id,
      customer_stripe_id: customer_detail.stripe_customer_id,
      total_items: values.line_items.length,
      total_quantity: totalQuantity ? totalQuantity : 0,
      sub_total: totalPrice ? totalPrice : 0,
      total_price: totalPrice ? totalPrice : 0
    });

    // eslint-disable-next-line
  }, [values.line_items.length, totalQuantity, totalPrice]);

  useEffect(() => {
    if (isEdit) {
      getQuoteDetails(editId);
    }
    // eslint-disable-next-line
  }, [editId]);

  return (
    <>
      <ModalHeader toggle={() => onClose()}>
        {`${isEdit ? "Update" : "Add"} Quote`}
      </ModalHeader>
      <ModalBody>
        {addLoader ? (
          <ModalLoader message="Please wait, while we are adding quote." />
        ) : (
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
                    value={
                      customer_detail.first_name +
                      " " +
                      customer_detail.last_name
                    }
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
                    value={customer_detail.email}
                    disabled
                  />
                </div>
              </Col>
            </Row>
            <hr />
            <Row className="mb-4 align-items-center">
              <Col xs={5}>
                <h5>Items</h5>
              </Col>
              <Col xs={7}>
                <div className="text-right">
                  <button
                    className="btn btn-blue btn-sm-40"
                    onClick={() => {
                      values.line_items.push({
                        position: values.line_items.length + 1,
                        item_name: "",
                        item_price: "",
                        item_quantity: ""
                      });
                      setValues(values);
                    }}
                  >
                    <Plus className="mr-2" /> Add Item
                  </button>
                </div>
              </Col>
            </Row>

            {values.line_items.map((x, i) => (
              <Row className="position-relative">
                <Col xs={10} sm={5} lg={5}>
                  <div className="form-group">
                    <label>
                      Item Name <span className="error-msg">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      placeholder="Item Name"
                      id={`line_items[${i}].item_name`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={x.item_name}
                    />
                    <ItemsError field="item_name" index={i} />
                  </div>
                </Col>
                <Col xs={10} sm={5} lg={2}>
                  <div className="form-group">
                    <label>
                      Item Price <span className="error-msg">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      placeholder="Price"
                      id={`line_items[${i}].item_price`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={x.item_price}
                    />
                    <ItemsError field="item_price" index={i} />
                  </div>
                </Col>
                <Col xs={10} sm={5} lg={2}>
                  <div className="form-group">
                    <label>
                      Quantity <span className="error-msg">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control react-form-input"
                      placeholder="Quantity"
                      id={`line_items[${i}].item_quantity`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={x.item_quantity}
                    />
                    <ItemsError field="item_quantity" index={i} />
                  </div>
                </Col>

                <Col xs={10} sm={5} lg={2}>
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
                          ? parseFloat(x.item_price) * parseInt(x.item_quantity)
                          : null
                      }
                      disabled
                    />
                  </div>
                </Col>
                <Col sm={5} lg={1} className="last-minus-col m-auto">
                  <button
                    className="btn btn-link add-status-circle"
                    type="button"
                    style={{
                      borderLeft: "0px",
                      borderBottomLeftRadius: "0px",
                      borderTopLeftRadius: "0px",
                      paddingLeft: 1
                    }}
                    disabled={values.line_items.length <= 1}
                    onClick={() => {
                      values.line_items.splice(i, 1);
                      setValues(values);
                    }}
                  >
                    <Minus />
                  </button>
                </Col>
              </Row>
            ))}

            <hr />
            <Row>
              <Col sm={6}>
                <label>Total Items: {values.line_items?.length}</label>
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
        )}

        <div className="row justify-content-center">
          <div className="col-lg-3 col-sm-6 mt-3 pr-sm-2">
            <Button
              onClick={handleQuotesSubmit}
              className="btn btn-blue w-100 border-0"
              type="button"
              disabled={addLoader}
            >
              Submit
            </Button>
          </div>
          <div className="col-lg-3 col-sm-6 mt-3 pl-sm-2">
            <Button
              onClick={() => onClose()}
              className="btn btn-blue w-100 btn-bordered"
              type="button"
              disabled={addLoader}
            >
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
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

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(QuotesAddModal);
