import request from "@/utils/request";
import { praseStrEmpty } from "@/utils/sg";

export function listUser(query) {
  return request({
    url: "/system/user/list",
    method: "get",
    params: query,
  });
}

export function getUser(userId) {
  return request({
    url: "/system/user/" + praseStrEmpty(userId),
    method: "get",
  });
}

export function addUser(data) {
  return request({
    url: "/system/user",
    method: "post",
    data: data,
  });
}

export function delUser(userId) {
  return request({
    url: "/system/user/" + userId,
    method: "delete",
  });
}

export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password,
  };
  return request({
    url: "/system/user/resetPwd",
    method: "put",
    data: data,
  });
}

export function updateUser(data) {
  return request({
    url: "/system/user",
    method: "put",
    data: data,
  });
}

export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status,
  };
  return request({
    url: "/system/user/changeStatus",
    method: "put",
    data: data,
  });
}
