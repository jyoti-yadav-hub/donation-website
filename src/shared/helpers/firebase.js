import { getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import localforage from "localforage";
import {
  firebaseConfig,
  firebase as firebaseInfo,
} from "@crema/services/auth/firebase/firebase";
import { Config } from "config";
// checking whether token is available in indexed DB
const tokenInlocalforage = async () => localforage.getItem("fcm_token");

// How to find vapidKey [https://stackoverflow.com/questions/54996206/firebase-cloud-messaging-where-to-find-public-vapid-key]
const vapidKey = Config?.fireBasevapidKey;

export const reqNotificationPermission = async () => {
  try {
    await Notification.requestPermission();
  } catch (err) {
    console.log("🚀 ~requestPermission ~ err", err);
  }
};

export const init = async () => {
  try {
    if (getApps().length === 0) {
      initializeApp(firebaseConfig);
    }
  } catch (error) {
    console.log(error);
  }
};

export const reqFCMToken = async () => {
  try {
    const messaging = getMessaging();
    const tokenInLocalForage = await tokenInlocalforage();
    // if FCM token is already there just return the token
    if (tokenInLocalForage !== null) {
      return tokenInLocalForage;
    }
    // requesting notification permission from browser
    const status = await Notification.requestPermission();
    if (status && status === "granted") {
      await navigator.serviceWorker.getRegistration(
        "/firebase-messaging-sw.js"
      );
      // getting token from FCM
      const fcmToken = await getToken(messaging, {
        vapidKey,
      });
      if (fcmToken) {
        // setting FCM token in indexed db using localforage
        localforage.setItem("fcm_token", fcmToken);
        // return the FCM token after saving it
        return fcmToken;
      }
    }
  } catch (error) {
    console.log(error);
    return null;
  }
  return null;
};

export const onMessageListener = () => {
  if (getApps().length > 0) {
    try {
      const messaging = getMessaging();
      return new Promise((resolve) => {
        onMessage(messaging, (payload) => resolve(payload));
      });
    } catch (err) {
      console.log("🚀 ~ onMessageListener ~ err", err);
    }
  }

  return new Promise(() => {});
};
