import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/NotesEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button } from "reactstrap";
import {
  addNotes,
  updateNotes
} from "services/customer/notes/customerNotesService";
import { useParams } from "react-router-dom";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const NotesAddModal = props => {
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
    editData,
    user
  } = props;

  const [addLoader, setAddLoader] = useState(false);
  const { id } = useParams();

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

  const handleFeaturSubmit = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      setAddLoader(true);
      var notesData = {
        ...values,
        customer_id: id,
        username: user.username,
        notes: values.notes
      };
      isEdit
        ? updateNotes(token, values.id, notesData).then(data => {
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
        : addNotes(token, notesData).then(data => {
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

  useEffect(() => {
    if (isEdit) {
      setValues({
        ...editData
      });
    } else {
      setValues({
        ...values,
        customer_id: id,
        user_id: user.id
      });
    }
    // eslint-disable-next-line
  }, [editData]);

  return (
    <>
      <ModalHeader toggle={() => onClose()}>
        {`${isEdit ? "Update" : "Add"} Notes`}
      </ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>
            Notes <span className="error-msg">*</span>
          </label>
          <textarea
            type="text"
            className="form-control react-form-input"
            placeholder="Write your notes here"
            id="notes"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.notes}
          />
          <Error field="notes" />
        </div>

        <Button
          className="btn btn-blue w-100 border-0"
          onClick={e => handleFeaturSubmit(e)}
          type="button"
          disabled={addLoader}
        >
          {isEdit ? "Update" : "Add"}
        </Button>
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
)(NotesAddModal);
