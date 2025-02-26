/* eslint-disable import/no-anonymous-default-export */
const prod = process.env.NODE_ENV === "development";


export default {
  siteName: "React",
  siteIcon: "ion-flash",
  footerText: `© ${new Date().getFullYear()} test`,

  apiUrl: prod
    ? "http://localhost:8082/api/"
    : "http://20.172.158.73:8080/api/", 
  siteUrl: "",
  csvUrl: "",
  domainUrl: prod ? "" : "http://localhost:3000",
  sailsUrl: "http://localhost:33969/",

  mapAPI: "kkkk",
  mapKey: "kkkk", // For Direction
  GOOGLE_PLACE_API_KEY: "kkkk", // For auto complete
  fireBasevapidKey:
    "kkkk",

  google: {
    analyticsKey: "UA-xxxxxxxxx-1",
  },
  tinyEditorKey: "",
  dashboard: "/dashboard",
};
