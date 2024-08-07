import request from "@/utils/request";

export function listAllRole() {
  return request({
    url: "/system/role/listAllRole",
    method: "get",
  });
}

export function listRole(query) {
  return request({
    url: "/system/role/list",
    method: "get",
    params: query,
  });
}

export function getRole(roleId) {
  return request({
    url: "/system/role/" + roleId,
    method: "get",
  });
}

export function updateRole(data) {
  return request({
    url: "/system/role",
    method: "put",
    data: data,
  });
}

export function delRole(roleId) {
  return request({
    url: "/system/role/" + roleId,
    method: "delete",
  });
}

export function addRole(data) {
  return request({
    url: "/system/role",
    method: "post",
    data: data,
  });
}

export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status,
  };
  return request({
    url: "/system/role/changeStatus",
    method: "put",
    data: data,
  });
}
