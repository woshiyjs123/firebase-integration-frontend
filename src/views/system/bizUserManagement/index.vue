<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="用户ID" prop="userId">
                      <el-input
                          v-model="queryParams.userId"
                          placeholder="请输入用户ID"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="登录名" prop="username">
                      <el-input
                          v-model="queryParams.username"
                          placeholder="请输入登录名"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="联系方式" prop="contactNumber">
                      <el-input
                          v-model="queryParams.contactNumber"
                          placeholder="请输入联系方式"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="注册时间" style="width: 308px">
                      <el-date-picker
                          v-model="daterangeRegistrationTime"
                          value-format="YYYY-MM-DD"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="handleQuery">搜索</el-button>
          <el-button  @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-row :gutter="10" class="mb15">
        <el-col :span="1.5">
          <el-button
              type="primary"
              @click="handleAdd"
              v-hasPermi="['system:bizUserManagement:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizUserManagement:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizUserManagement:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizUserManagement:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizUserManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="用户ID" align="center" prop="userId" />
              <el-table-column label="登录名" align="center" prop="username" />
              <el-table-column label="联系方式" align="center" prop="contactNumber" />
              <el-table-column label="注册时间" align="center" prop="registrationTime" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.registrationTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="用户角色" align="center" prop="role">
                <template #default="scope">
                      <dict-tag :options="biz_user_management_role" :value="scope.row.role"/>
                </template>
              </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizUserManagement:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizUserManagement:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />
    </el-card>
    <!-- 添加或修改用户管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizUserManagementRef" :model="form" :rules="rules">

                        <el-form-item label="登录名" prop="username">
                          <el-input v-model="form.username" placeholder="请输入登录名" />
                        </el-form-item>

                        <el-form-item label="登录密码" prop="password">
                          <el-input v-model="form.password" placeholder="请输入登录密码" />
                        </el-form-item>

                        <el-form-item label="联系方式" prop="contactNumber">
                          <el-input v-model="form.contactNumber" placeholder="请输入联系方式" />
                        </el-form-item>

                        <el-form-item label="用户角色" prop="role">
                          <el-select v-model="form.role" placeholder="请选择用户角色">
                            <el-option
                                v-for="dict in biz_user_management_role"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="BizUserManagement">
  import { listBizUserManagement, getBizUserManagement, delBizUserManagement, addBizUserManagement, updateBizUserManagement } from "@/api/system/bizUserManagement";
  const { proxy } = getCurrentInstance();
      const { biz_user_management_role } = proxy.useDict('biz_user_management_role');

  const bizUserManagementList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
          const daterangeRegistrationTime = ref([]);

  /**定义关联表数据接收对象*/
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    userId: null,
                    username: null,
                    contactNumber: null,
                    registrationTime: null,
    },
    rules: {
                    userId: [
                { required: true, message: "用户ID不能为空", trigger: "blur" }
              ],
                    username: [
                { required: true, message: "登录名不能为空", trigger: "blur" }
              ],
                    password: [
                { required: true, message: "登录密码不能为空", trigger: "blur" }
              ],
                    registrationTime: [
                { required: true, message: "注册时间不能为空", trigger: "blur" }
              ],
                    role: [
                { required: true, message: "用户角色不能为空", trigger: "change" }
              ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询用户管理列表 */
  function getList() {
    loading.value = true;
            queryParams.value.params = {};
            if (null != daterangeRegistrationTime && '' != daterangeRegistrationTime) {
              queryParams.value.params["beginRegistrationTime"] = daterangeRegistrationTime.value[0];
              queryParams.value.params["endRegistrationTime"] = daterangeRegistrationTime.value[1];
            }
    listBizUserManagement(queryParams.value).then(response => {
            bizUserManagementList.value = response.rows;
      total.value = response.total;
      loading.value = false;
    });
  }

  // 取消按钮
  function cancel() {
    open.value = false;
    reset();
  }

  // 表单重置
  function reset() {
    form.value = {
                    userId: null,
                    username: null,
                    password: null,
                    contactNumber: null,
                    registrationTime: null,
                    role: null
    };
    proxy.resetForm("bizUserManagementRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
            daterangeRegistrationTime.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.userId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加用户管理";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _userId = row.userId || ids.value
    getBizUserManagement(_userId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改用户管理";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizUserManagementRef"].validate(valid => {
      if (valid) {
        if (form.value.userId != null) {
          updateBizUserManagement(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizUserManagement(form.value).then(response => {
            proxy.$modal.msgSuccess("新增成功");
            open.value = false;
            getList();
          });
        }
      }
    });
  }

  /** 删除按钮操作 */
  function handleDelete(row) {
    const _userIds = row.userId || ids.value;
    proxy.$modal.confirm('是否确认删除用户管理编号为"' + _userIds + '"的数据项？').then(function() {
      return delBizUserManagement(_userIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 关联表远程搜索 */

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/bizUserManagement/export', {
      ...queryParams.value
    }, `bizUserManagement_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
