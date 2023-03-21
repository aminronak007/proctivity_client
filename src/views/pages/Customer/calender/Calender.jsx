import React, { useState, useEffect, useRef } from "react";
import enhancer from "../enhancer/CustomerEventEnhancer";
import { compose } from "redux";
import { withRouter, useParams, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import DatePicker from "react-datepicker";
import CalenderWrapper from "../calender/calender.style";
import EventDialog from "../calender/CustomerEventDialog";
import {
  AddCustomerEvent,
  EditCustomerEvent,
  GetCustomerEvent,
  DeleteCustomerEvent
} from "services/customer/event/customerEventService";
import { UserList, ViewCustomer } from "services/customer/customerService";
import NavigationActions from "redux/navigation/actions";
import AuthActions from "redux/auth/actions";
import Select from "react-select";
import { Row, Col, Modal } from "reactstrap";
import DatePickerWrapper from "components/forms/alldatepickers/datepicker.style";
import ConformationModalUser from "components/common/ConformationModalUser";
import BackButton from "components/common/BackButton";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);
let allViews = [];
Object.keys(Views).map(k => k !== "WORK_WEEK" && allViews.push(Views[k]));
const Calender = props => {
  let scrollRef = useRef(null);
  const location = useLocation();
  const scrollTo = () =>
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  const {
    token,
    success,
    error,
    user,
    values,
    handleChange,
    handleBlur,
    errors,
    setFieldValue,
    submitCount,
    touched,
    setValues,
    isValid
  } = props;
  const [modal, setModal] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [action, setAction] = useState("add");
  const [modalEvent, setmodalEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selected_user, SetSelectedUser] = useState(user.id);
  const [customer_detail, SetCustomerDetail] = useState();
  const [openDeleteModal, toggleDeleteModalOpen] = useState(false);

  const { id } = useParams();
  const getUsersOption = async () => {
    await UserList(token).then(data => {
      if (data.success) {
        setUserOptions(
          data.data.map(x => ({ value: x.id, label: x.username }))
        );
      } else {
        error(data.message);
      }
    });
  };

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

  const updateEvent = data => {
    const allEvents = [...events];
    let index = allEvents.findIndex(event => event.id === data.id);

    allEvents.splice(index, 1, data);
    setEvents([...allEvents]);
  };

  const moveEvent = (event, start, end) => {
    const data = {
      ...event,
      start,
      end
    };
    data.customer_id = id === undefined ? event.customer_id : id;
    data.user_id = selected_user;
    EditCustomerEvent(token, data, data.id).then(res => {
      if (res.success) {
        success(res.message);
        getEventDetails();

        // data.id = res.data.insertId;
      } else {
        error(res.message);
      }
    });
    setEvents(pre => [...pre, data]);
    updateEvent(data);
  };

  const resizeEvent = (event, start, end) => {
    const data = {
      ...event,
      start,
      end
    };

    data.customer_id = id === undefined ? event.customer_id : id;
    data.user_id = selected_user;
    EditCustomerEvent(token, data, data.id).then(res => {
      if (res.success) {
        success(res.message);
        getEventDetails();
      } else {
        error(res.message);
      }
    });
    setEvents(pre => [...pre, data]);
    updateEvent(data);
  };

  const eventSubmitHandler = async (data, action) => {
    if (action === "add") {
      data.customer_id = id;
      data.user_id = selected_user;
      await AddCustomerEvent(token, data).then(res => {
        if (res.success) {
          success(res.message);
          // data.id = res.data.insertId;
        } else {
          error(res.message);
        }
      });
      setEvents(pre => [...pre, data]);
    } else if (action === "edit") {
      await EditCustomerEvent(token, data, data.id).then(res => {
        if (res.success) {
          success(res.message);
          setEditForm(false);
        } else {
          error(res.message);
        }
      });
      setEvents(pre => [...pre, data]);
      updateEvent(data);
    }
    setModal(false);
    getEventDetails();
    if (id !== undefined) {
      GetCustomerInfo(id);
    }
  };

  const eventDeleteHandler = data => {
    DeleteCustomerEvent(token, data.id).then(res => {
      if (res.success) {
        success(res.message);
        const allEvents = [...events];
        let index = allEvents.findIndex(event => event.id === data.id);
        allEvents.splice(index, 1);
        setEvents([...allEvents]);
        setEditForm(false);
        setModal(false);
        getEventDetails();
        toggleDeleteModalOpen(false);
        if (id !== undefined) {
          GetCustomerInfo(id);
        }
      } else {
        toggleDeleteModalOpen(false);
        error(res.message);
      }
    });
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = event.event_color;
    var style = {
      backgroundColor: backgroundColor,
      color: "#ffffff"
    };
    return {
      style: style
    };
  };

  const GetCustomerInfo = id => {
    ViewCustomer(token, id).then(data => {
      if (data.success) {
        SetCustomerDetail(data.data);
        if (
          data.data.assign_user_id !== null &&
          data.data.assign_user_id !== undefined
        ) {
          SetSelectedUser(data.data.assign_user_id);
        }
      } else {
        error(data.message);
      }
    });
  };

  const eventHandler = e => {
    e.preventDefault();
    if (isValid) {
      const data = {
        ...modalEvent,
        title: values.title,
        desc: values.desc,
        start: values.start,
        end: values.end,
        allDay: values.values,
        event_color: values.event_color,
        recurring_event: values.recurring_event,
        user_id: selected_user,
        customer_id: id === undefined ? values.customer_id : id
      };
      eventSubmitHandler(data, action);
    }
  };

  const getEventDetails = () => {
    GetCustomerEvent(token, {
      user_id: selected_user
    }).then(res => {
      if (res.success) {
        res.data.forEach(element => {
          element.start = new Date(element.start);
          element.end = new Date(element.end);
        });
        setEvents(res.data);
      } else {
      }
    });
  };

  useEffect(() => {
    getEventDetails();
    // eslint-disable-next-line
  }, [selected_user]);

  useEffect(() => {
    if (!modal) {
      setmodalEvent(null);
    }
  }, [modal]);

  useEffect(() => {
    getUsersOption();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      GetCustomerInfo(id);
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    scrollTo();
    // eslint-disable-next-line
  }, [scrollRef.current]);

  useEffect(() => {
    setEditForm(false);
    setValues({});
  }, [location]);

  return (
    <>
      <div className="container-fluid">
        <div className="row title-sec align-items-center">
          <div className="col-sm headline">Calendar</div>
          <div className="col-sm-auto ml-auto">
            <BackButton history={props.history} />
          </div>
        </div>

        <div className="div-container">
          {customer_detail && (
            <div className="row subscribe-card-row pb-3" ref={scrollRef}>
              <div className="col-12">
                <div className="grey-box">
                  <div className="row">
                    <div className="col-lg-2 col-sm-6">
                      <label className="font-weight-bold">Ref No: </label>
                      <p>
                        <span className="font-weight-normal">
                          {customer_detail.reference_number}
                        </span>
                      </p>
                    </div>

                    <div className="col-lg-3 col-sm-6 mb-2">
                      <label className="font-weight-bold">Name: </label>
                      <p>
                        <span className="font-weight-normal">
                          {customer_detail.first_name}{" "}
                          {customer_detail.last_name}
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                      <label className="font-weight-bold">Email: </label>
                      <p>
                        {" "}
                        <span className="font-weight-normal">
                          {customer_detail.email}
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-6">
                      <label className="font-weight-bold">Mobile: </label>
                      <p>
                        <span className="font-weight-normal">
                          {customer_detail.phone}
                        </span>
                      </p>
                    </div>
                    <div className="col-lg-2 col-sm-6">
                      <label className="font-weight-bold">Address: </label>
                      <p>
                        <span className="font-weight-normal">
                          {customer_detail.address} ,{customer_detail.city},
                          {customer_detail.state}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {editForm ? (
            <div className="pt-2">
              <div className="row subscribe-card-row pb-3">
                <div className="col-12">
                  <div className="grey-box">
                    <form onSubmit={eventHandler}>
                      <Row>
                        <Col sm={12} md={4} xl={3}>
                          <div className="form-group">
                            <label>
                              Title <span className="error-msg">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control react-form-input"
                              id="title"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.title}
                              placeholder="Title"
                            />
                            <Error field="title" />
                          </div>
                        </Col>

                        <Col sm={12} md={4} xl={3}>
                          <div className="form-group">
                            <label>
                              Start <span className="error-msg">*</span>
                            </label>
                            <DatePickerWrapper {...props}>
                              <DatePicker
                                selected={values.start}
                                onChange={date => {
                                  if (date) {
                                    setFieldValue("start", date);
                                  } else {
                                    setFieldValue("start", "");
                                  }
                                }}
                                id="start"
                                value={values.start}
                                onBlur={handleBlur}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                                className="custom-datepicker form-control"
                                calendarClassName="custom-calender-class"
                                maxDate={values.end}
                              />
                            </DatePickerWrapper>
                            <Error field="start" />
                          </div>
                        </Col>
                        <Col sm={12} md={4} xl={3}>
                          <div className="form-group">
                            <label>
                              End <span className="error-msg">*</span>
                            </label>
                            <DatePickerWrapper {...props}>
                              <DatePicker
                                selected={values.end}
                                minDate={values.start}
                                onChange={date => {
                                  if (date) {
                                    setFieldValue("end", date);
                                  } else {
                                    setFieldValue("end", "");
                                  }
                                }}
                                id="end"
                                value={values.end}
                                onBlur={handleBlur}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="time"
                                className="custom-datepicker form-control"
                                calendarClassName="custom-calender-class"
                              />
                            </DatePickerWrapper>
                            <Error field="end" />
                          </div>
                        </Col>
                        <Col sm={12} md={4} xl={3}>
                          <div className="form-group">
                            <label>
                              Description <span className="error-msg">*</span>
                            </label>
                            <textarea
                              value={values.desc}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              rows={4}
                              style={{
                                resize: "none"
                              }}
                              type="text"
                              id="desc"
                              className="form-control react-form-input calender-textarea"
                              placeholder="Enter description"
                            />
                            <Error field="desc" />
                          </div>
                        </Col>
                        <Col sm={12} md={4} xl={3}>
                          <div className="form-group">
                            <label>
                              Color <span className="error-msg">*</span>
                            </label>
                            <input
                              type="color"
                              className="form-control react-form-input"
                              id="event_color"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Color"
                              value={values.event_color}
                            />
                            <Error field="event_color" />
                          </div>
                        </Col>
                        <Col sm={12} md={4} xl={3}>
                          <div className="form-group">
                            <label>
                              Recurring Event
                              <span className="error-msg">*</span>
                            </label>
                            <select
                              onChange={handleChange}
                              onBlur={handleBlur}
                              id="recurring_event"
                              className="form-control react-form-input"
                              value={values.recurring_event}
                            >
                              <option value="">No Repeat</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Bi-Weekly">Bi-Weekly</option>
                              <option value="Yearly">Yearly</option>
                            </select>

                            <Error field="recurring_event" />
                          </div>
                        </Col>
                        <Col sm={12} md={4} xl={3}>
                          <div className="form-group">
                            <label>
                              Assign User
                              <span className="error-msg">*</span>
                            </label>
                            <input
                              type="text"
                              readOnly
                              disabled
                              className="form-control react-form-input"
                              value={
                                userOptions.find(x => x.value === selected_user)
                                  .label
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                      <div className="col-12 text-center border-top pt-4 mt-4">
                        <div className="row justify-content-center">
                          <div className="col-sm-auto pr-sm-2">
                            <button
                              disabled={!isValid}
                              type="submit"
                              className="btn btn-blue w-100 mb-3"
                            >
                              Submit
                            </button>
                          </div>
                          <div className="col-sm-auto">
                            <button
                              onClick={() => toggleDeleteModalOpen(true)}
                              type="button"
                              className="btn btn-bordered w-100"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="col-sm-auto pl-sm-2">
                            <button
                              onClick={() => {
                                setEditForm(false);
                                SetCustomerDetail();
                              }}
                              type="button"
                              className="btn btn-bordered w-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="row mb-3">
            <div className="col-lg-3 col-xs-12 col-md-4">
              <Select
                id="assign_user_id"
                value={userOptions.find(x => x.value === selected_user)}
                placeholder="Select User"
                classNamePrefix="user"
                options={userOptions}
                onChange={e => {
                  SetSelectedUser(e.value);
                }}
              />
            </div>
          </div>

          <CalenderWrapper {...props} className="calender-app">
            <div>
              <div
                className="roe-card-body pb-15 plr-0"
                style={{
                  backgroundColor: "white",
                  borderRadius: "6px"
                }}
              >
                <DragAndDropCalendar
                  className="flex flex-1"
                  selectable
                  localizer={localizer}
                  events={events}
                  onEventDrop={({ event, start, end, allDay }) => {
                    if (
                      (id !== undefined && id * 1 === event.customer_id * 1) ||
                      id === undefined
                    ) {
                      moveEvent(event, start, end, allDay);
                    }
                  }}
                  resizable
                  onEventResize={({ event, start, end, allDay }) => {
                    if (
                      (id !== undefined && id * 1 === event.customer_id * 1) ||
                      id === undefined
                    ) {
                      resizeEvent(event, start, end, allDay);
                    }
                  }}
                  defaultView={Views.MONTH}
                  defaultDate={new Date()}
                  startAccessor="start"
                  endAccessor="end"
                  views={allViews}
                  step={60}
                  showMultiDayTimes
                  tooltipAccessor={"desc"}
                  onSelectEvent={event => {
                    if (
                      (id !== undefined && id * 1 === event.customer_id * 1) ||
                      id === undefined
                    ) {
                      setAction("edit");
                      setmodalEvent(event);
                      setEditForm(true);
                      setValues(event);
                      GetCustomerInfo(event.customer_id);
                      scrollTo(event);
                    } else {
                      setEditForm(false);
                      setValues({});
                    }
                  }}
                  onSelectSlot={slotInfo => {
                    if (id !== undefined && customer_detail.eventID === null) {
                      setAction("add");
                      setmodalEvent(slotInfo);
                      setModal(true);
                    }
                  }}
                  eventPropGetter={e => eventStyleGetter(e)}
                />
              </div>
            </div>
            {modal && (
              <EventDialog
                {...props}
                modal={modal}
                toggleModal={() => setModal(!modal)}
                event={modalEvent}
                action={action}
                eventSubmitHandler={eventSubmitHandler}
                eventDeleteHandler={eventDeleteHandler}
              />
            )}
          </CalenderWrapper>
        </div>
      </div>

      <Modal centered isOpen={openDeleteModal} backdrop={true}>
        {openDeleteModal && (
          <ConformationModalUser
            isOpen={openDeleteModal}
            onClose={() => toggleDeleteModalOpen(false)}
            confirmText={"Delete"}
            message={"Are you sure you want to this event."}
            handleConfirm={() => eventDeleteHandler(modalEvent)}
          />
        )}
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

export default compose(
  withRouter,
  enhancer,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(Calender);
