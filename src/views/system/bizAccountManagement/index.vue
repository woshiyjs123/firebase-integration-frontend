<template>
  <div class="app-container">
    <el-card class="mb10">
       <el-form ref="bizAccountManagementRef" :model="form" :rules="rules">
          <el-form-item label="提问内容" prop="content">
            <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
          </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">开始问答</el-button>
        </div>
      </template>
    </el-card>
    <el-card>
      <el-row :gutter="10" class="mb15">
     <p class="center" v-loading="loading"  v-html="askText"></p>
      </el-row>


    </el-card>

  </div>
</template>

<script setup name="BizAccountManagement">
  import { listBizAccountManagement, getBizAccountManagement, delBizAccountManagement, addBizAccountManagement, updateBizAccountManagement } from "@/api/system/bizAccountManagement";
    import { aiAskText } from "@/api/system/user";

  const { proxy } = getCurrentInstance();

  const bizAccountManagementList = ref([]);
  const open = ref(false);
  const askText = ref("无问答数据")
  const loading = ref(false);
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
                    content: [
                { required: true, message: "提问内容不能为空", trigger: "blur" }
              ],
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
        askText.value = "正在问答请耐心等待一下"
        loading.value = true;
        if (form.value.content != null) {
          const parmas ={
            questionDesc : form.value.content
          }
          aiAskText(parmas).then(res => {
            console.log("res===",res)
            loading.value = false;
            askText.value = res
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
<style lang="scss" scoped>
.center {
  width: 100%;
  text-align: left;
}
</style>
