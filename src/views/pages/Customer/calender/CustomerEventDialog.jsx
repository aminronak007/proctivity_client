import React, { useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import enhancer from "../enhancer/CustomerEventEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import DatePicker from "react-datepicker";
import DatepickerWrapper from "components/forms/alldatepickers/datepicker.style";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const CustomerEventDialog = props => {
  const {
    className,
    modal,
    toggleModal,
    event,
    action,
    eventSubmitHandler,
    eventDeleteHandler,
    values,
    handleChange,
    handleBlur,
    errors,
    setFieldValue,
    submitCount,
    touched,
    isValid,
    setValues
  } = props;

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

  const eventHandler = e => {
    e.preventDefault();
    if (isValid) {
      const data = {
        ...event,
        title: values.title,
        desc: values.desc,
        start: values.start,
        end: values.end,
        allDay: values.values,
        event_color: values.event_color,
        recurring_event: values.recurring_event
      };
      eventSubmitHandler(data, action);
    }
  };

  useEffect(() => {
    setValues({
      ...values,
      ...event
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return (
    <div>
      <Modal
        centered
        isOpen={modal}
        toggle={() => toggleModal()}
        className={className}
      >
        <ModalHeader toggle={() => toggleModal()}>
          {action === "add" ? "Add" : "Edit"} Event
        </ModalHeader>
        <ModalBody>
          <form onSubmit={eventHandler}>
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

            <div className="form-group">
              <label>
                Start <span className="error-msg">*</span>
              </label>
              <DatepickerWrapper {...props}>
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
              </DatepickerWrapper>
              <Error field="start" />
            </div>

            <div className="form-group">
              <label>
                End <span className="error-msg">*</span>
              </label>
              <DatepickerWrapper {...props}>
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
              </DatepickerWrapper>
              <Error field="end" />
            </div>

            <div className="form-group">
              <label>
                Description <span className="error-msg">*</span>
              </label>
              <textarea
                value={values.desc}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                style={{ resize: "none" }}
                type="text"
                id="desc"
                className="form-control react-form-input"
                placeholder="Enter description"
              />
              <Error field="desc" />
            </div>
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
            <div className="form-group">
              <label>
                Recurring Event <span className="error-msg">*</span>
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

            <div className="flex-x align-center justify-content-end mt-3">
              <button
                disabled={!isValid}
                type="submit"
                className="btn btn-blue w-100 border-0 mr-1"
              >
                Submit
              </button>
              {action === "edit" && (
                <button
                  onClick={() => eventDeleteHandler(event)}
                  type="button"
                  className="btn btn-bordered w-100"
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
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
)(CustomerEventDialog);
