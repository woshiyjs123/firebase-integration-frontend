<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="时间段ID" prop="timeSlotId">
                      <el-input
                          v-model="queryParams.timeSlotId"
                          placeholder="请输入时间段ID"
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

                    <el-form-item label="预约开始时间" style="width: 308px">
                      <el-date-picker
                          v-model="daterangeStartTime"
                          value-format="YYYY-MM-DD"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="预约结束时间" style="width: 308px">
                      <el-date-picker
                          v-model="daterangeEndTime"
                          value-format="YYYY-MM-DD"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="预约人数限制" prop="maxReservations">
                      <el-input
                          v-model="queryParams.maxReservations"
                          placeholder="请输入预约人数限制"
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
              v-hasPermi="['system:bizCharityReceptionTimeManagement:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizCharityReceptionTimeManagement:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizCharityReceptionTimeManagement:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizCharityReceptionTimeManagement:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizCharityReceptionTimeManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="时间段ID" align="center" prop="timeSlotId" />
              <el-table-column label="项目ID" align="center" prop="projectId" />
              <el-table-column label="预约开始时间" align="center" prop="startTime" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="预约结束时间" align="center" prop="endTime" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="预约人数限制" align="center" prop="maxReservations" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizCharityReceptionTimeManagement:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizCharityReceptionTimeManagement:remove']">删除</el-button>
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
    <!-- 添加或修改慈善接待时间管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizCharityReceptionTimeManagementRef" :model="form" :rules="rules">

                        <el-form-item label="预约开始时间" prop="startTime">
                          <el-date-picker clearable
                                          v-model="form.startTime"
                                          type="date"
                                          value-format="YYYY-MM-DD"
                                          placeholder="请选择预约开始时间">
                          </el-date-picker>
                        </el-form-item>

                        <el-form-item label="预约结束时间" prop="endTime">
                          <el-date-picker clearable
                                          v-model="form.endTime"
                                          type="date"
                                          value-format="YYYY-MM-DD"
                                          placeholder="请选择预约结束时间">
                          </el-date-picker>
                        </el-form-item>

                        <el-form-item label="预约人数限制" prop="maxReservations">
                          <el-input v-model="form.maxReservations" placeholder="请输入预约人数限制" />
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

<script setup name="BizCharityReceptionTimeManagement">
  import { listBizCharityReceptionTimeManagement, getBizCharityReceptionTimeManagement, delBizCharityReceptionTimeManagement, addBizCharityReceptionTimeManagement, updateBizCharityReceptionTimeManagement } from "@/api/system/bizCharityReceptionTimeManagement";
      import { listBizCharityProject} from "@/api/system/bizCharityProject";
  const { proxy } = getCurrentInstance();

  const bizCharityReceptionTimeManagementList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
          const daterangeStartTime = ref([]);
          const daterangeEndTime = ref([]);

  /**定义关联表数据接收对象*/
      const projectIdJoinbizCharityProject=ref([]);
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    timeSlotId: null,
                    projectId: null,
                    startTime: null,
                    endTime: null,
                    maxReservations: null
    },
    rules: {
                    timeSlotId: [
                { required: true, message: "时间段ID不能为空", trigger: "blur" }
              ],
                    projectId: [
                { required: true, message: "项目ID不能为空", trigger: "blur" }
              ],
                    startTime: [
                { required: true, message: "预约开始时间不能为空", trigger: "blur" }
              ],
                    endTime: [
                { required: true, message: "预约结束时间不能为空", trigger: "blur" }
              ],
                    maxReservations: [
                { required: true, message: "预约人数限制不能为空", trigger: "blur" }
              ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询慈善接待时间管理列表 */
  function getList() {
    loading.value = true;
            queryParams.value.params = {};
            if (null != daterangeStartTime && '' != daterangeStartTime) {
              queryParams.value.params["beginStartTime"] = daterangeStartTime.value[0];
              queryParams.value.params["endStartTime"] = daterangeStartTime.value[1];
            }
            if (null != daterangeEndTime && '' != daterangeEndTime) {
              queryParams.value.params["beginEndTime"] = daterangeEndTime.value[0];
              queryParams.value.params["endEndTime"] = daterangeEndTime.value[1];
            }
    listBizCharityReceptionTimeManagement(queryParams.value).then(response => {
            bizCharityReceptionTimeManagementList.value = response.rows;
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
                    timeSlotId: null,
                    projectId: null,
                    startTime: null,
                    endTime: null,
                    maxReservations: null
    };
    proxy.resetForm("bizCharityReceptionTimeManagementRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
            daterangeStartTime.value = [];
            daterangeEndTime.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.timeSlotId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加慈善接待时间管理";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _timeSlotId = row.timeSlotId || ids.value
    getBizCharityReceptionTimeManagement(_timeSlotId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改慈善接待时间管理";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizCharityReceptionTimeManagementRef"].validate(valid => {
      if (valid) {
        if (form.value.timeSlotId != null) {
          updateBizCharityReceptionTimeManagement(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizCharityReceptionTimeManagement(form.value).then(response => {
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
    const _timeSlotIds = row.timeSlotId || ids.value;
    proxy.$modal.confirm('是否确认删除慈善接待时间管理编号为"' + _timeSlotIds + '"的数据项？').then(function() {
      return delBizCharityReceptionTimeManagement(_timeSlotIds);
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
    proxy.download('system/bizCharityReceptionTimeManagement/export', {
      ...queryParams.value
    }, `bizCharityReceptionTimeManagement_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
