import { toast } from "react-toastify";
import { GetGroupStatusHirarchy } from "services/groupsServices";

const navigationAction = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  CLOSE: "CLOSE",
  FETCHING: "FETCHING",
  ONETIMEMODAL: "ONETIMEMODAL",
  TOGGLEMODAL: "TOGGLEMODAL",
  TOGGLETAB: "TOGGLETAB",
  GROUPSTATUSDATA: "GROUPSTATUSDATA",
  SUBSCRIPTIONSUCCESS: "SUBSCRIPTIONSUCCESS",

  success: messages => {
    messages !== "" &&
      toast.success(messages, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    return {
      type: navigationAction.SUCCESS,
      resType: "success",
      message: messages,
      show: true,
      isFetching: false
    };
  },
  error: messages => {
    messages !== "" &&
      toast.error(messages, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    return {
      type: navigationAction.ERROR,
      resType: "error",
      message: messages,
      show: true,
      isFetching: false
    };
  },
  close: () => {
    return {
      type: navigationAction.CLOSE,
      show: false,
      isFetching: false
    };
  },
  fetching: () => ({
    type: navigationAction.FETCHING,
    isFetching: true
  }),

  toggleSubscriptionLoader: value => {
    return {
      type: navigationAction.SUBSCRIPTIONSUCCESS,
      isSubscriptionSuccess: value
    };
  },

  toggleSubscribeModal: value => {
    return {
      type: navigationAction.TOGGLEMODAL,
      subscription: value
    };
  },

  toggleOneTimeModal: value => {
    return {
      type: navigationAction.ONETIMEMODAL,
      oneTimeModal: value
    };
  },
  getGroupStatusData: token => async dispatch => {
    try {
      var sideBarData = [];
      await GetGroupStatusHirarchy(token).then(data => {
        if (data.success) {
          sideBarData = data.data;
          return dispatch({
            type: navigationAction.GROUPSTATUSDATA,
            workflowData: sideBarData
          });
        } else {
          return dispatch({
            type: navigationAction.GROUPSTATUSDATA,
            workflowData: sideBarData
          });
        }
      });
    } catch (err) {
      return dispatch({
        type: navigationAction.GROUPSTATUSDATA,
        workflowData: sideBarData
      });
    }
  }
};
// export const

export default navigationAction;
