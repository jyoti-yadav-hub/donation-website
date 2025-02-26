import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import getApiData from "../../shared/helpers/apiHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  init,
  onMessageListener,
  reqFCMToken,
  reqNotificationPermission,
} from "shared/helpers/firebase";
import { toast } from "react-toastify";
import { AppState } from "redux/store";
import { setNotification } from "redux/actions/Notificationdata";
import { setBadgeCount } from "redux/actions/BadgeCountData";
import { setHelpBadgeCount } from "redux/actions/HelpBadgeCountData";
import { setUserObj } from "redux/actions";
import { getBadgeCount, getHelpBadgeCount } from "commonFunction";

let tkn = "";

function Notification({ sToken }) {
  const dispatch = useDispatch();

  const { notiData } = useSelector<AppState, AppState["Notificationdata"]>(
    ({ Notificationdata }) => Notificationdata
  );

  const { badgeCount } = useSelector<AppState, AppState["BadgeCountData"]>(
    ({ BadgeCountData }) => BadgeCountData
  );

  const { helpBadgeCount } = useSelector<
    AppState,
    AppState["HelpBadgeCountData"]
  >(({ HelpBadgeCountData }) => HelpBadgeCountData);

  const { userData } = useSelector<AppState, AppState["AuthData"]>(
    ({ AuthData }) => AuthData
  );

  //API For get update profile
  async function getProfile() {
    try {
      const res = await getApiData(
        `admin/get-profile/${userData._id}`,
        {},
        "GET"
      );
      if (res.success) {
        dispatch(setUserObj(res?.data));
      } else {
        dispatch(setUserObj(userData));
      }
    } catch (error) {
      console.log("🚀 ~ getProfile ~ error", error);
    }
  }

  // useEffect(() => {
  //   window.addEventListener("focus", getBadgeCount);
  //   window.addEventListener("focus", getProfile);
  // }, []);

  async function setFCMToken(fcmToken) {
    try {
      await getApiData("admin/change-fcmToken", { token: fcmToken }, "post");
    } catch (err) {
      console.log("🚀 ~ setFCMToken ~ err", err);
    }
  }

  async function initFirebaseToken() {
    init();
    await reqNotificationPermission();
    const fcmToken = await reqFCMToken();
    console.log("🚀 ~ initFirebaseToken ~ fcmToken", fcmToken);
    if (fcmToken) setFCMToken(fcmToken);
  }

  useEffect(() => {
    if (sToken && sToken !== tkn) {
      initFirebaseToken();
      getBadgeCount(dispatch, setBadgeCount, badgeCount);
      getHelpBadgeCount(dispatch, setHelpBadgeCount, helpBadgeCount);
      getProfile();
      tkn = sToken;
    }
  }, [sToken]);

  useEffect(() => {
    if (!isEmpty(notiData)) {
      toast.info(notiData?.notification?.body || "");
      getBadgeCount(dispatch, setBadgeCount, badgeCount);
      getHelpBadgeCount(dispatch, setHelpBadgeCount, helpBadgeCount);
      getProfile();
      dispatch(setNotification({}));
    }
  }, [notiData]);

  onMessageListener()
    .then((payload) => {
      console.log("🚀 ~ file: index.js ~ line 58 ~ .then ~ payload", payload);
      dispatch(setNotification(payload));
    })
    .catch((err) => console.log("failed: ", err));

  return <> </>;
}

Notification.propTypes = {
  sToken: PropTypes.string,
};

Notification.defaultProps = {
  sToken: "",
};

export default Notification;
