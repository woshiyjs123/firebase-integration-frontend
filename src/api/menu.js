import request from "@/utils/request";

// 获取路由
export const getRouters = () => {
  // return request({
  //   url: '/getRouters',
  //   method: 'get'
  // })
  return new Promise((resolve) => {
    resolve({
      msg: "操作成功",
      code: 200,
      data: [
        {
          name: "Charitywebsite",
          path: "/charitywebsite",
          hidden: false,
          redirect: "noRedirect",
          component: "Layout",
          alwaysShow: true,
          meta: {
            title: "慈善社区",
            icon: "list",
            noCache: false,
            link: null,
          },
          children: [
            {
              name: "User",
              path: "user",
              hidden: false,
              component: "system/user/index",
              meta: {
                title: "用户管理",
                icon: "user",
                noCache: false,
                link: null,
              },
            },
            {
              name: "BizUserFollowProjectManagement",
              path: "bizUserFollowProjectManagement",
              hidden: false,
              component: "system/bizUserFollowProjectManagement/index",
              meta: {
                title: "健康档案",
                icon: "textarea",
                noCache: false,
                link: null,
              },
            },
            {
              name: "BizNewsManagement",
              path: "bizNewsManagement",
              hidden: false,
              component: "system/bizNewsManagement/index",
              meta: {
                title: "社区资讯",
                icon: "switch",
                noCache: false,
                link: null,
              },
            },
            {
              name: "CacheList",
              path: "cacheList",
              hidden: false,
              component: "monitor/cache/list",
              meta: {
                title: "数据报表",
                icon: "redis-list",
                noCache: false,
                link: null,
              },
            },
            {
              name: "BizAccountManagement",
              path: "bizAccountManagement",
              hidden: false,
              component: "system/bizAccountManagement/index",
              meta: {
                title: "AI问答",
                icon: "code",
                noCache: false,
                link: null,
              },
            },

            {
              name: "BizCharityProjectPublicity",
              path: "bizCharityProjectPublicity",
              hidden: false,
              component: "system/bizCharityProjectPublicity/index",
              meta: {
                title: "备忘录",
                icon: "dashboard",
                noCache: false,
                link: null,
              },
            },
            {
              name: "BizCharityConsultationReservationManagement",
              path: "bizCharityConsultationReservationManagement",
              hidden: false,
              component:
                "system/bizCharityConsultationReservationManagement/index",
              meta: {
                title: "邮件发送",
                icon: "logininfor",
                noCache: false,
                link: null,
              },
            },
            // {
            //   name: "BizUserManagement",
            //   path: "bizUserManagement",
            //   hidden: false,
            //   component: "system/bizUserManagement/index",
            //   meta: {
            //     title: "用户管理",
            //     icon: "number",
            //     noCache: false,
            //     link: null,
            //   },
            // },
            // {
            //   name: "BizNewsManagement",
            //   path: "bizNewsManagement",
            //   hidden: false,
            //   component: "system/bizNewsManagement/index",
            //   meta: {
            //     title: "资讯管理",
            //     icon: "switch",
            //     noCache: false,
            //     link: null,
            //   },
            // },
            // {
            //   name: "BizCharityProjectPublicity",
            //   path: "bizCharityProjectPublicity",
            //   hidden: false,
            //   component: "system/bizCharityProjectPublicity/index",
            //   meta: {
            //     title: "慈善项目公示",
            //     icon: "dashboard",
            //     noCache: false,
            //     link: null,
            //   },
            // },
            // {
            //   name: "BizDonationRecord",
            //   path: "bizDonationRecord",
            //   hidden: false,
            //   component: "system/bizDonationRecord/index",
            //   meta: {
            //     title: "捐赠记录",
            //     icon: "github",
            //     noCache: false,
            //     link: null,
            //   },
            // },
            // {
            //   name: "BizCharityReceptionTimeManagement",
            //   path: "bizCharityReceptionTimeManagement",
            //   hidden: false,
            //   component: "system/bizCharityReceptionTimeManagement/index",
            //   meta: {
            //     title: "慈善接待时间管理",
            //     icon: "email",
            //     noCache: false,
            //     link: null,
            //   },
            // },
            // {
            //   name: "BizEmailManagement",
            //   path: "bizEmailManagement",
            //   hidden: false,
            //   component: "system/bizEmailManagement/index",
            //   meta: {
            //     title: "邮件管理",
            //     icon: "logininfor",
            //     noCache: false,
            //     link: null,
            //   },
            // },
            // {
            //   name: "BizCharityProject",
            //   path: "bizCharityProject",
            //   hidden: false,
            //   component: "system/bizCharityProject/index",
            //   meta: {
            //     title: "慈善项目",
            //     icon: "clipboard",
            //     noCache: false,
            //     link: null,
            //   },
            // },
          ],
        },
      ],
    });
  });
};
