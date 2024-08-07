import axios from "axios";
import { Message } from "element-ui";
import { getToken } from "@/utils/auth";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
const downloadService = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  responseType: "blob",
});

downloadService.interceptors.request.use(
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

downloadService.interceptors.response.use(
  (res) => {
    console.log(res);
    if (!res.data) {
      return;
    }
    var blob = new Blob([res.data]);
    const contentDisposition = res.headers["content-disposition"];
    var fileName = "test";
    if (contentDisposition) {
      fileName = window.decodeURI(
        res.headers["content-disposition"].split("=")[1],
        "UTF-8"
      );
    }
    var url = window.URL.createObjectURL(blob);
    var aLink = document.createElement("a");
    aLink.style.display = "none";
    aLink.href = url;
    aLink.setAttribute("download", fileName);
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
    window.URL.revokeObjectURL(url);
  },
  (error) => {
    console.log("err" + error);
    let { message } = error;
    if (message === "Network Error") {
      message = "Backend system is not running";
    } else if (message.includes("timeout")) {
      message = "System request timed out";
    } else if (message.includes("Request failed with status code")) {
      message = "System" + "Error" + message.substr(message.length - 3);
    }
    Message({
      message: message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default downloadService;
