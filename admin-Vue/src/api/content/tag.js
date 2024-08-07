import request from "@/utils/request";

export function listTag(query) {
  return request({
    url: "/content/tag/list",
    method: "get",
    params: query,
  });
}

export function listAllTag() {
  return request({
    url: "/content/tag/listAllTag",
    method: "get",
  });
}
export function getTag(id) {
  return request({
    url: "/content/tag/" + id,
    method: "get",
  });
}

export function addTag(data) {
  return request({
    url: "/content/tag",
    method: "post",
    data: data,
  });
}

export function updateTag(data) {
  return request({
    url: "/content/tag",
    method: "put",
    data: data,
  });
}

export function delTag(id) {
  return request({
    url: "/content/tag?ids=" + id,
    method: "delete",
  });
}

export function exportTag(query) {
  return request({
    url: "/content/tag/export",
    method: "get",
    params: query,
  });
}
