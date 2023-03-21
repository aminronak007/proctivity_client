import React, { useEffect, useState } from "react";
import NavigationActions from "redux/navigation/actions";
import enhancer from "./enhancer/PackageEnhancer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { editPackages, getPackages } from "services/packageServices";
import { getFeatures } from "services/featuresServices";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap";
import classnames from "classnames";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const Packages = props => {
  const {
    token,
    success,
    error,
    handleChange,
    handleBlur,
    setValues,
    values,
    errors,
    touched,
    isValid,
    submitCount,
    fetching,
    setFieldValue
  } = props;

  const [activeTab, setActiveTab] = useState("1");
  const [features, setFeatures] = useState([]);
  const [monthlyFeatures, setMonthlyFeatures] = useState([]);
  const [yearlyFeatures, setYearlyFeatures] = useState([]);
  // const [errMsgYear, setErrMsgYear] = useState("");
  // const [errMsgMonth, setErrMsgMonth] = useState("");

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

  const GetSubscriptionPackages = () => {
    fetching();
    getPackages(token).then(data => {
      if (data.success) {
        setValues(data.data);
        setMonthlyFeatures(
          data.data.monthly_package_features
            ? data.data.monthly_package_features.split(",")
            : []
        );
        setYearlyFeatures(
          data.data.yearly_package_features
            ? data.data.yearly_package_features.split(",")
            : []
        );
        success();
      } else {
        error(data.message);
      }
    });
  };

  const getFeaturesList = async () => {
    fetching();
    await getFeatures(token).then(data => {
      if (data.success) {
        setFeatures(data.data);
        success();
      } else {
        error(data.message);
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isValid) {
      fetching();
      editPackages(token, values).then(data => {
        if (data.success) {
          success(data.message);
        } else {
          error(data.message);
        }
      });
    }
  };
  console.log(values);
  useEffect(() => {
    GetSubscriptionPackages();
    getFeaturesList();
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //     monthlyFeatures.length === 0
  //         ? setErrMsgMonth("Please select monthly features")
  //         : setErrMsgMonth("");
  //     yearlyFeatures.length === 0
  //         ? setErrMsgYear("Please select yearly features")
  //         : setErrMsgYear("");
  // }, [monthlyFeatures, yearlyFeatures]);

  return (
    <div className="container-fluid">
      <div className="d-flex mt-4 px-2">
        <div className="headline">Packages</div>
        {/* <div className="ml-auto">
                    <button
                        className="c-btn c-primary"
                        // onClick={() => setOpenModal(true)}
                    >
                        <i className="fas fa-pencil-alt mr-10" /> Edit Package
                    </button>
                </div> */}
      </div>
      <div className="div-container">
        <div className="roe-card-style">
          <div className="roe-card-body pa-15">
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames(
                    { active: activeTab === "1" },
                    "doc-title"
                  )}
                  onClick={() => {
                    setActiveTab("1");
                  }}
                >
                  Monthly
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames(
                    { active: activeTab === "2" },
                    "doc-title"
                  )}
                  onClick={() => {
                    setActiveTab("2");
                  }}
                >
                  Yearly
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <Row className="mt-10">
                  <Col sm="6">
                    <div className="form-group">
                      <label>
                        Package Name
                        <span className="error-msg">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        onBlur={handleBlur}
                        placeholder="Package Name"
                      />
                      <Error field="name" />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="form-group">
                      <label>
                        Monthly Price
                        <span className="error-msg">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="monthly_price"
                        name="monthly_price"
                        value={values.monthly_price}
                        placeholder="Monthly price"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Error field="monthly_price" />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="form-group">
                      <label>
                        Package Features
                        <span className="error-msg">*</span>
                      </label>
                      <Card>
                        <CardBody>
                          <Row>
                            {features.length > 0 ? (
                              features
                                .filter(f => f.status === "active")
                                .map((x, i) => {
                                  var index = monthlyFeatures.findIndex(
                                    fi => fi === x.name
                                  );

                                  return (
                                    <Col sm={6} key={`key_${i}`} lg={4}>
                                      <div className="form-check mtb-16">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          id={`features_${i}`}
                                          name={`features_${i}`}
                                          value={index !== -1}
                                          checked={index !== -1}
                                          onChange={e => {
                                            if (index === -1) {
                                              setFieldValue(
                                                "monthly_package_features",
                                                [
                                                  ...monthlyFeatures,
                                                  x.name
                                                ].toString()
                                              );
                                              setMonthlyFeatures([
                                                ...monthlyFeatures,
                                                x.name
                                              ]);
                                            } else {
                                              setFieldValue(
                                                "monthly_package_features",
                                                [
                                                  ...monthlyFeatures.filter(
                                                    fi => fi !== x.name
                                                  )
                                                ].toString()
                                              );
                                              setMonthlyFeatures([
                                                ...monthlyFeatures.filter(
                                                  fi => fi !== x.name
                                                )
                                              ]);
                                            }
                                          }}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`features_${i}`}
                                        >
                                          {x.name}
                                        </label>
                                      </div>
                                    </Col>
                                  );
                                })
                            ) : (
                              <>No Features Added.</>
                            )}
                          </Row>
                          {/* {errMsgMonth ? (
                                                        <span
                                                            className={
                                                                "error-msg"
                                                            }
                                                        >
                                                            {errMsgMonth}
                                                        </span>
                                                    ) : (
                                                        <></>
                                                    )} */}
                        </CardBody>
                      </Card>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row className="mt-10">
                  <Col sm="6">
                    <div className="form-group">
                      <label>
                        Package Name
                        <span className="error-msg">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                        onBlur={handleBlur}
                        placeholder="Package Name"
                      />
                      <Error field="name" />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="form-group">
                      <label>
                        Yearly Price
                        <span className="error-msg">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control react-form-input"
                        id="yearly_price"
                        name="yearly_price"
                        value={values.yearly_price}
                        placeholder="Yearly price"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Error field="yearly_price" />
                    </div>
                  </Col>
                  <Col sm={12}>
                    <div className="form-group">
                      <label>
                        Package Features
                        <span className="error-msg">*</span>
                      </label>
                      <Card>
                        <CardBody>
                          <Row>
                            {features.length > 0 ? (
                              features
                                .filter(f => f.status === "active")
                                .map((x, i) => {
                                  var index = yearlyFeatures.findIndex(
                                    fi => fi === x.name
                                  );
                                  return (
                                    <Col sm={6} key={`key_${i}`} lg={4}>
                                      <div className="form-check mtb-16">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          id={`yfeatures_${i}`}
                                          name={`yfeatures_${i}`}
                                          value={index !== -1}
                                          checked={index !== -1}
                                          onChange={e => {
                                            if (index === -1) {
                                              setFieldValue(
                                                "yearly_package_features",
                                                [
                                                  ...yearlyFeatures,
                                                  x.name
                                                ].toString()
                                              );
                                              setYearlyFeatures([
                                                ...yearlyFeatures,
                                                x.name
                                              ]);
                                            } else {
                                              setFieldValue(
                                                "yearly_package_features",
                                                [
                                                  ...yearlyFeatures.filter(
                                                    fi => fi !== x.name
                                                  )
                                                ].toString()
                                              );
                                              setYearlyFeatures([
                                                ...yearlyFeatures.filter(
                                                  fi => fi !== x.name
                                                )
                                              ]);
                                            }
                                          }}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor={`yfeatures_${i}`}
                                        >
                                          {x.name}
                                        </label>
                                      </div>
                                    </Col>
                                  );
                                })
                            ) : (
                              <>No Features Added.</>
                            )}
                          </Row>
                          {/* {errMsgYear ? (
                                                        <span
                                                            className={
                                                                "error-msg"
                                                            }
                                                        >
                                                            {errMsgYear}
                                                        </span>
                                                    ) : (
                                                        <></>
                                                    )} */}
                        </CardBody>
                      </Card>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
            <div className="text-center">
              <button
                // style={buttonBack}
                type="submit"
                className="c-btn c-primary ma-5"
                onClick={e => handleSubmit(e)}
              >
                Submit
              </button>
              {/* <button
                                type="button"
                                // style={buttonBack}
                                className="c-btn ma-5 c-outline-primary"
                                // onClick={() => setIsEdit(false)}
                            >
                                Cancel
                            </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
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
)(Packages);
