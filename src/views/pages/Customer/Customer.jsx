import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import NavigationActions from "redux/navigation/actions";
import { compose } from "redux";
import AuthActions from "redux/auth/actions";
import { getCustomerList, UserList } from "services/customer/customerService";
import Pagination from "components/common/Pagination";
import { getGroups } from "services/groupsServices";
import CustomerListCard from "./CustomerListCard";
import { Plus } from "react-feather";

const { success, error, fetching } = NavigationActions;
const { setuser } = AuthActions;

const Customer = props => {
  const { token, success, error, fetching } = props;
  const [CustomerList, setCustomerList] = useState([]);
  const [refresh, toggleRefresh] = useState(false);
  const { group_id, status_id } = useParams();
  const [searchText, setSearchText] = useState("");
  const [groups_status, SetGroupState] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [groupOptions, setGroupOptions] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState("0");
  const [userOptions, setUserOptions] = useState([]);
  const pageLength = 5;
  const GetCustomers = e => {
    getCustomerList(token, {
      group_id: group_id,
      status_id: status_id,
      page: currentPage + 1,
      limit: pageLength,
      search: searchText
    }).then(data => {
      fetching();
      if (data.success) {
        setCustomerList(data.data.data);
        setTotalRecords(data.data.totalRecords);
        setTotalPage(Math.ceil(data.data.totalRecords / pageLength));
        toggleRefresh(false);
        success();
      } else {
        error(data.message);
      }
    });
  };

  const getGroupsData = async () => {
    await getGroups(token).then(data => {
      if (data.success) {
        setGroupOptions(data.data.map(x => ({ value: x.id, label: x.name })));
      } else {
        error(data.message);
      }
    });
  };

  const getUsersOption = async () => {
    await UserList(token).then(data => {
      if (data.success) {
        setUserOptions(
          data.data.map(x => ({ value: x.id, label: x.username }))
        );
      } else {
        error(data.message);
      }
    });
  };

  const handlePageChange = page => {
    fetching();
    setCurrentPage(page);
    toggleRefresh(true);
  };

  useEffect(() => {
    SetGroupState({
      group_id: group_id,
      status_id: status_id
    });
    toggleRefresh(true);
    getGroupsData();
    getUsersOption();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group_id, status_id]);

  useEffect(() => {
    refresh && GetCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <>
      <div className="container-fluid">
        <div className="row title-sec align-items-center">
          <div className="col-sm headline">Customer</div>
          <div className="col-sm-auto ml-auto">
            <div className="row justify-content-end">
              <div className="col-sm-auto">
                <input
                  value={searchText ? searchText : ""}
                  onChange={e => {
                    setSearchText(e.target.value);
                    toggleRefresh(true);
                  }}
                  type="text"
                  placeholder="Search.."
                  className="fs-14 medium-text plr-10 form-control field-sm react-form-input"
                />
              </div>

              <div className="col-sm-auto pl-sm-0">
                <Link to="/customer-entries/add" className="btn btn-blue">
                  <Plus className="mr-2" /> Open Entry
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="div-container">
          {CustomerList && CustomerList.length > 0 ? (
            CustomerList.map((row, index) => (
              <CustomerListCard
                key={`key_${index}`}
                row={row}
                groupOptions={groupOptions}
                toggleRefresh={e => toggleRefresh(e)}
                groups_status={groups_status}
                userOptions={userOptions}
                setCurrentPage={setCurrentPage}
              />
            ))
          ) : (
            <div className="text-center">
              <h6>No records found</h6>
            </div>
          )}

          <div className="sc-ifAKCX gPAtME">
            <div className="row align-items-center table-footer">
              <div className="col-sm-6 text-center text-sm-left">
                <span className="total-entry">
                  Showing{" "}
                  {totalRecords === 0 ? 0 : currentPage * pageLength + 1} to{" "}
                  {CustomerList.length < pageLength
                    ? totalRecords
                    : currentPage * pageLength + pageLength}{" "}
                  of {totalRecords} entries
                </span>
              </div>
              <div className="col-sm-6">
                <Pagination
                  onPageChange={handlePageChange}
                  pages={totalPage}
                  page={currentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    ...state.themeChanger,
    token: state.auth.accessToken,
    isFetching: state.navigation.isFetching
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { success, error, fetching, setuser })
)(Customer);
