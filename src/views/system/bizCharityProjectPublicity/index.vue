<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="公示ID" prop="publicityId">
                      <el-input
                          v-model="queryParams.publicityId"
                          placeholder="请输入公示ID"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
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
              v-hasPermi="['system:bizCharityProjectPublicity:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizCharityProjectPublicity:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizCharityProjectPublicity:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizCharityProjectPublicity:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizCharityProjectPublicityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="公示ID" align="center" prop="publicityId" />
              <el-table-column label="项目ID" align="center" prop="projectId" />
              <el-table-column label="累计捐赠金额" align="center" prop="totalDonatedAmount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizCharityProjectPublicity:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizCharityProjectPublicity:remove']">删除</el-button>
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
    <!-- 添加或修改慈善项目公示对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizCharityProjectPublicityRef" :model="form" :rules="rules">

                        <el-form-item label="捐赠信息" prop="donationInfo">
                          <el-input v-model="form.donationInfo" type="textarea" placeholder="请输入内容" />
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

<script setup name="BizCharityProjectPublicity">
  import { listBizCharityProjectPublicity, getBizCharityProjectPublicity, delBizCharityProjectPublicity, addBizCharityProjectPublicity, updateBizCharityProjectPublicity } from "@/api/system/bizCharityProjectPublicity";
      import { listBizCharityProject} from "@/api/system/bizCharityProject";
  const { proxy } = getCurrentInstance();

  const bizCharityProjectPublicityList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");

  /**定义关联表数据接收对象*/
      const projectIdJoinbizCharityProject=ref([]);
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    publicityId: null,
                    projectId: null,
    },
    rules: {
                    publicityId: [
                { required: true, message: "公示ID不能为空", trigger: "blur" }
              ],
                    projectId: [
                { required: true, message: "项目ID不能为空", trigger: "blur" }
              ],
                    totalDonatedAmount: [
                { required: true, message: "累计捐赠金额不能为空", trigger: "blur" }
              ],
                    donationInfo: [
                { required: true, message: "捐赠信息不能为空", trigger: "blur" }
              ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询慈善项目公示列表 */
  function getList() {
    loading.value = true;
    listBizCharityProjectPublicity(queryParams.value).then(response => {
            bizCharityProjectPublicityList.value = response.rows;
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
                    publicityId: null,
                    projectId: null,
                    totalDonatedAmount: null,
                    donationInfo: null
    };
    proxy.resetForm("bizCharityProjectPublicityRef");
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
    ids.value = selection.map(item => item.publicityId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加慈善项目公示";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _publicityId = row.publicityId || ids.value
    getBizCharityProjectPublicity(_publicityId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改慈善项目公示";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizCharityProjectPublicityRef"].validate(valid => {
      if (valid) {
        if (form.value.publicityId != null) {
          updateBizCharityProjectPublicity(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizCharityProjectPublicity(form.value).then(response => {
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
    const _publicityIds = row.publicityId || ids.value;
    proxy.$modal.confirm('是否确认删除慈善项目公示编号为"' + _publicityIds + '"的数据项？').then(function() {
      return delBizCharityProjectPublicity(_publicityIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 关联表远程搜索 */

  function projectIdJoinRemote(requestParam){
    const paramObj = {"String":requestParam};
    listBizCharityProject(paramObj).then(response => {
      projectIdJoinbizCharityProject.value = response.rows;
    });
  }


  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/bizCharityProjectPublicity/export', {
      ...queryParams.value
    }, `bizCharityProjectPublicity_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
