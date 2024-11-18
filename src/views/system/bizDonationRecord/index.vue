<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="捐赠记录ID" prop="donationId">
                      <el-input
                          v-model="queryParams.donationId"
                          placeholder="请输入捐赠记录ID"
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

                    <el-form-item label="捐赠日期" style="width: 308px">
                      <el-date-picker
                          v-model="daterangeDonationDate"
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
              v-hasPermi="['system:bizDonationRecord:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizDonationRecord:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizDonationRecord:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizDonationRecord:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizDonationRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="捐赠记录ID" align="center" prop="donationId" />
              <el-table-column label="捐赠人ID" align="center" prop="donorId" />
              <el-table-column label="捐赠项目ID" align="center" prop="projectId" />
              <el-table-column label="捐赠日期" align="center" prop="donationDate" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.donationDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="捐赠金额" align="center" prop="amount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizDonationRecord:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizDonationRecord:remove']">删除</el-button>
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
    <!-- 添加或修改捐赠记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizDonationRecordRef" :model="form" :rules="rules">

                        <el-form-item label="捐赠日期" prop="donationDate">
                          <el-date-picker clearable
                                          v-model="form.donationDate"
                                          type="date"
                                          value-format="YYYY-MM-DD"
                                          placeholder="请选择捐赠日期">
                          </el-date-picker>
                        </el-form-item>

                        <el-form-item label="捐赠金额" prop="amount">
                          <el-input v-model="form.amount" placeholder="请输入捐赠金额" />
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

<script setup name="BizDonationRecord">
  import { listBizDonationRecord, getBizDonationRecord, delBizDonationRecord, addBizDonationRecord, updateBizDonationRecord } from "@/api/system/bizDonationRecord";
      import { listBizUserManagement} from "@/api/system/bizUserManagement";
      import { listBizCharityProject} from "@/api/system/bizCharityProject";
  const { proxy } = getCurrentInstance();

  const bizDonationRecordList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
          const daterangeDonationDate = ref([]);

  /**定义关联表数据接收对象*/
      const donorIdJoinbizUserManagement=ref([]);
      const projectIdJoinbizCharityProject=ref([]);
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    donationId: null,
                    donorId: null,
                    projectId: null,
                    donationDate: null,
    },
    rules: {
                    donationId: [
                { required: true, message: "捐赠记录ID不能为空", trigger: "blur" }
              ],
                    donorId: [
                { required: true, message: "捐赠人ID不能为空", trigger: "blur" }
              ],
                    projectId: [
                { required: true, message: "捐赠项目ID不能为空", trigger: "blur" }
              ],
                    donationDate: [
                { required: true, message: "捐赠日期不能为空", trigger: "blur" }
              ],
                    amount: [
                { required: true, message: "捐赠金额不能为空", trigger: "blur" }
              ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询捐赠记录列表 */
  function getList() {
    loading.value = true;
            queryParams.value.params = {};
            if (null != daterangeDonationDate && '' != daterangeDonationDate) {
              queryParams.value.params["beginDonationDate"] = daterangeDonationDate.value[0];
              queryParams.value.params["endDonationDate"] = daterangeDonationDate.value[1];
            }
    listBizDonationRecord(queryParams.value).then(response => {
            bizDonationRecordList.value = response.rows;
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
                    donationId: null,
                    donorId: null,
                    projectId: null,
                    donationDate: null,
                    amount: null
    };
    proxy.resetForm("bizDonationRecordRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
            daterangeDonationDate.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.donationId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加捐赠记录";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _donationId = row.donationId || ids.value
    getBizDonationRecord(_donationId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改捐赠记录";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizDonationRecordRef"].validate(valid => {
      if (valid) {
        if (form.value.donationId != null) {
          updateBizDonationRecord(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizDonationRecord(form.value).then(response => {
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
    const _donationIds = row.donationId || ids.value;
    proxy.$modal.confirm('是否确认删除捐赠记录编号为"' + _donationIds + '"的数据项？').then(function() {
      return delBizDonationRecord(_donationIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 关联表远程搜索 */

  function donorIdJoinRemote(requestParam){
    const paramObj = {"String":requestParam};
    listBizUserManagement(paramObj).then(response => {
      donorIdJoinbizUserManagement.value = response.rows;
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
    proxy.download('system/bizDonationRecord/export', {
      ...queryParams.value
    }, `bizDonationRecord_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
