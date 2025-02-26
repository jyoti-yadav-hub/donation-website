// import { Map } from 'immutable';

import moment from "moment";
import { isEmpty, isString, isObject, isArray } from "lodash";
import { fileTypes, sheetFTypes } from "./utilityData";
import axios from "axios";
import siteConfig from "config/site.config";

export function clearToken() {
  localStorage.removeItem("uToken");
  localStorage.removeItem("uData");
}

export function getToken() {
  try {
    const idToken = localStorage.getItem("uToken");
    return idToken;
  } catch (err) {
    clearToken();
    return "";
  }
}

export function checkCsv(file) {
  const fType = file && file.type ? file.type : "";
  const isExcelCsv = sheetFTypes.includes(fType);
  const isLt10M = file.size / 1024 / 1024 < 10;

  let message = "";
  let status = true;

  if (!isExcelCsv) {
    message = "You can upload only CSV file";
    status = false;
  } else if (!isLt10M) {
    message = "File must be smaller than 10MB!";
    status = false;
  }

  return { message, status };
}
export function getLanguage() {
  try {
    const language = localStorage.getItem("language");
    return language;
  } catch (err) {
    return "";
  }
}

export function getCountry() {
  try {
    const country = localStorage.getItem("country");
    const parsedCountry = country ? JSON.parse(country) : {};
    return parsedCountry;
  } catch (err) {
    return {};
  }
}
export function getUserData() {
  try {
    const userData = localStorage.getItem("uData");
    return userData;
  } catch (err) {
    clearToken();
    return {};
  }
}

export function arrayEqual(array1, array2) {
  return array1.sort().toString() == array2.sort().toString();
}

export function timeDifference(givenTime) {
  givenTime = new Date(givenTime);
  const milliseconds = new Date().getTime() - givenTime.getTime();
  const numberEnding = (number) => {
    return number > 1 ? "e" : "";
  };
  const number = (num) => (num > 9 ? `${num}` : `0${num}`);
  const getTime = () => {
    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
      const month = number(givenTime.getUTCMonth() + 1);
      const day = number(givenTime.getUTCDate());
      const year = givenTime.getUTCFullYear() % 100;
      return `${day}-${month}-${year}`;
    }
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      if (days < 28) {
        return `vor ${days} tag${numberEnding(days)}`;
      }
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = months[givenTime.getUTCMonth()];
      const day = number(givenTime.getUTCDate());
      return `${day} ${month}`;
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return `vor ${hours} stund${numberEnding(hours)}`;
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return `vor ${minutes} minute${numberEnding(minutes)}`;
    }
    return "vor ein paar Sekunden";
  };
  return getTime();
}

export function stringToInt(value, defValue = 0) {
  if (!value) {
    return 0;
  }
  if (!isNaN(value)) {
    return parseInt(value, 10);
  }
  return defValue;
}
export function stringToPosetiveInt(value, defValue = 0) {
  const val = stringToInt(value, defValue);
  return val > -1 ? val : defValue;
}

