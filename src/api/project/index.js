import request from "@/utils/request";

// 查询项目列表
export function projectList(query) {
  return request({
    url: "/tool/codeGen/list",
    method: "get",
    params: query,
  });
}

//根据系统名称生成系统模块
export function aiGenModel(data) {
  return request({
    url: "/tool/codeGen/aiGenModel",
    method: "post",
    data,
  });
}

//通过模块名称和字段描述生成模块字段
export function aiGenColumnByModelDetails(data) {
  return request({
    url: "/tool/codeGen/aiGenColumnByModelDetails",
    method: "post",
    data,
  });
}

//保存系统信息
export function aiSaveSystem(data) {
  return request({
    url: "/tool/codeGen/aiSaveSystem",
    method: "post",
    data,
  });
}

//生成代码
export function downLoadGenCode(sysId) {
  return request({
    url: `/tool/codeGen/genCode/${sysId}`,
    method: "get",
  });
}

//生成项目
export function genCodeToLocal(sysId) {
  return request({
    url: `/tool/codeGen/genCodeToLocal/${sysId}?genType=genCode&workPath=/Users/wangwenqiang/Desktop/xunma/test-template`,
    method: "get",
  });
}

//获取项目详情
export function getSystemDetail(sysId) {
  return request({
    url: `/tool/codeGen/getDetail/${sysId}`,
    method: "get",
  });
}
