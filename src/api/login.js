import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/user/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
//    return new Promise(resolve => {
//       resolve( {
//     "msg": "操作成功",
//     "code": 200,
//     "token": "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImUzYjZiNTA5LWVhNTctNDdjMS1hNGEzLTE0MTVjODdlY2JkMSJ9.-a-HWAGw8ift74p88uWX_aM_38xqq_gD-IVBc1qZ0JBvzCo5Ma_ZGoQYn4BZ9K84lOWBoup7BoDj3xdrQxhU8Q"
// });
//   });
 
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  // return request({
  //   url: '/getInfo',
  //   method: 'get'
  // })
   return new Promise(resolve => {
      resolve(   {
    "msg": "操作成功",
    "code": 200,
    "permissions": [
        "*:*:*"
    ],
    "roles": [
        "admin"
    ],
    "user": {
        "createBy": "admin",
        "createTime": "2024-10-15 20:35:04",
        "updateBy": null,
        "updateTime": null,
        "remark": "管理员",
        "params": {
            "@type": "java.util.HashMap"
        },
        "userId": 1,
        "deptId": 103,
        "userName": "admin",
        "nickName": "管理员",
        "email": "123456@163.com",
        "phonenumber": "15888888888",
        "sex": "1",
        "avatar": "",
        "password": "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
        "status": "0",
        "delFlag": "0",
        "loginIp": "127.0.0.1",
        "loginDate": "2024-11-18T09:04:13.000+08:00",
        "dept": {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {
                "@type": "java.util.HashMap"
            },
            "deptId": 103,
            "parentId": 101,
            "ancestors": "0,100,101",
            "deptName": "研发部门",
            "orderNum": 1,
            "leader": "admin",
            "phone": null,
            "email": null,
            "status": "0",
            "delFlag": null,
            "parentName": null,
            "children": []
        },
        "roles": [
            {
                "createBy": null,
                "createTime": null,
                "updateBy": null,
                "updateTime": null,
                "remark": null,
                "params": {
                    "@type": "java.util.HashMap"
                },
                "roleId": 1,
                "roleName": "超级管理员",
                "roleKey": "admin",
                "roleSort": 1,
                "dataScope": "1",
                "menuCheckStrictly": false,
                "deptCheckStrictly": false,
                "status": "0",
                "delFlag": null,
                "flag": false,
                "menuIds": null,
                "deptIds": null,
                "permissions": null,
                "admin": true
            }
        ],
        "roleIds": null,
        "postIds": null,
        "roleId": null,
        "admin": true
    }
});
  });

}

// 退出方法
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}