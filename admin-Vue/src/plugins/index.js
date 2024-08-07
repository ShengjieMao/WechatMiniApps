import auth from "./auth";
import cache from "./cache";
import modal from "./modal";

export default {
  install(Vue) {
    Vue.prototype.$auth = auth;
    Vue.prototype.$cache = cache;
    Vue.prototype.$modal = modal;
  },
};
