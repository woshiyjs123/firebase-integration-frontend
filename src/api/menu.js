import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  // return request({
  //   url: '/getRouters',
  //   method: 'get'
  // })
  return new Promise(resolve => {
      resolve( {
    "msg": "操作成功",
    "code": 200,
    "data": [
        {
            "name": "Charitywebsite",
            "path": "/charitywebsite",
            "hidden": false,
            "redirect": "noRedirect",
            "component": "Layout",
            "alwaysShow": true,
            "meta": {
                "title": "慈善网站",
                "icon": "list",
                "noCache": false,
                "link": null
            },
            "children": [
                {
                    "name": "BizAccountManagement",
                    "path": "bizAccountManagement",
                    "hidden": false,
                    "component": "system/bizAccountManagement/index",
                    "meta": {
                        "title": "账目管理",
                        "icon": "code",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "BizCharityConsultationReservationManagement",
                    "path": "bizCharityConsultationReservationManagement",
                    "hidden": false,
                    "component": "system/bizCharityConsultationReservationManagement/index",
                    "meta": {
                        "title": "慈善咨询预约管理",
                        "icon": "logininfor",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "BizUserFollowProjectManagement",
                    "path": "bizUserFollowProjectManagement",
                    "hidden": false,
                    "component": "system/bizUserFollowProjectManagement/index",
                    "meta": {
                        "title": "用户关注项目管理",
                        "icon": "textarea",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "BizUserManagement",
                    "path": "bizUserManagement",
                    "hidden": false,
                    "component": "system/bizUserManagement/index",
                    "meta": {
                        "title": "用户管理",
                        "icon": "number",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "BizNewsManagement",
                    "path": "bizNewsManagement",
                    "hidden": false,
                    "component": "system/bizNewsManagement/index",
                    "meta": {
                        "title": "资讯管理",
                        "icon": "switch",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "BizCharityProjectPublicity",
                    "path": "bizCharityProjectPublicity",
                    "hidden": false,
                    "component": "system/bizCharityProjectPublicity/index",
                    "meta": {
                        "title": "慈善项目公示",
                        "icon": "dashboard",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "BizDonationRecord",
                    "path": "bizDonationRecord",
                    "hidden": false,
                    "component": "system/bizDonationRecord/index",
                    "meta": {
                        "title": "捐赠记录",
                        "icon": "github",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "BizCharityReceptionTimeManagement",
                    "path": "bizCharityReceptionTimeManagement",
                    "hidden": false,
                    "component": "system/bizCharityReceptionTimeManagement/index",
                    "meta": {
                        "title": "慈善接待时间管理",
                        "icon": "email",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "BizEmailManagement",
                    "path": "bizEmailManagement",
                    "hidden": false,
                    "component": "system/bizEmailManagement/index",
                    "meta": {
                        "title": "邮件管理",
                        "icon": "logininfor",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "BizCharityProject",
                    "path": "bizCharityProject",
                    "hidden": false,
                    "component": "system/bizCharityProject/index",
                    "meta": {
                        "title": "慈善项目",
                        "icon": "clipboard",
                        "noCache": false,
                        "link": null
                    }
                }
            ]
        },
        {
            "name": "System",
            "path": "/system",
            "hidden": false,
            "redirect": "noRedirect",
            "component": "Layout",
            "alwaysShow": true,
            "meta": {
                "title": "系统管理",
                "icon": "system",
                "noCache": false,
                "link": null
            },
            "children": [
                {
                    "name": "User",
                    "path": "user",
                    "hidden": false,
                    "component": "system/user/index",
                    "meta": {
                        "title": "用户管理",
                        "icon": "user",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Role",
                    "path": "role",
                    "hidden": false,
                    "component": "system/role/index",
                    "meta": {
                        "title": "角色管理",
                        "icon": "peoples",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Menu",
                    "path": "menu",
                    "hidden": false,
                    "component": "system/menu/index",
                    "meta": {
                        "title": "菜单管理",
                        "icon": "tree-table",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Dept",
                    "path": "dept",
                    "hidden": false,
                    "component": "system/dept/index",
                    "meta": {
                        "title": "部门管理",
                        "icon": "tree",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Post",
                    "path": "post",
                    "hidden": false,
                    "component": "system/post/index",
                    "meta": {
                        "title": "岗位管理",
                        "icon": "post",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Dict",
                    "path": "dict",
                    "hidden": false,
                    "component": "system/dict/index",
                    "meta": {
                        "title": "字典管理",
                        "icon": "dict",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Config",
                    "path": "config",
                    "hidden": false,
                    "component": "system/config/index",
                    "meta": {
                        "title": "参数设置",
                        "icon": "edit",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Notice",
                    "path": "notice",
                    "hidden": false,
                    "component": "system/notice/index",
                    "meta": {
                        "title": "通知公告",
                        "icon": "message",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Log",
                    "path": "log",
                    "hidden": false,
                    "redirect": "noRedirect",
                    "component": "ParentView",
                    "alwaysShow": true,
                    "meta": {
                        "title": "日志管理",
                        "icon": "log",
                        "noCache": false,
                        "link": null
                    },
                    "children": [
                        {
                            "name": "Operlog",
                            "path": "operlog",
                            "hidden": false,
                            "component": "monitor/operlog/index",
                            "meta": {
                                "title": "操作日志",
                                "icon": "form",
                                "noCache": false,
                                "link": null
                            }
                        },
                        {
                            "name": "Logininfor",
                            "path": "logininfor",
                            "hidden": false,
                            "component": "monitor/logininfor/index",
                            "meta": {
                                "title": "登录日志",
                                "icon": "logininfor",
                                "noCache": false,
                                "link": null
                            }
                        }
                    ]
                }
            ]
        },
        {
            "name": "Monitor",
            "path": "/monitor",
            "hidden": false,
            "redirect": "noRedirect",
            "component": "Layout",
            "alwaysShow": true,
            "meta": {
                "title": "系统监控",
                "icon": "monitor",
                "noCache": false,
                "link": null
            },
            "children": [
                {
                    "name": "Online",
                    "path": "online",
                    "hidden": false,
                    "component": "monitor/online/index",
                    "meta": {
                        "title": "在线用户",
                        "icon": "online",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Server",
                    "path": "server",
                    "hidden": false,
                    "component": "monitor/server/index",
                    "meta": {
                        "title": "服务监控",
                        "icon": "server",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "Cache",
                    "path": "cache",
                    "hidden": false,
                    "component": "monitor/cache/index",
                    "meta": {
                        "title": "缓存监控",
                        "icon": "redis",
                        "noCache": false,
                        "link": null
                    }
                },
                {
                    "name": "CacheList",
                    "path": "cacheList",
                    "hidden": false,
                    "component": "monitor/cache/list",
                    "meta": {
                        "title": "缓存列表",
                        "icon": "redis-list",
                        "noCache": false,
                        "link": null
                    }
                }
            ]
        }
    ]
});
  });
}