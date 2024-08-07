import request from "@/utils/request";
import downloadService from "@/utils/downloadService";

export function listCategory(query) {
  return request({
    url: "/content/category/list",
    method: "get",
    params: query,
  });
}

export function listAllCategory() {
  return request({
    url: "/content/category/listAllCategory",
    method: "get",
  });
}
export function getCategory(id) {
  return request({
    url: "/content/category/" + id,
    method: "get",
  });
}

export function addCategory(data) {
  return request({
    url: "/content/category",
    method: "post",
    data: data,
  });
}

export function updateCategory(data) {
  return request({
    url: "/content/category",
    method: "put",
    data: data,
  });
}

export function delCategory(id) {
  return request({
    url: "/content/category?ids=" + id,
    method: "delete",
  });
}

export function exportCategory() {
  return downloadService({
    url: "/content/category/export",
    method: "get",
  });
}
