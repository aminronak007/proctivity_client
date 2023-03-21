import React from "react";
import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import ProctivityLogo from "assets/images/proctivity_logo.svg";
import { useHistory } from "react-router-dom";

const SubscriptionExpireModal = props => {
  let history = useHistory();
  const { modal, setmodal } = props;

  return (
    <Modal isOpen={modal} backdrop={true}>
      <ModalHeader toggle={() => setmodal(!modal)}>
        Subscription Expired
      </ModalHeader>
      <ModalBody>
        <div className="row text-center py-2">
          <div className="col-12">
            <img src={ProctivityLogo} alt="logo" />
          </div>
          <div className="col-12 py-3 ">
            <h5>Your Subscription has been expired. Please subscribe now.</h5>
          </div>
        </div>

        <Button
          onClick={() => {
            history.push("/subscription");
            setmodal(false);
          }}
          className="btn c-primary btn-block"
        >
          Subscribe Now
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default SubscriptionExpireModal;
