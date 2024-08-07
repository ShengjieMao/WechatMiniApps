﻿import { constantRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import InnerLink from "@/layout/components/InnerLink";

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes);
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      const index = [
        {
          path: "index",
          meta: { title: "Dashboard", icon: "dashboard" },
        },
      ];
      state.topbarRouters = routes.concat(index);
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes;
    },
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        getRouters().then((res) => {
          const routers = buildRouterTree(res.menus);
          const sdata = JSON.parse(JSON.stringify(routers));
          const rdata = JSON.parse(JSON.stringify(routers));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          rewriteRoutes.push({ path: "*", redirect: "/404", hidden: true });
          commit("SET_ROUTES", rewriteRoutes);
          commit("SET_SIDEBAR_ROUTERS", constantRoutes.concat(sidebarRoutes));
          commit("SET_DEFAULT_ROUTES", sidebarRoutes);
          commit("SET_TOPBAR_ROUTES", sidebarRoutes);
          resolve(rewriteRoutes);
        });
      });
    },
  },
};
function buildRouterTree(menus) {
  var routers = [];
  for (var i = 0; i < menus.length; i++) {
    var menu = menus[i];
    var router = {};
    router.hidden = menu.visible === "1";
    router.name = getRouterName(menu);
    router.path = getRouterPath(menu);
    router.component = getComponent(menu);
    router.meta = getComponentMeta(menu);

    var cMenus = menu.children;
    if (cMenus && cMenus.length > 0 && menu.menuType === "M") {
      router.alwaysShow = true;
      router.redirect = "noRedirect";
      router.children = buildRouterTree(cMenus);
    } else if (isMenuFrame(menu)) {
      router.meta = null;
      const childrenRouterList = [];
      const children = {};
      children.path = menu.path;
      children.component = menu.component;
      children.name = getRouterName(menu);
      children.meta = getComponentMeta(menu);
      childrenRouterList.push(children);
      router.children = childrenRouterList;
    } else if (menu.parentId === "0") {
      router.meta = { title: menu.menuName, icon: menu.icon };
      router.path = "/inner";
      const childrenRouterList = [];
      const children = {};
      var routerPath = menu.path.replace("http://", "");
      routerPath.replace("https://", "");
      children.path = routerPath;
      children.component = "InnerLink";
      children.name = getRouterName(menu);
      children.meta = getComponentMeta(menu);
      childrenRouterList.psuh(children);
      router.children = childrenRouterList;
    }

    routers.push(router);
  }
  return routers;
}

function getComponentMeta(menu) {
  var meta = {};
  meta.title = menu.menuName;
  meta.icon = menu.icon;
  meta.link = menu.link;
  return meta;
}

function getComponent(menu) {
  if (menu.component && !isMenuFrame(menu)) {
    return menu.component;
  }
  if (!menu.component && menu.parentId !== "0") {
    return "InnerLink";
  }
  return "Layout";
}

function getRouterPath(menu) {
  if (menu.parentId === "0" && menu.menuType === "M") {
    return "/" + menu.path;
  }
  if (isMenuFrame(menu)) {
    return "/";
  }
  return menu.path;
}
function isMenuFrame(menu) {
  return menu.parentId === "0" && menu.menuType === "C";
}
function getRouterName(menu) {
  return firstToUpper(menu.path);
}

function firstToUpper(str) {
  return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
}
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else if (route.component === "InnerLink") {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView" && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
    }

    children = children.concat(el);
  });
  return children;
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === "development") {
    return (resolve) => require([`@/views/${view}`], resolve);
  } else {
  }
};

export default permission;