export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function getParsedJson(json) {
  if (isString(json) && !isEmpty(json)) return JSON.parse(json);
  return json;
}
export function getSlug(string, type) {
  if (!isEmpty(type)) {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace("&", "and")
      .replace(/[&_\/\\#,+()$~%.'":*?<>{}]/g, "-")
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace("&", "and")
    .replace(/[&_\/\\#,+()$~%.'":*?<>{}]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function getInputSlug(string, type) {
  if (!isEmpty(type)) {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace("&", "and")
      .replace(/[&_\/\\#,+()$~%.'":*?<>{}]/g, "_")
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "_")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace("&", "and")
    .replace(/[&_\/\\#,+()$~%.'":*<>{}]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "_")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/[?.]/g, "");
}

// Function for generating log text
export function getLogText(log, name = "Buyer") {
  let text = "";
  const sellerName = log.seller || "Seller";
  if (log.user_type === "seller") {
    if (log.log_type === "seller_view") {
      text = `${sellerName} view this job.`;
    } else if (log.log_type === "email_send") {
      text = `${sellerName} sended the mail.`;
    } else if (log.log_type === "sms_send") {
      text = `${sellerName} sended the SMS.`;
    } else if (log.log_type === "quick_response") {
      text = `${sellerName} sended the Quick Response.`;
    }
  } else if (log.user_type === "buyer") {
    if (log.log_type === "view") {
      text = `${name} viewd the profile of ${sellerName} .`;
    } else if (log.log_type === "quote") {
      text = `${name} requested ${sellerName} for Quote.`;
    } else if (log.log_type === "buyer_cancel") {
      text = `${name} Cancelled this job.`;
    }
  }
  return text;
}

// table log
export function getActivity(type) {
  let text = "";
  if (type === "view") {
    text = "Buyer viewd your profile";
  } else if (type === "seller_view") {
    text = "Seller viewd this job";
  } else if (type === "email_send") {
    text = "Seller contact the buyer via Email";
  } else if (type === "sms_send") {
    text = "Seller contact the buyer via SMS";
  } else if (type === "quick_response") {
    text = `Seller sended the Quick Response.`;
  }

  return text;
}

export function getHours() {
  const timesArr = [];
  for (let i = 0; i <= 24; i += 1) {
    if (i < 10) {
      timesArr.push({
        value: `0${i}:00`,
        label: `0${i}:00`,
      });
    } else if (i === 24) {
      timesArr.push({
        value: `23:59`,
        label: `23:59`,
      });
    } else {
      timesArr.push({
        value: `${i}:00`,
        label: `${i}:00`,
      });
    }
  }
  return timesArr;
}

export function disabledDate(current, type) {
  // if (type === 'today') {
  // Disable previous dates
  return current < moment().startOf("day");
  // }
  // Disable previous dates + today
  // return current && current < moment().endOf('day');
}

export function disableFutureData(current, type) {
  return current > moment().endOf("day");
}
export function getFullName(fname, lname) {
  if (fname && lname) return `${fname} ${lname}`;
  if (fname) return fname;
  return "";
}

export function dropdownFilter(input, option) {
  return option.props.children
    ? option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    : false;
}
export function countryFilter(input, option) {
  return (
    option.props.countryname.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
}

export function chatFilesVal(type) {
  const fTypes = isObject(fileTypes) ? fileTypes : {};
  if (fTypes[type]) {
    return true;
  }
  return false;
}

export function formatFileSize(bytes, decimalPoint = 2) {
  if (bytes == 0) return "0 Bytes";
  const k = 1000;
  const dm = decimalPoint || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function bookingDateFormat(nxtBooking = {}) {
  let dateTime = "-";
  const nextAppointment = isObject(nxtBooking) ? nxtBooking : {};
  const sTime = nextAppointment.sTime ? ` ${nextAppointment.sTime}` : "";
  if (!isEmpty(nextAppointment) && sTime) {
    const fmDate = `${nextAppointment.date}${sTime}`;
    dateTime = moment(fmDate).format("DD-MM-YYYY [um] hh:mm [Uhr]");
  }
  return dateTime;
}

/**
 * @function checkImage
 * @param {Object} file Check Image type and Sixe and return Message & Status
 *
 */
export function checkImage(file) {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  let message = "";
  let status = true;
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isJpgOrPng) {
    message = "You can only upload JPG/PNG/JPEG file!";
    status = false;
  } else if (!isLt2M) {
    message = "Image must smaller than 2MB!";
    status = false;
  }

  return { message, status };
}

/**
 * @function checkSvgImage
 * @param {Object} file Check Image type and Sixe and return Message & Status
 *
 */
export function checkSvgImage(file) {
  const isJpgOrPng = file.type === "image/svg+xml" || file.type === "image/svg";
  let message = "";
  let status = true;
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isJpgOrPng) {
    message = "You can only upload SVG file!";
    status = false;
  } else if (!isLt2M) {
    message = "Image must smaller than 2MB!";
    status = false;
  }
  return { message, status };
}

export function fixAutocomplete() {
  if (document) {
    document.querySelectorAll("input").forEach((e) => {
      // you can put any value but NOT "off" or "false" because they DO NOT works
      e.setAttribute("autocomplete", "stopAutocomplete");
    });
  }
}

export function getCordZip(res) {
  if (isObject(res) && !isEmpty(res)) {
    const coordinates =
      res && isObject(res.location) && isArray(res.location.coordinates)
        ? res.location.coordinates
        : [];
    let location = {};
    if (!isEmpty(coordinates)) {
      location = {
        lat: coordinates[0],
        lng: coordinates[1],
      };
    }
    return location;
  }
  return {};
}

/**
 * @function getSortOrder
 * @param {string} order Return type of for sorting for API
 *
 */
export function getSortOrder(order) {
  if (order === "ascend") {
    return "ASC";
  }
  if (order === "descend") {
    return "DESC";
  }
  return order;
}

/**
 * Return Allowed Permission to User as Array
 * @function getPermissionArray
 * @param {object} data It is UserData which is saved in Redux at the Login time
 *
 */
export function getPermissionArray(data) {
  let permAray = [];
  if (!isEmpty(data) && !isEmpty(data.permissions)) {
    permAray = data.permissions.split("|");
  }
  return permAray;
}
/**
 * Return Static Permission array
 * While creating New Admin
 * @function displayPermissionList
 *
 */
export function displayPermissionList() {
  return [
    "admin_view",
    "admin_add",
    "admin_edit",
    "admin_delete",
    "adminlog_view",
    "adminlog_add",
    "adminlog_edit",
    "adminlog_delete",
    "emailtemplate_view",
    "emailtemplate_add",
    "emailtemplate_edit",
    "emailtemplate_delete",
    "user_view",
    "user_add",
    "user_edit",
    "user_delete",
    "solicitor_view",
    "solicitor_add",
    "solicitor_edit",
    "solicitor_delete",
    "office_view",
    "office_add",
    "office_edit",
    "office_delete",
    "review_view",
    "review_add",
    "review_edit",
    "review_delete",
    "reviewanswer_view",
    "reviewanswer_add",
    "reviewanswer_edit",
    "reviewanswer_delete",
    "claim_view",
    "claim_add",
    "claim_edit",
    "claim_delete",
    "achievement_view",
    "achievement_add",
    "achievement_edit",
    "achievement_delete",
    "solicitorachievement_view",
    "solicitorachievement_add",
    "solicitorachievement_edit",
    "solicitorachievement_delete",
    "award_view",
    "award_add",
    "award_edit",
    "award_delete",
    "plan_view",
    "plan_add",
    "plan_edit",
    "plan_delete",
    "planoption_view",
    "planoption_add",
    "planoption_edit",
    "planoption_delete",
    "agreement_view",
    "agreement_add",
    "agreement_edit",
    "agreement_delete",
    "transaction_view",
    "transaction_add",
    "transaction_edit",
    "transaction_delete",
    "webhook_view",
    "webhook_add",
    "webhook_edit",
    "webhook_delete",
    "country_view",
    "country_add",
    "country_edit",
    "country_delete",
    "county_view",
    "county_add",
    "county_edit",
    "county_delete",
    "city_view",
    "city_add",
    "city_edit",
    "city_delete",
    "question_view",
    "question_add",
    "question_edit",
    "question_delete",
    "answer_view",
    "answer_add",
    "answer_edit",
    "answer_delete",
    "law_view",
    "law_add",
    "law_edit",
    "law_delete",
    "citylaw_view",
    "citylaw_add",
    "citylaw_edit",
    "citylaw_delete",
    "guide_view",
    "guide_add",
    "guide_edit",
    "guide_delete",
    "offer_view",
    "offer_add",
    "offer_edit",
    "offer_delete",
    "tag_view",
    "tag_add",
    "tag_edit",
    "tag_delete",
    "page_view",
    "page_add",
    "page_edit",
    "page_delete",
    "referrer_view",
    "referrer_add",
    "referrer_edit",
    "referrer_delete",
    "campaign_view",
    "campaign_add",
    "campaign_edit",
    "campaign_delete",
    "settings_view",
    "settings_add",
    "settings_edit",
    "settings_delete",
    "settingsgroup_view",
    "settingsgroup_add",
    "settingsgroup_edit",
    "settingsgroup_delete",
  ];
}
export function priorityArray() {
  return [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
}

export function colorArray() {
  return [
    { name: "A", Color: "#1abc9c" },
    { name: "B", Color: "#f56a00" },
    { name: "C", Color: "#c0392b" },
    { name: "D", Color: "#3498db" },
    { name: "E", Color: "#9b59b6" },
    { name: "F", Color: "#34495e" },
    { name: "G", Color: "#16a085" },
    { name: "H", Color: "rgba(63, 81, 181,1.0)" },
    { name: "I", Color: "#2980b9" },
    { name: "J", Color: "#8e44ad" },
    { name: "K", Color: "#2c3e50" },
    { name: "L", Color: "#f1c40f" },
    { name: "F", Color: "#e74c3c" },
    { name: "M", Color: "#f39c12" },
    { name: "N", Color: "#273c75" },
    { name: "O", Color: "#c0392b" },
    { name: "P", Color: "#f39c12" },
    { name: "Q", Color: "#7265e6" },
    { name: "R", Color: "#00a8ff" },
    { name: "S", Color: "#e1b12c" },
    { name: "T", Color: "#689F38" },
    { name: "U", Color: "#353b48" },
    { name: "V", Color: "#dcdde1" },
    { name: "W", Color: "#c23616" },
    { name: "X", Color: "#00a8ff" },
    { name: "Y", Color: "#4cd137" },
    { name: "Z", Color: "#9c88ff" },
  ];
}

export function positionArray() {
  return [
    { id: "Partner", name: "Partner" },
    { id: "Solicitor", name: "Solicitor" },
    { id: "Barrister", name: "Barrister" },
    { id: "Chartered Legal Executive", name: "Chartered Legal Executive" },
    { id: "Paralegal", name: "Paralegal" },
    { id: "Licensed Conveyancer", name: "Licensed Conveyancer" },
    { id: "Mediator", name: "Mediator" },
    { id: "Litigation Executive", name: "Litigation Executive" },
  ];
}

export function daysArray() {
  return [
    {
      day: "Monday",
      start: "09:00",
      end: "18:00",
    },
    {
      day: "Tuesday",
      start: "09:00",
      end: "18:00",
    },
    {
      day: "Wednesday",
      start: "09:00",
      end: "18:00",
    },
    {
      day: "Thursday",
      start: "09:00",
      end: "18:00",
    },
    {
      day: "Friday",
      start: "09:00",
      end: "18:00",
    },
    {
      day: "Saturday",
      start: "09:00",
      end: "18:00",
    },
    {
      day: "Sunday",
      start: "Closed",
      end: "Closed",
    },
  ];
}

export function apiCallWithFile(url, formData = {}, methodParm = "GET") {
  return new Promise(async (resolve, reject) => {
    try {
      const token = localStorage.getItem("uToken");
      let response = {};

      if (methodParm.toLowerCase() === "post") {
        response = await axios.post(`${siteConfig.apiUrl}${url}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } else if (methodParm.toLowerCase() === "put") {
        response = await axios.put(`${siteConfig.apiUrl}${url}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        // do for another method
      }

      let errorMessageText = "";
      if (response.status === 201) {
        if (response.data && response.data.success) {
          let message = response.data.message ? response.data.message : "";
          resolve({
            status: true,
            data: response.data.data
              ? response.data.data
              : response.data
              ? response.data
              : {},
            message,
          });
        } else {
          errorMessageText = response.data.message
            ? response.data.message
            : "Someting went wrong.";
        }
      } else if (response.status === 200) {
        if (response.data && response.data.success) {
          let message = response.data.message ? response.data.message : "";
          resolve({
            status: true,
            data: response.data.data
              ? response.data.data
              : response.data
              ? response.data
              : {},
            message,
          });
        } else {
          errorMessageText = response.data.message
            ? response.data.message
            : "Someting went wrong.";
        }
      } else {
        errorMessageText = response.message
          ? response.message
          : "Someting went wrong.";
      }
      resolve({
        status: false,
        message: errorMessageText,
      });
    } catch (error) {
      reject({
        status: false,
        error,
        message: error.message ? error.message : "Something went wrong",
      });
    }
  });
}
