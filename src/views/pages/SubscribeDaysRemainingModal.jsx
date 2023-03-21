import React from "react";
import { ModalHeader, ModalBody } from "reactstrap";
import ProctivityLogo from "assets/images/proctivity_logo.svg";

const SubscribeDaysRemainingModal = props => {
  const { user, toggleModal } = props;

  return (
    <>
      <ModalHeader toggle={toggleModal}>Subscription Plan</ModalHeader>
      <ModalBody>
        <div className="row text-center py-2">
          <div className="col-12">
            <img src={ProctivityLogo} alt="logo" />
          </div>
          <div className="col-12 py-3">
            {user && Object.keys(user?.package).length === 0 ? (
              <p>
                You are not subscribed to any plan
                <strong> Subscribe Now</strong>
              </p>
            ) : user?.package?.expired ? (
              <p>
                Your package has been
                <strong> expired</strong>
              </p>
            ) : user?.package?.package_type === "Trial" ||
              (user?.package?.package_type !== "Trial" &&
                user.package?.difference_in_days <= 5) ? (
              <h4 className="mt-3">
                <strong>{user.package.difference_in_days}</strong>
                {` days remaining of your`} <strong>{user.package.name}</strong>
              </h4>
            ) : (
              <></>
            )}
          </div>
        </div>
      </ModalBody>
    </>
  );
};

export default SubscribeDaysRemainingModal;
