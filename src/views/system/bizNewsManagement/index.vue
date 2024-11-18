<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item label="资讯ID" prop="newsId">
                      <el-input
                          v-model="queryParams.newsId"
                          placeholder="请输入资讯ID"
                          style="width: 240px"
                          clearable
                          @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="资讯标题" prop="title">
                      <el-input
                          v-model="queryParams.title"
                          placeholder="请输入资讯标题"
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

                    <el-form-item label="发布时间" style="width: 308px">
                      <el-date-picker
                          v-model="daterangePublishTime"
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
              v-hasPermi="['system:bizNewsManagement:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="success"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:bizNewsManagement:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:bizNewsManagement:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="warning"
              @click="handleExport"
              v-hasPermi="['system:bizNewsManagement:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

    <el-table v-loading="loading" :data="bizNewsManagementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="资讯ID" align="center" prop="newsId" />
              <el-table-column label="资讯标题" align="center" prop="title" />
              <el-table-column label="发布者ID" align="center" prop="publisherId" />
              <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
                <template #default="scope">
                  <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
                </template>
              </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:bizNewsManagement:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:bizNewsManagement:remove']">删除</el-button>
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
    <!-- 添加或修改资讯管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bizNewsManagementRef" :model="form" :rules="rules">

                        <el-form-item label="资讯标题" prop="title">
                          <el-input v-model="form.title" placeholder="请输入资讯标题" />
                        </el-form-item>

                        <el-form-item label="详细内容" prop="content">
                          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
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

<script setup name="BizNewsManagement">
  import { listBizNewsManagement, getBizNewsManagement, delBizNewsManagement, addBizNewsManagement, updateBizNewsManagement } from "@/api/system/bizNewsManagement";
      import { listBizUserManagement} from "@/api/system/bizUserManagement";
  const { proxy } = getCurrentInstance();

  const bizNewsManagementList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
          const daterangePublishTime = ref([]);

  /**定义关联表数据接收对象*/
      const publisherIdJoinbizUserManagement=ref([]);
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    newsId: null,
                    title: null,
                    publisherId: null,
                    publishTime: null
    },
    rules: {
                    newsId: [
                { required: true, message: "资讯ID不能为空", trigger: "blur" }
              ],
                    title: [
                { required: true, message: "资讯标题不能为空", trigger: "blur" }
              ],
                    content: [
                { required: true, message: "详细内容不能为空", trigger: "blur" }
              ],
                    publisherId: [
                { required: true, message: "发布者ID不能为空", trigger: "blur" }
              ],
                    publishTime: [
                { required: true, message: "发布时间不能为空", trigger: "blur" }
              ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询资讯管理列表 */
  function getList() {
    loading.value = true;
            queryParams.value.params = {};
            if (null != daterangePublishTime && '' != daterangePublishTime) {
              queryParams.value.params["beginPublishTime"] = daterangePublishTime.value[0];
              queryParams.value.params["endPublishTime"] = daterangePublishTime.value[1];
            }
    listBizNewsManagement(queryParams.value).then(response => {
            bizNewsManagementList.value = response.rows;
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
                    newsId: null,
                    title: null,
                    content: null,
                    publisherId: null,
                    publishTime: null
    };
    proxy.resetForm("bizNewsManagementRef");
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
            daterangePublishTime.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.newsId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "添加资讯管理";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _newsId = row.newsId || ids.value
    getBizNewsManagement(_newsId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改资讯管理";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizNewsManagementRef"].validate(valid => {
      if (valid) {
        if (form.value.newsId != null) {
          updateBizNewsManagement(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        } else {
          addBizNewsManagement(form.value).then(response => {
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
    const _newsIds = row.newsId || ids.value;
    proxy.$modal.confirm('是否确认删除资讯管理编号为"' + _newsIds + '"的数据项？').then(function() {
      return delBizNewsManagement(_newsIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 关联表远程搜索 */

  function publisherIdJoinRemote(requestParam){
    const paramObj = {"String":requestParam};
    listBizUserManagement(paramObj).then(response => {
      publisherIdJoinbizUserManagement.value = response.rows;
    });
  }


  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/bizNewsManagement/export', {
      ...queryParams.value
    }, `bizNewsManagement_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>
