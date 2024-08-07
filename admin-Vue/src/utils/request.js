import axios from "axios";
import { Notification, MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,

  timeout: 10000,
});

service.interceptors.request.use(
  (config) => {
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers["token"] = getToken();
    }

    if (config.method === "get" && config.params) {
      let url = config.url + "?";
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof value !== "undefined") {
          if (typeof value === "object") {
            for (const key of Object.keys(value)) {
              if (value[key] !== null && typeof value[key] !== "undefined") {
                const params = propName + "[" + key + "]";
                const subPart = encodeURIComponent(params) + "=";
                url += subPart + encodeURIComponent(value[key]) + "&";
              }
            }
          } else {
            url += part + encodeURIComponent(value) + "&";
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (res) => {
    const code = res.data.code || 200;
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    if (code === 401) {
      MessageBox.confirm(
        "Session expired, you can cancel to stay on this page, or log in again",
        "System Message",
        {
          confirmButtonText: "Login again",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          store.dispatch("FedLogOut").then(() => {
            location.href = "/index";
          });
        })
        .catch(() => {});
      return Promise.reject("Unauthorized");
    } else if (code === 500) {
      Message({
        message: msg,
        type: "error",
      });
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      Notification.error({
        title: msg,
      });
      return Promise.reject("error");
    } else {
      if (res.data.data && res.data.data.total) {
        res.data.data.total = parseInt(res.data.data.total);
      }
      return res.data.data;
    }
  },
  (error) => {
    console.log("err" + error);
    let { message } = error;
    if (message === "Network Error") {
      message = "Network Error";
    } else if (message.includes("timeout")) {
      message = "System request timed out";
    } else if (message.includes("failed with status code 500")) {
      message = "System Error";
    } else if (message.includes("400")) {
      message = "Request error";
    } else if (message.includes("405")) {
      message = "Request method error";
    } else if (message.includes("401")) {
      message = "Unauthorized, please log in again";
    } else if (message.includes("Request failed with status code")) {
      message = "Please check the backend error codes for more details";
    }
    Message({
      message: message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
