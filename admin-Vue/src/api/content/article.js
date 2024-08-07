import request from "@/utils/request";

export function addArticle(data) {
  return request({
    url: "/content/article",
    method: "post",
    data: data,
  });
}

export function listArticle(query) {
  return request({
    url: "/content/article/list",
    method: "get",
    params: query,
  });
}

export function delArticle(id) {
  return request({
    url: "/content/article?ids=" + id,
    method: "delete",
  });
}

export function getArticle(id) {
  return request({
    url: "/content/article/" + id,
    method: "get",
  });
}

export function updateArticle(data) {
  return request({
    url: "/content/article",
    method: "put",
    data: data,
  });
}
