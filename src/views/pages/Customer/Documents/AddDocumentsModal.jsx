import React, { useState } from "react";
import NavigationActions from "redux/navigation/actions";
import enhancer from "./enhancer/DocsEnhancer";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import AuthActions from "redux/auth/actions";
import { ModalHeader, ModalBody, Button } from "reactstrap";
import { uploadDocs } from "services/customer/documents/customerDocsService";
import { useParams } from "react-router-dom";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const AddDocumentsModal = props => {
  const {
    token,
    success,
    error,
    onClose,
    handleSubmit,
    isValid,
    handleBlur,
    errors,
    touched,
    submitCount,
    toggleRefresh,
    setFieldValue,
    user
  } = props;
  const [addLoader, setAddLoader] = useState(false);
  const { id } = useParams();
  const [files, setFiles] = useState([]);

  const [errMsg, setError] = useState(false);

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

  const handleDocsSubmit = async e => {
    e.preventDefault();
    handleSubmit();
    if (isValid) {
      setAddLoader(true);
      let data = new FormData();
      data.append("customer_id", id);
      data.append("user_id", user.id);
      for (let i = 0; i < files.length; i++) {
        data.append("customer_docs", files[i]);
      }
      uploadDocs(token, data).then(data => {
        if (data.success) {
          success(data.message);
          onClose();
          toggleRefresh(true);
          setAddLoader(false);
        } else {
          error(data.message);
          setError(true);
          setAddLoader(false);
        }
      });
    }
  };

  return (
    <>
      <ModalHeader toggle={() => onClose()}>Add Documents</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>
            Select Files <span className="error-msg">*</span>
          </label>
          <input
            type="file"
            className="form-control react-form-input"
            name="customer_docs"
            id="customer_docs"
            onBlur={handleBlur}
            accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.webp,.gif,.png"
            onChange={e => {
              setError(false);
              if (e.target.files.length > 0) {
                var fileArr = Array.from(e.target.files);

                var fileSize = true;
                for (var i = 0; i < fileArr.length; i++) {
                  var numb = fileArr[i].size / 1024 / 1024;
                  numb = numb.toFixed(2);
                  if (numb > 10) {
                    error(
                      "Maximum filesize is 10 mb. Your file size is: " +
                        numb +
                        " MiB"
                    );
                    fileSize = false;
                    break;
                  }
                  // if (
                  //   ![
                  //     "jpg",
                  //     "jpeg",
                  //     "png",
                  //     "webp",
                  //     "gif",
                  //     "pdf",
                  //     "doc",
                  //     "docx",
                  //     "csv",
                  //   ].includes(fileArr[i].name.split(".").pop())
                  // ) {
                  //   fileSize = false;
                  //   setFiles([]);
                  //   setError("Please select a valid file type.");
                  //   setFieldValue("customer_docs", []);

                  //   break;
                  // }
                }

                if (fileSize) {
                  // handleChange(e);
                  setFiles(fileArr);
                  setFieldValue("customer_docs", fileArr);
                } else {
                  setFieldValue("customer_docs", []);
                }
              }
            }}
            multiple
          />
          <span className="small text-muted d-block">
            Only allowed .jpg, .jpeg, .png, .gif, .webp, .pdf, .doc, .docx, .csv
          </span>
          {errMsg ? (
            <span className="error-msg d-block">
              Please select a valid file type.
            </span>
          ) : (
            ""
          )}

          <Error field="customer_docs" />
        </div>

        <Button
          onClick={e => handleDocsSubmit(e)}
          className="btn btn-blue w-100 border-0"
          type="button"
          disabled={addLoader}
        >
          Upload
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
)(AddDocumentsModal);
