import React, { useState } from "react";
import { ModalBody, Button } from "reactstrap";
import DeleteIcon from "assets/images/delete.svg";
import Loader1 from "assets/images/Loaders/loader-1.svg";

const ConformationModalUser = props => {
  const [cancelBtnDisable, setCancelBtnDisable] = useState(false);
  const {
    onClose,
    confirmText,
    message,
    handleConfirm,
    customIcon,
    addLoader
  } = props;
  var confirmBtnText = confirmText || "Delete";

  return (
    <ModalBody className="confirm-modal">
      <div className="row">
        {addLoader ? (
          <>
            <div className="col-12 text-center">
              <img width={100} height={100} src={Loader1} alt="loader-1" />
            </div>
            <div className="col-12 text-center mt-1">
              <p>Please wait, while we process your request.</p>
            </div>
          </>
        ) : (
          <div className="col-12 text-center">
            {customIcon ? (
              <div className="mx-auto mb-4">
                <img width={80} height={80} src={customIcon} alt="logo" />
              </div>
            ) : (
              <div className="mx-auto my-2 mb-4 pb-2">
                <img width={100} height={100} src={DeleteIcon} alt="loader-1" />
              </div>
            )}
            <div className="col-12 text-center mb-4">
              <p className="loader-msg">{message}</p>
            </div>
          </div>
        )}

        <div className="col-6 text-center mt-4 pr-2">
          <Button
            onClick={() => {
              handleConfirm();
              setCancelBtnDisable(true);
            }}
            className="btn btn-blue w-100 border-0"
            type="button"
            disabled={addLoader}
          >
            {confirmBtnText}
          </Button>
        </div>
        <div className="col-6 text-center mt-4 pl-2">
          <Button
            onClick={() => onClose()}
            className="btn btn-blue w-100 btn-bordered"
            type="button"
            disabled={cancelBtnDisable}
          >
            Cancel
          </Button>
        </div>
      </div>
    </ModalBody>
  );
};
export default ConformationModalUser;
