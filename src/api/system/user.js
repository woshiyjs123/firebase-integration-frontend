import request from "@/utils/request";
import { parseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(data) {
  return request({
    url: "/user/query-user-by-condition",
    method: "post",
    data: data,
  });
}

// 查询用户健康档案列表
export function listUserHealth() {
  return request({
    url: "/user/query-user-health-infos",
    method: "get",
  });
}

// 获取博文平均评分
export function getBlogStar(data) {
  return request({
    url: "/comment/query-blog-star",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
  });
}
// 判断用户是否还可以对某个博文评分;
export function canAddBlogStar(data) {
  return request({
    url: "/comment/can-add-blog-star",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
  });
}
// 给博文评星;
export function addBlogStar(data) {
  return request({
    url: "/comment/add-star",
    method: "post",
    // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
  });
}
export function addBlogComment(data) {
  return request({
    url: "/comment/add-comment",
    method: "post",
    // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
  });
}

// 获取评论列表
export function getBlogComments(data) {
  return request({
    url: "/comment/query-blog-comments",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
  });
}
// 注册
export function postUserRegister(data) {
  return request({
    url: "/user/user-register",
    method: "post",
    // headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
  });
}

// 给博文添加评论;
export function getBlogAdd(data) {
  return request({
    url: "/comment/add",
    method: "post",
    data,
  });
}
// 用户下载
export function listUserExport(data) {
  return request({
    url: "/user/export-user-all-by-condition",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 增加预约事件
export function reservationAdd(data) {
  return request({
    url: "/reservation/add",
    method: "post",
    data: data,
  });
}

// 取消预约事件
export function reservationCancel(data) {
  return request({
    url: "/reservation/cancel",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },

    data: data,
  });
}
// 预约事件列表
export function reservationQuery(data) {
  return request({
    url: "/reservation/query",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },

    data: data,
  });
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: "/system/user/" + parseStrEmpty(userId),
    method: "get",
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: "/system/user",
    method: "post",
    data: data,
  });
}

// 修改用户
export function updateUser(data) {
  return request({
    url: "/system/user",
    method: "put",
    data: data,
  });
}

// 删除用户
export function delUser(userId) {
  return request({
    url: "/system/user/" + userId,
    method: "delete",
  });
}

// 用户密码重置
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

// 用户状态修改
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

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: "/system/user/profile",
    method: "get",
  });
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: "/system/user/profile",
    method: "put",
    data: data,
  });
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword,
  };
  return request({
    url: "/system/user/profile/updatePwd",
    method: "put",
    params: data,
  });
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: "/system/user/profile/avatar",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: data,
  });
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: "/system/user/authRole/" + userId,
    method: "get",
  });
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: "/system/user/authRole",
    method: "put",
    params: data,
  });
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: "/system/user/deptTree",
    method: "get",
  });
}
// 查询用户登录次数
export function listUserCountChart(data) {
  return request({
    url: "/statistics/user-login-count",
    method: "post",
  });
}

export function aiAskText(data) {
  return request({
    url: "/ai/ask-by-text",
    method: "post",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
  });
}

// 邮件发送
export function mailSend(data) {
  return request({
    url: "/mail/send",
    method: "post",
    data,
  });
}
