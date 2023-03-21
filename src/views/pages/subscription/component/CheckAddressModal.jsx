import React, { Fragment } from "react";
import ProctivityLogo from "assets/images/proctivity_logo.svg";
import { Button, ModalHeader, ModalBody } from "reactstrap";
import { useHistory } from "react-router-dom";

const CheckAddressModal = props => {
  let history = useHistory();
  const { modal, setmodal } = props;
  return (
    <Fragment>
      <ModalHeader toggle={() => setmodal(!modal)}>
        Add Address Details
      </ModalHeader>
      <ModalBody>
        <div className="row text-center py-2">
          <div className="col-12">
            <img src={ProctivityLogo} alt="logo" />
          </div>
        </div>
        <div className="row text-center py-2">
          <div className="col-12 py-2">
            <h6>Please add address details.</h6>
          </div>
        </div>
        <Button
          onClick={() => history.push("/profile")}
          className="btn c-primary btn-block"
        >
          Add Address
        </Button>
      </ModalBody>
    </Fragment>
  );
};

export default CheckAddressModal;
