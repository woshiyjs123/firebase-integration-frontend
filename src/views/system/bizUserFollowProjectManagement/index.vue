<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="唯一标识ID" prop="id">
                      <el-input
                          v-model="queryParams.id"
                          placeholder="请输入唯一标识ID"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="登录名" prop="username">
                      <el-input
                          v-model="queryParams.username"
                          placeholder="请输入登录名"
                          clearable
                          @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>

                    <el-form-item label="项目名称" prop="projectName">
                      <el-input
                          v-model="queryParams.projectName"
                          placeholder="请输入项目名称"
                          clearable
                          @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>

                    <el-form-item label="最后一次捐赠日期" style="width: 308px">
                      <el-date-picker
                          v-model="daterangeLastDonationDate"
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
              v-hasPermi="['system:bizUserFollowProjectManagement:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizUserFollowProjectManagement:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizUserFollowProjectManagement:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizUserFollowProjectManagement:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizUserFollowProjectManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="唯一标识ID" align="center" prop="id" />
              <el-table-column label="用户ID" align="center" prop="userId" />
              <el-table-column label="项目ID" align="center" prop="projectId" />
              <el-table-column label="总捐赠金额" align="center" prop="totalDonatedAmount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizUserFollowProjectManagement:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizUserFollowProjectManagement:remove']">删除</el-button>
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
    <!-- 添加或修改用户关注项目管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizUserFollowProjectManagementRef" :model="form" :rules="rules">

                        <el-form-item label="最后一次捐赠日期" prop="lastDonationDate">
                          <el-date-picker clearable
                                          v-model="form.lastDonationDate"
                                          type="date"
                                          value-format="YYYY-MM-DD"
                                          placeholder="请选择最后一次捐赠日期">
                          </el-date-picker>
                        </el-form-item>

                        <el-form-item label="总捐赠金额" prop="totalDonatedAmount">
                          <el-input v-model="form.totalDonatedAmount" placeholder="请输入总捐赠金额" />
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

<script setup name="BizUserFollowProjectManagement">
  import { listBizUserFollowProjectManagement, getBizUserFollowProjectManagement, delBizUserFollowProjectManagement, addBizUserFollowProjectManagement, updateBizUserFollowProjectManagement } from "@/api/system/bizUserFollowProjectManagement";
      import { listBizUserManagement} from "@/api/system/bizUserManagement";
      import { listBizCharityProject} from "@/api/system/bizCharityProject";
  const { proxy } = getCurrentInstance();

  const bizUserFollowProjectManagementList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
          const daterangeLastDonationDate = ref([]);

  /**定义关联表数据接收对象*/
      const userIdJoinbizUserManagement=ref([]);
      const projectIdJoinbizCharityProject=ref([]);
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    id: null,
                    userId: null,
                    projectId: null,
                    lastDonationDate: null,
    },
    rules: {
                    id: [
                { required: true, message: "唯一标识ID不能为空", trigger: "blur" }
              ],
                    userId: [
                { required: true, message: "用户ID不能为空", trigger: "blur" }
              ],
                    projectId: [
                { required: true, message: "项目ID不能为空", trigger: "blur" }
              ],
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询用户关注项目管理列表 */
  function getList() {
    loading.value = true;
            queryParams.value.params = {};
            if (null != daterangeLastDonationDate && '' != daterangeLastDonationDate) {
              queryParams.value.params["beginLastDonationDate"] = daterangeLastDonationDate.value[0];
              queryParams.value.params["endLastDonationDate"] = daterangeLastDonationDate.value[1];
            }
    listBizUserFollowProjectManagement(queryParams.value).then(response => {
            bizUserFollowProjectManagementList.value = response.rows;
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
                    id: null,
                    userId: null,
                    projectId: null,
                    lastDonationDate: null,
                    totalDonatedAmount: null
    };
    proxy.resetForm("bizUserFollowProjectManagementRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
            daterangeLastDonationDate.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加用户关注项目管理";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _id = row.id || ids.value
    getBizUserFollowProjectManagement(_id).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改用户关注项目管理";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizUserFollowProjectManagementRef"].validate(valid => {
      if (valid) {
        if (form.value.id != null) {
          updateBizUserFollowProjectManagement(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizUserFollowProjectManagement(form.value).then(response => {
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
    const _ids = row.id || ids.value;
    proxy.$modal.confirm('是否确认删除用户关注项目管理编号为"' + _ids + '"的数据项？').then(function() {
      return delBizUserFollowProjectManagement(_ids);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 关联表远程搜索 */

  function userIdJoinRemote(requestParam){
    const paramObj = {"String":requestParam};
    listBizUserManagement(paramObj).then(response => {
      userIdJoinbizUserManagement.value = response.rows;
    });
  }


  function projectIdJoinRemote(requestParam){
    const paramObj = {"String":requestParam};
    listBizCharityProject(paramObj).then(response => {
      projectIdJoinbizCharityProject.value = response.rows;
    });
  }


  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/bizUserFollowProjectManagement/export', {
      ...queryParams.value
    }, `bizUserFollowProjectManagement_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
