import React, { useEffect, useState } from "react";
import enhancer from "./enhancer/GroupsEnhancer";
import NavigationActions from "redux/navigation/actions";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button, Card, CardBody } from "reactstrap";
import { addGroupAndStatus, updateGroup } from "services/groupsServices";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AlignJustify, Minus, Plus } from "react-feather";

// import { changePassword } from "services/userServices";

const { success, error, fetching, getGroupStatusData } = NavigationActions;
const { setuser } = AuthActions;

const GroupsAddModal = props => {
  const {
    token,
    success,
    error,
    errors,
    touched,
    submitCount,
    isEdit,
    onClose,
    values,
    handleChange,
    handleSubmit,
    setValues,
    isValid,
    handleBlur,
    getGroupStatusData,
    toggleRefresh,
    editData
  } = props;

  // const [selectedStatus, setSelectedStatus] = useState([]);
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

  const StatusError = props => {
    const field1 = props.field;
    const index = props.index;
    if (
      (errors &&
        errors.hasOwnProperty("status") &&
        errors?.status[index] &&
        errors?.status[index][field1] &&
        touched &&
        touched.hasOwnProperty("status") &&
        touched?.status[index] &&
        touched?.status[index][field1]) ||
      submitCount > 0
    ) {
      return (
        <span className={props.class ? props.class : "error-msg"}>
          {errors &&
            errors.hasOwnProperty("status") &&
            errors?.status[index] &&
            errors?.status[index][field1]}
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

      isEdit
        ? updateGroup(token, values).then(data => {
            if (data.success) {
              success(data.message);
              onClose();
              toggleRefresh(true);
              setAddLoader(false);
              getGroupStatusData(token);
            } else {
              error(data.message);
              setAddLoader(false);
            }
          })
        : addGroupAndStatus(token, values).then(data => {
            if (data.success) {
              success(data.message);
              toggleRefresh(true);
              setAddLoader(false);
              getGroupStatusData(token);
              onClose();
            } else {
              error(data.message);
              setAddLoader(false);
            }
          });
    }
  };

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const quotes = reorder(
      values.status,
      result.source.index,
      result.destination.index
    );

    values.status = quotes.map((x, i) => ({ ...x, position: i + 1 }));
    setValues(values);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  useEffect(() => {
    if (isEdit) {
      setValues({ ...editData, deleted_status: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  return (
    <>
      <ModalHeader toggle={() => onClose()}>
        {`${isEdit ? "Update" : "Add"} Group`}
      </ModalHeader>
      <ModalBody>
        <Card className="mb-4">
          <CardBody className="pb-0">
            <div className="form-group">
              <label>
                Group Name <span className="error-msg">*</span>
              </label>
              <input
                type="text"
                className="form-control react-form-input"
                placeholder="Group Name"
                id={`name`}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
              />
              <Error field={`name`} />
            </div>
            <div className="form-group">
              <label className="d-flex align-items-center mb-2">
                Status <span className="error-msg">*</span>
                <button
                  className="btn btn-link add-status-circle"
                  type="button"
                  style={{
                    borderLeft: "0px",
                    borderBottomLeftRadius: "0px",
                    borderTopLeftRadius: "0px"
                  }}
                  onClick={() => {
                    values.status.push({
                      position: values.status.length + 1,
                      name: ""
                    });
                    setValues(values);
                  }}
                >
                  <Plus />
                </button>
              </label>
              <DragDropContext onDragEnd={result => onDragEnd(result)}>
                <Droppable droppableId="list">
                  {provided => (
                    <div
                      className="p-1 border"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {values.status !== undefined &&
                        values.status.map((s, k) => (
                          <Draggable
                            draggableId={s.position}
                            index={k}
                            key={`k_${k}`}
                          >
                            {provided => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="row align-base">
                                  <div className="col-1">
                                    <AlignJustify />
                                  </div>
                                  <div className="col-11">
                                    <div className="input-group my-1">
                                      <input
                                        type="text"
                                        className="form-control react-form-input"
                                        placeholder="Status Name"
                                        id={`status[${k}].name`}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={s.name}
                                      />
                                      <div className="input-group-append">
                                        <button
                                          className="btn btn-link react-form-input"
                                          type="button"
                                          disabled={values.status.length <= 1}
                                          style={{
                                            borderLeft: "0px",
                                            borderBottomLeftRadius: "0px",
                                            borderTopLeftRadius: "0px"
                                          }}
                                          onClick={() => {
                                            if (isEdit) {
                                              values.deleted_status.push(
                                                values.status[k].id
                                              );
                                            }
                                            values.status.splice(k, 1);
                                            setValues(values);
                                          }}
                                        >
                                          <Minus />
                                        </button>
                                      </div>
                                    </div>
                                    <StatusError field="name" index={k} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <Error field={`statusName`} />
            </div>
          </CardBody>
        </Card>
        {/* <button
                    className="btn btn-link "
                    type="button"
                    style={{
                        borderLeft: "0px",
                        borderBottomLeftRadius: "0px",
                        borderTopLeftRadius: "0px",
                    }}
                    onClick={() => {
                        values.groups.push({
                            name: "",
                            id: "",
                            status: [{ id: 1, name: "" }],
                        });
                        setValues(values);
                    }}
                >
                    <i className={`fa fa-plus`}></i>
                // </button> */}
        {/* // {values.groups?.map((x, i) => { */}
        {/* //     console.log(values.groups); */}
        {/* return (
                        
                    ); */}
        {/* // })} */}

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
  connect(mapStateToProps, {
    success,
    error,
    fetching,
    setuser,
    getGroupStatusData
  })
)(GroupsAddModal);
