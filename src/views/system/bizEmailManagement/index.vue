<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="邮件ID" prop="emailId">
                      <el-input
                          v-model="queryParams.emailId"
                          placeholder="请输入邮件ID"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="接收者信息" prop="recipientInfo">
                      <el-input
                          v-model="queryParams.recipientInfo"
                          placeholder="请输入接收者信息"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="发送时间" style="width: 308px">
                      <el-date-picker
                          v-model="daterangeSendTime"
                          value-format="YYYY-MM-DD"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="邮件主题" prop="subject">
                      <el-input
                          v-model="queryParams.subject"
                          placeholder="请输入邮件主题"
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
              v-hasPermi="['system:bizEmailManagement:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizEmailManagement:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizEmailManagement:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizEmailManagement:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizEmailManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="邮件ID" align="center" prop="emailId" />
              <el-table-column label="接收者信息" align="center" prop="recipientInfo" />
              <el-table-column label="发送时间" align="center" prop="sendTime" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.sendTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="邮件主题" align="center" prop="subject" />
              <el-table-column label="发送结果" align="center" prop="sendResult">
                <template #default="scope">
                      <dict-tag :options="biz_email_management_send_result" :value="scope.row.sendResult"/>
                </template>
              </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizEmailManagement:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizEmailManagement:remove']">删除</el-button>
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
    <!-- 添加或修改邮件管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizEmailManagementRef" :model="form" :rules="rules">

                        <el-form-item label="接收者信息" prop="recipientInfo">
                          <el-input v-model="form.recipientInfo" placeholder="请输入接收者信息" />
                        </el-form-item>

                        <el-form-item label="邮件主题" prop="subject">
                          <el-input v-model="form.subject" placeholder="请输入邮件主题" />
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

<script setup name="BizEmailManagement">
  import { listBizEmailManagement, getBizEmailManagement, delBizEmailManagement, addBizEmailManagement, updateBizEmailManagement } from "@/api/system/bizEmailManagement";
  const { proxy } = getCurrentInstance();
      const { biz_email_management_send_result } = proxy.useDict('biz_email_management_send_result');

  const bizEmailManagementList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
          const daterangeSendTime = ref([]);

  /**定义关联表数据接收对象*/
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    emailId: null,
                    recipientInfo: null,
                    sendTime: null,
                    subject: null,
    },
    rules: {
                    emailId: [
                { required: true, message: "邮件ID不能为空", trigger: "blur" }
              ],
                    recipientInfo: [
                { required: true, message: "接收者信息不能为空", trigger: "blur" }
              ],
                    sendTime: [
                { required: true, message: "发送时间不能为空", trigger: "blur" }
              ],
                    subject: [
                { required: true, message: "邮件主题不能为空", trigger: "blur" }
              ],
                    sendResult: [
                { required: true, message: "发送结果不能为空", trigger: "change" }
              ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询邮件管理列表 */
  function getList() {
    loading.value = true;
            queryParams.value.params = {};
            if (null != daterangeSendTime && '' != daterangeSendTime) {
              queryParams.value.params["beginSendTime"] = daterangeSendTime.value[0];
              queryParams.value.params["endSendTime"] = daterangeSendTime.value[1];
            }
    listBizEmailManagement(queryParams.value).then(response => {
            bizEmailManagementList.value = response.rows;
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
                    emailId: null,
                    recipientInfo: null,
                    sendTime: null,
                    subject: null,
                    sendResult: null
    };
    proxy.resetForm("bizEmailManagementRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
            daterangeSendTime.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.emailId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加邮件管理";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _emailId = row.emailId || ids.value
    getBizEmailManagement(_emailId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改邮件管理";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizEmailManagementRef"].validate(valid => {
      if (valid) {
        if (form.value.emailId != null) {
          updateBizEmailManagement(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizEmailManagement(form.value).then(response => {
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
    const _emailIds = row.emailId || ids.value;
    proxy.$modal.confirm('是否确认删除邮件管理编号为"' + _emailIds + '"的数据项？').then(function() {
      return delBizEmailManagement(_emailIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 关联表远程搜索 */

  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/bizEmailManagement/export', {
      ...queryParams.value
    }, `bizEmailManagement_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
