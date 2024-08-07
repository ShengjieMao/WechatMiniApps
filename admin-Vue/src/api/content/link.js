import request from "@/utils/request";

export function listLink(query) {
  return request({
    url: "/content/link/list",
    method: "get",
    params: query,
  });
}

export function getLink(id) {
  return request({
    url: "/content/link/" + id,
    method: "get",
  });
}

export function changeLinkStatus(id, newStatus) {
  return request({
    url: "/content/link/changeLinkStatus",
    method: "put",
    data: {
      id: id,
      status: newStatus,
    },
  });
}

export function addLink(data) {
  return request({
    url: "/content/link",
    method: "post",
    data: data,
  });
}

export function updateLink(data) {
  return request({
    url: "/content/link",
    method: "put",
    data: data,
  });
}

export function delLink(id) {
  return request({
    url: "/content/link?ids=" + id,
    method: "delete",
  });
}
