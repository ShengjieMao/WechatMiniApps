import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Home", icon: "dashboard" },
      },
    ],
  },
  {
    path: "/write",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Write",
        component: () => import("@/views/content/article/write/index"),
        hidden: true,
      },
    ],
  },
  {
    path: "/system/user",
    component: Layout,
    children: [
      {
        path: "/",
        name: "User",
        component: () => import("@/views/system/user"),
        hidden: true,
      },
    ],
  },
  {
    path: "/system/role",
    component: Layout,
    children: [
      {
        path: "/",
        name: "role",
        component: () => import("@/views/system/role"),
        hidden: true,
      },
    ],
  },
  {
    path: "/system/menu",
    component: Layout,
    children: [
      {
        path: "/",
        name: "menu",
        component: () => import("@/views/system/menu"),
        hidden: true,
      },
    ],
  },
  {
    path: "/system/role",
    component: Layout,
    children: [
      {
        path: "/",
        name: "role",
        component: () => import("@/views/system/role"),
        hidden: true,
      },
    ],
  },
  {
    path: "/content/article",
    component: Layout,
    children: [
      {
        path: "/",
        name: "article",
        component: () => import("@/views/content/article/index"),
        hidden: true,
      },
    ],
  },
  {
    path: "/content/category",
    component: Layout,
    children: [
      {
        path: "/",
        name: "category",
        component: () => import("@/views/content/category/index"),
        hidden: true,
      },
    ],
  },
  {
    path: "/content/link",
    component: Layout,
    children: [
      {
        path: "/",
        name: "link",
        component: () => import("@/views/content/link/index"),
        hidden: true,
      },
    ],
  },
  {
    path: "/content/tag",
    component: Layout,
    children: [
      {
        path: "/",
        name: "tag",
        component: () => import("@/views/content/tag/index"),
        hidden: true,
      },
    ],
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
