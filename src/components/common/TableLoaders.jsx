import React from "react";
import LoaderSvg from "assets/images/Loaders/loader-2.svg";

const TableLoader = props => {
  let colspan = props.colspan;
  return (
    <tr>
      <td colSpan={colspan} className="border-bottom-0 text-center">
        <img src={LoaderSvg} alt="loader" className="loader-img" />
      </td>
    </tr>
  );
};

export default TableLoader;
