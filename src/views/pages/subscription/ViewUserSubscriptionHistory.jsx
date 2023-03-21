import React from "react";
import classNames from "classnames";
import moment from "moment";

const ViewUserPackageDetails = props => {
  const { userSubscriptionHistory } = props;

  const column = [
    {
      column: "Package Name",
      index: "name"
    },
    {
      column: "Package Type",
      index: "package_type"
    },
    {
      column: "Package Price",
      index: "package_price"
    },
    {
      column: "Payment Type",
      index: "payment_type"
    },
    {
      column: "Date",
      index: "created_at"
    }
  ];

  return (
    <div>
      <h4 className="box-title">User Subscription History</h4>
      <div className="table-responsive">
        <table className={classNames("table")}>
          <thead className={"thead-dark"}>
            <tr>
              {column &&
                column.map((e, i) => {
                  return <th key={i}>{e.column}</th>;
                })}
            </tr>
          </thead>
          <tbody>
            {userSubscriptionHistory &&
              userSubscriptionHistory.map((e, i) => {
                return (
                  <tr key={i}>
                    <td>
                      {e.name} {e.reference === "User" ? "(User)" : ""}
                    </td>
                    <td>{e.package_type}</td>
                    <td>
                      {e.package_price === "0.00"
                        ? "Free"
                        : `$ ${e.package_price}`}
                    </td>
                    <td className="text-capitalize">{e.payment_type}</td>
                    <td>{moment(e.created_at).format("DD-MM-YYYY")}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewUserPackageDetails;
