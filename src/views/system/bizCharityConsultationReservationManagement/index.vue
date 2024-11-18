<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="预约ID" prop="reservationId">
                      <el-input
                          v-model="queryParams.reservationId"
                          placeholder="请输入预约ID"
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

                    <el-form-item label="咨询预约日期" style="width: 308px">
                      <el-date-picker
                          v-model="daterangeReservationDate"
                          value-format="YYYY-MM-DD"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="接待情况" prop="status">
                      <el-select v-model="queryParams.status" style="width: 240px" placeholder="请选择接待情况" clearable>
                        <el-option
                            v-for="dict in biz_charity_consultation_reservation_management_status"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                        />
                      </el-select>
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
              v-hasPermi="['system:bizCharityConsultationReservationManagement:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizCharityConsultationReservationManagement:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizCharityConsultationReservationManagement:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizCharityConsultationReservationManagement:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizCharityConsultationReservationManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="预约ID" align="center" prop="reservationId" />
              <el-table-column label="预约用户ID" align="center" prop="userId" />
              <el-table-column label="咨询预约日期" align="center" prop="reservationDate" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.reservationDate, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="接待情况" align="center" prop="status">
                <template #default="scope">
                      <dict-tag :options="biz_charity_consultation_reservation_management_status" :value="scope.row.status"/>
                </template>
              </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizCharityConsultationReservationManagement:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizCharityConsultationReservationManagement:remove']">删除</el-button>
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
    <!-- 添加或修改慈善咨询预约管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizCharityConsultationReservationManagementRef" :model="form" :rules="rules">

                        <el-form-item label="咨询预约日期" prop="reservationDate">
                          <el-date-picker clearable
                                          v-model="form.reservationDate"
                                          type="date"
                                          value-format="YYYY-MM-DD"
                                          placeholder="请选择咨询预约日期">
                          </el-date-picker>
                        </el-form-item>

                        <el-form-item label="接待情况" prop="status">
                          <el-select v-model="form.status" placeholder="请选择接待情况">
                            <el-option
                                v-for="dict in biz_charity_consultation_reservation_management_status"
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

<script setup name="BizCharityConsultationReservationManagement">
  import { listBizCharityConsultationReservationManagement, getBizCharityConsultationReservationManagement, delBizCharityConsultationReservationManagement, addBizCharityConsultationReservationManagement, updateBizCharityConsultationReservationManagement } from "@/api/system/bizCharityConsultationReservationManagement";
      import { listBizUserManagement} from "@/api/system/bizUserManagement";
  const { proxy } = getCurrentInstance();
      const { biz_charity_consultation_reservation_management_status } = proxy.useDict('biz_charity_consultation_reservation_management_status');

  const bizCharityConsultationReservationManagementList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
          const daterangeReservationDate = ref([]);

  /**定义关联表数据接收对象*/
      const userIdJoinbizUserManagement=ref([]);
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    reservationId: null,
                    userId: null,
                    reservationDate: null,
                    status: null
    },
    rules: {
                    reservationId: [
                { required: true, message: "预约ID不能为空", trigger: "blur" }
              ],
                    userId: [
                { required: true, message: "预约用户ID不能为空", trigger: "blur" }
              ],
                    reservationDate: [
                { required: true, message: "咨询预约日期不能为空", trigger: "blur" }
              ],
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询慈善咨询预约管理列表 */
  function getList() {
    loading.value = true;
            queryParams.value.params = {};
            if (null != daterangeReservationDate && '' != daterangeReservationDate) {
              queryParams.value.params["beginReservationDate"] = daterangeReservationDate.value[0];
              queryParams.value.params["endReservationDate"] = daterangeReservationDate.value[1];
            }
    listBizCharityConsultationReservationManagement(queryParams.value).then(response => {
            bizCharityConsultationReservationManagementList.value = response.rows;
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
                    reservationId: null,
                    userId: null,
                    reservationDate: null,
                    status: null
    };
    proxy.resetForm("bizCharityConsultationReservationManagementRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
            daterangeReservationDate.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.reservationId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加慈善咨询预约管理";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _reservationId = row.reservationId || ids.value
    getBizCharityConsultationReservationManagement(_reservationId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改慈善咨询预约管理";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizCharityConsultationReservationManagementRef"].validate(valid => {
      if (valid) {
        if (form.value.reservationId != null) {
          updateBizCharityConsultationReservationManagement(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizCharityConsultationReservationManagement(form.value).then(response => {
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
    const _reservationIds = row.reservationId || ids.value;
    proxy.$modal.confirm('是否确认删除慈善咨询预约管理编号为"' + _reservationIds + '"的数据项？').then(function() {
      return delBizCharityConsultationReservationManagement(_reservationIds);
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


  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/bizCharityConsultationReservationManagement/export', {
      ...queryParams.value
    }, `bizCharityConsultationReservationManagement_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
