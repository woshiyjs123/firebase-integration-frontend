<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-card>
          <!-- <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-col>
          </el-row> -->

          <el-table
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <el-table-column
              label="用户名称"
              align="center"
              key="username"
              prop="username"
              v-if="columns[0].visible"
              :show-overflow-tooltip="true"
            />
             <el-table-column
              label="身高"
              align="center"
              key="height"
              prop="height"
              v-if="columns[0].visible"
            />
            <el-table-column
              label="体重"
              align="center"
              key="weight"
              prop="weight"
              v-if="columns[2].visible"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="血压"
              align="center"
              key="bloodPressure"
              prop="bloodPressure"
              v-if="columns[3].visible"
              width="120"
            />
            <el-table-column
              label="体脂率"
              align="center"
              key="bodyFatRate"
              prop="bodyFatRate"
              v-if="columns[4].visible"
              width="120"
            />
            <el-table-column
              label="骨密度"
              align="center"
              key="boneMineralDensity"
              prop="boneMineralDensity"
              v-if="columns[5].visible"
              width="160"
            >
              <template #default="scope">
                <span>{{ scope.row.boneMineralDensity }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="操作"
              align="center"
              width="150"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-tooltip
                  content="修改"
                  placement="top"
                  v-if="scope.row.userId !== 1"
                >
                  <el-button
                    link
                    type="primary"
                    icon="Edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:user:edit']"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  content="删除"
                  placement="top"
                  v-if="scope.row.userId !== 1"
                >
                  <el-button
                    link
                    type="primary"
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:user:remove']"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  content="重置密码"
                  placement="top"
                  v-if="scope.row.userId !== 1"
                >
                  <el-button
                    link
                    type="primary"
                    icon="Key"
                    @click="handleResetPwd(scope.row)"
                    v-hasPermi="['system:user:resetPwd']"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  content="分配角色"
                  placement="top"
                  v-if="scope.row.userId !== 1"
                >
                  <el-button
                    link
                    type="primary"
                    icon="CircleCheck"
                    @click="handleAuthRole(scope.row)"
                    v-hasPermi="['system:user:edit']"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column> -->
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </el-card>
      </el-col>
    </el-row>


  </div>
</template>

<script setup name="User">
import { getToken } from "@/utils/auth";
import { downloadFile } from "@/utils/download";

import {
  changeUserStatus,
  listUserHealth,
  resetUserPwd,
  delUser,
  getUser,
  updateUser,
  addUser,
  deptTreeSelect,
} from "@/api/system/user";

const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable, sys_user_sex } = proxy.useDict(
  "sys_normal_disable",
  "sys_user_sex"
);

const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const postOptions = ref([]);
const roleOptions = ref([]);
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData",
});
// 列显隐信息
const columns = ref([
  { key: 0, label: `用户名称`, visible: true },
  { key: 1, label: `身高`, visible: true },
  { key: 2, label: `体重`, visible: true },
  { key: 3, label: `血压`, visible: true },
  { key: 4, label: `体脂率`, visible: true },
  { key: 5, label: `骨密度`, visible: true },
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    username: undefined,
    phonenumber: undefined,
    status: undefined,
    deptId: undefined,
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

/** 根据名称筛选部门树 */
watch(deptName, (val) => {
  proxy.$refs["deptTreeRef"].filter(val);
});
  const parseTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
 


/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then((response) => {
    deptOptions.value = response.data;
  });
}

/** 查询用户列表 */
function getList() {
  loading.value = true;
  listUserHealth().then(
    (res) => {
      console.log("res===",res)
      loading.value = false;
      userList.value = res;
      total.value = res.length || 0;
    }
  );
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  queryParams.value.deptId = undefined;
  proxy.$refs.deptTreeRef.setCurrentKey(null);
  handleQuery();
}

/** 删除按钮操作 */
function handleDelete(row) {
  const userIds = row.userId || ids.value;
  proxy.$modal
    .confirm('是否确认删除用户编号为"' + userIds + '"的数据项？')
    .then(function () {
      return delUser(userIds);
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}


/** 跳转角色分配 */
function handleAuthRole(row) {
  const userId = row.userId;
  router.push("/system/user-auth/role/" + userId);
}

/** 重置密码按钮操作 */
function handleResetPwd(row) {
  proxy
    .$prompt('请输入"' + row.username + '"的新密码', "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
      inputValidator: (value) => {
        if (/<|>|"|'|\||\\/.test(value)) {
          return "不能包含非法字符：< > \" ' \\\ |";
        }
      },
    })
    .then(({ value }) => {
      resetUserPwd(row.userId, value).then((response) => {
        proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
      });
    })
    .catch(() => {});
}

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入";
  upload.open = true;
}

/** 下载模板操作 */
function importTemplate() {
  proxy.download(
    "system/user/importTemplate",
    {},
    `user_template_${new Date().getTime()}.xlsx`
  );
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert(
    "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
      response.msg +
      "</div>",
    "导入结果",
    { dangerouslyUseHTMLString: true }
  );
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}

/** 重置操作表单 */
function reset() {
  form.value = {
    userId: undefined,
    deptId: undefined,
    username: undefined,
    nickName: undefined,
    password: undefined,
    phonenumber: undefined,
    email: undefined,
    sex: undefined,
    status: "0",
    remark: undefined,
    postIds: [],
    roleIds: [],
  };
  proxy.resetForm("userRef");
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  getUser().then((response) => {
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    open.value = true;
    title.value = "添加用户";
    form.value.password = initPassword.value;
  });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const userId = row.userId || ids.value;
  getUser(userId).then((response) => {
    form.value = response.data;
    postOptions.value = response.posts;
    roleOptions.value = response.roles;
    form.value.postIds = response.postIds;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = "修改用户";
    form.password = "";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate((valid) => {
    if (valid) {
      if (form.value.userId != undefined) {
        updateUser(form.value).then((response) => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then((response) => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

getDeptTree();
getList();
</script>
