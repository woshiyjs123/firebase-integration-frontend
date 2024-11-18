<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="流水记录ID" prop="recordId">
                      <el-input
                          v-model="queryParams.recordId"
                          placeholder="请输入流水记录ID"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="资金来源" prop="source">
                      <el-input
                          v-model="queryParams.source"
                          placeholder="请输入资金来源"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="具体金额" prop="amount">
                      <el-input
                          v-model="queryParams.amount"
                          placeholder="请输入具体金额"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="创建时间" style="width: 308px">
                      <el-date-picker
                          v-model="daterangeCreationTime"
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
              v-hasPermi="['system:bizAccountManagement:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizAccountManagement:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizAccountManagement:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizAccountManagement:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizAccountManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="流水记录ID" align="center" prop="recordId" />
              <el-table-column label="资金来源" align="center" prop="source" />
              <el-table-column label="具体金额" align="center" prop="amount" />
              <el-table-column label="创建时间" align="center" prop="creationTime" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.creationTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="当前账户余额" align="center" prop="currentBalance" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizAccountManagement:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizAccountManagement:remove']">删除</el-button>
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
    <!-- 添加或修改账目管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizAccountManagementRef" :model="form" :rules="rules">

                        <el-form-item label="资金来源" prop="source">
                          <el-input v-model="form.source" placeholder="请输入资金来源" />
                        </el-form-item>

                        <el-form-item label="具体金额" prop="amount">
                          <el-input v-model="form.amount" placeholder="请输入具体金额" />
                        </el-form-item>

                        <el-form-item label="账户余额组成" prop="balanceComposition">
                          <el-input v-model="form.balanceComposition" type="textarea" placeholder="请输入内容" />
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

<script setup name="BizAccountManagement">
  import { listBizAccountManagement, getBizAccountManagement, delBizAccountManagement, addBizAccountManagement, updateBizAccountManagement } from "@/api/system/bizAccountManagement";
  const { proxy } = getCurrentInstance();

  const bizAccountManagementList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
          const daterangeCreationTime = ref([]);

  /**定义关联表数据接收对象*/
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    recordId: null,
                    source: null,
                    amount: null,
                    creationTime: null,
    },
    rules: {
                    recordId: [
                { required: true, message: "流水记录ID不能为空", trigger: "blur" }
              ],
                    source: [
                { required: true, message: "资金来源不能为空", trigger: "blur" }
              ],
                    amount: [
                { required: true, message: "具体金额不能为空", trigger: "blur" }
              ],
                    creationTime: [
                { required: true, message: "创建时间不能为空", trigger: "blur" }
              ],
                    currentBalance: [
                { required: true, message: "当前账户余额不能为空", trigger: "blur" }
              ],
                    balanceComposition: [
                { required: true, message: "账户余额组成不能为空", trigger: "blur" }
              ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询账目管理列表 */
  function getList() {
    loading.value = true;
            queryParams.value.params = {};
            if (null != daterangeCreationTime && '' != daterangeCreationTime) {
              queryParams.value.params["beginCreationTime"] = daterangeCreationTime.value[0];
              queryParams.value.params["endCreationTime"] = daterangeCreationTime.value[1];
            }
    listBizAccountManagement(queryParams.value).then(response => {
            bizAccountManagementList.value = response.rows;
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
                    recordId: null,
                    source: null,
                    amount: null,
                    creationTime: null,
                    currentBalance: null,
                    balanceComposition: null
    };
    proxy.resetForm("bizAccountManagementRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
            daterangeCreationTime.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.recordId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加账目管理";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _recordId = row.recordId || ids.value
    getBizAccountManagement(_recordId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改账目管理";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizAccountManagementRef"].validate(valid => {
      if (valid) {
        if (form.value.recordId != null) {
          updateBizAccountManagement(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizAccountManagement(form.value).then(response => {
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
    const _recordIds = row.recordId || ids.value;
    proxy.$modal.confirm('是否确认删除账目管理编号为"' + _recordIds + '"的数据项？').then(function() {
      return delBizAccountManagement(_recordIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 关联表远程搜索 */

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/bizAccountManagement/export', {
      ...queryParams.value
    }, `bizAccountManagement_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
