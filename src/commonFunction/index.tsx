import getApiData from "../shared/helpers/apiHelper";
import { toast } from "react-toastify";
import { isArray } from "lodash";

//API for receipt download
export const downloadReceipt = async function (
  transactionId: any,
  setDownloadLoad?: any,
  loadID?: any
) {
  if (loadID) {
    setDownloadLoad(transactionId);
  } else {
    setDownloadLoad(true);
  }

  try {
    const res = await getApiData(
      `donation/admin-receipt/${transactionId}`,
      {},
      "POST"
    );
    if (res.success) {
      setDownloadLoad(false);
      window.open(res.url, "_blank");
    } else {
      setDownloadLoad(false);
      toast.error(res.message);
    }
  } catch (error) {
    setDownloadLoad(false);
    toast.error("Something went wrong");
  }
};

//API For get country list
export const getCountryLists = async function (setCountryBank: any) {
  try {
    const res = await getApiData("currency/list?all=1", {}, "GET");
    if (res.success) {
      setCountryBank(isArray(res.data) ? res.data : []);
    } else {
      setCountryBank([]);
      toast.error(res.message);
    }
  } catch (error) {
    setCountryBank([]);
    toast.error("Something went wrong");
  }
};

//API For get notification badge counts
export const getBadgeCount = async function (
  dispatch,
  setBadgeCount,
  badgeCount
) {
  try {
    const res = await getApiData("notification/admin/badge-count", {}, "GET");
    if (res.success) {
      // let tempVal = flattenDeep([badgeCount, res?.data]);
      dispatch(setBadgeCount(res.data));
    } else {
      dispatch(setBadgeCount(badgeCount));
    }
  } catch (error) {
    console.log("🚀 ~ notification badge counts ~ err", error);
  }
};

//API For get help notification badge counts
export const getHelpBadgeCount = async function (
  dispatch,
  setHelpBadgeCount,
  helpBadgeCount
) {
  try {
    const res = await getApiData(
      "notification/admin/badge-count?help_request=1",
      {},
      "GET"
    );
    if (res.success) {
      // let tempVal = flattenDeep([helpBadgeCount, res?.data]);
      dispatch(setHelpBadgeCount(res.data));
    } else {
      dispatch(setHelpBadgeCount(helpBadgeCount));
    }
  } catch (error) {
    console.log("🚀 ~ notification badge counts ~ err", error);
  }
};

// get all category list
export const getCategoryList = async () => {
  try {
    const res = await getApiData(`category/list`, { allData: 1 }, "GET");
    if (res.success) {
      return res.data;
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
};
