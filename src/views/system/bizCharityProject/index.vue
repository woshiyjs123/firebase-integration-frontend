<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="项目唯一标识" prop="projectId">
                      <el-input
                          v-model="queryParams.projectId"
                          placeholder="请输入项目唯一标识"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="项目名称" prop="projectName">
                      <el-input
                          v-model="queryParams.projectName"
                          placeholder="请输入项目名称"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="项目编号" prop="projectCode">
                      <el-input
                          v-model="queryParams.projectCode"
                          placeholder="请输入项目编号"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="款项用途" prop="fundUsage">
                      <el-input
                          v-model="queryParams.fundUsage"
                          placeholder="请输入款项用途"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="对外开放时间段" prop="openTimePeriod">
                      <el-input
                          v-model="queryParams.openTimePeriod"
                          placeholder="请输入对外开放时间段"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
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
              v-hasPermi="['system:bizCharityProject:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizCharityProject:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizCharityProject:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizCharityProject:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizCharityProjectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="项目唯一标识" align="center" prop="projectId" />
              <el-table-column label="项目名称" align="center" prop="projectName" />
              <el-table-column label="项目编号" align="center" prop="projectCode" />
              <el-table-column label="款项用途" align="center" prop="fundUsage" />
              <el-table-column label="希望达到的金额" align="center" prop="targetAmount" />
              <el-table-column label="对外开放时间段" align="center" prop="openTimePeriod" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizCharityProject:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizCharityProject:remove']">删除</el-button>
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
    <!-- 添加或修改慈善项目对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizCharityProjectRef" :model="form" :rules="rules">

                        <el-form-item label="项目名称" prop="projectName">
                          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
                        </el-form-item>

                        <el-form-item label="项目编号" prop="projectCode">
                          <el-input v-model="form.projectCode" placeholder="请输入项目编号" />
                        </el-form-item>

                        <el-form-item label="项目描述" prop="projectDescription">
                          <el-input v-model="form.projectDescription" type="textarea" placeholder="请输入内容" />
                        </el-form-item>

                        <el-form-item label="款项用途" prop="fundUsage">
                          <el-input v-model="form.fundUsage" placeholder="请输入款项用途" />
                        </el-form-item>

                        <el-form-item label="希望达到的金额" prop="targetAmount">
                          <el-input v-model="form.targetAmount" placeholder="请输入希望达到的金额" />
                        </el-form-item>

                        <el-form-item label="对外开放时间段" prop="openTimePeriod">
                          <el-input v-model="form.openTimePeriod" placeholder="请输入对外开放时间段" />
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

<script setup name="BizCharityProject">
  import { listBizCharityProject, getBizCharityProject, delBizCharityProject, addBizCharityProject, updateBizCharityProject } from "@/api/system/bizCharityProject";
  const { proxy } = getCurrentInstance();

  const bizCharityProjectList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");

  /**定义关联表数据接收对象*/
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    projectId: null,
                    projectName: null,
                    projectCode: null,
                    fundUsage: null,
                    openTimePeriod: null
    },
    rules: {
                    projectId: [
                { required: true, message: "项目唯一标识不能为空", trigger: "blur" }
              ],
                    projectName: [
                { required: true, message: "项目名称不能为空", trigger: "blur" }
              ],
                    projectCode: [
                { required: true, message: "项目编号不能为空", trigger: "blur" }
              ],
                    projectDescription: [
                { required: true, message: "项目描述不能为空", trigger: "blur" }
              ],
                    fundUsage: [
                { required: true, message: "款项用途不能为空", trigger: "blur" }
              ],
                    targetAmount: [
                { required: true, message: "希望达到的金额不能为空", trigger: "blur" }
              ],
                    openTimePeriod: [
                { required: true, message: "对外开放时间段不能为空", trigger: "blur" }
              ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询慈善项目列表 */
  function getList() {
    loading.value = true;
    listBizCharityProject(queryParams.value).then(response => {
            bizCharityProjectList.value = response.rows;
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
                    projectId: null,
                    projectName: null,
                    projectCode: null,
                    projectDescription: null,
                    fundUsage: null,
                    targetAmount: null,
                    openTimePeriod: null
    };
    proxy.resetForm("bizCharityProjectRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.projectId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加慈善项目";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _projectId = row.projectId || ids.value
    getBizCharityProject(_projectId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改慈善项目";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizCharityProjectRef"].validate(valid => {
      if (valid) {
        if (form.value.projectId != null) {
          updateBizCharityProject(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizCharityProject(form.value).then(response => {
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
    const _projectIds = row.projectId || ids.value;
    proxy.$modal.confirm('是否确认删除慈善项目编号为"' + _projectIds + '"的数据项？').then(function() {
      return delBizCharityProject(_projectIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 关联表远程搜索 */

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/bizCharityProject/export', {
      ...queryParams.value
    }, `bizCharityProject_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
