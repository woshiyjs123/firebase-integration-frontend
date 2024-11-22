<template>
  <div class="app-container">
    <el-card class="mb10">
       <el-form ref="bizAccountManagementRef" :model="form" :rules="rules">
           <el-form-item label="时间" prop="time">
              <el-date-picker
                v-model="form.time"
                type="datetimerange"
                range-separator="To"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                					value-format="YYYY-MM-DD HH:mm:ss"

              />
          </el-form-item>
          <el-form-item label="预约内容" prop="content">
            <el-input v-model="form.content" type="textarea" placeholder="请输入预约内容" />
          </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </template>
    </el-card>
        <el-card>
          <!-- <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-col>
          </el-row> -->

          <el-table
            v-loading="loading"
            :data="userList"
          >
            <!-- <el-table-column type="selection" width="50" align="center" /> -->
            <el-table-column
              label="用户名称"
              align="center"
              key="username"
              prop="username"
              v-if="columns[0].visible"
              :show-overflow-tooltip="true"
            />
             <el-table-column
              label="描述"
              align="center"
              key="desc"
              prop="desc"
              v-if="columns[0].visible"
            />
            <el-table-column
              label="开始时间"
              align="center"
              key="startTime"
              prop="startTime"
              v-if="columns[2].visible"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="结束时间"
              align="center"
              key="endTime"
              prop="endTime"
              v-if="columns[3].visible"
            />

            <el-table-column
              label="操作"
              align="center"
              width="150"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-tooltip
                  content="取消预约"
                  placement="top"
                >
                  <el-button
                    link
                    type="primary"
                    icon="Edit"
                    @click="handleCancel(scope.row)"
                  ></el-button>
                </el-tooltip>
              
               
               
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </el-card>
  </div>
</template>

<script setup name="BizAccountManagement">
  import { reservationAdd, reservationCancel, reservationQuery } from "@/api/system/user";
  import { checkEmail } from '@/utils/validate'
import { ElMessage } from 'element-plus'
import { getUserName } from "@/utils/auth";
import { ElMessageBox } from "element-plus";

  const { proxy } = getCurrentInstance();
  const askText = ref("无问答数据")
  const loading = ref(false);
const userList = ref([]);
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
      title: [
        { required: true, message: "邮件标题不能为空", trigger: "blur" }
      ],
      address: [
        { required: true, message: "邮件地址不能为空", trigger: "blur" },
      //   {
			// 	validator: checkEmail,
			// 	trigger: "blur",
			// }
      ],
      content: [
        { required: true, message: "邮件内容不能为空", trigger: "blur" }
      ],
    }
  });
  const { queryParams, form, rules } = toRefs(data);



  // 表单重置
  function reset() {
    form.value = {
    address: null,
    content: null,
    title: null,
    };
    proxy.resetForm("bizAccountManagementRef");
  }
  // 列显隐信息
const columns = ref([
  { key: 0, label: `用户名称`, visible: true },
  { key: 1, label: `内容`, visible: true },
  { key: 2, label: `开始时间`, visible: true },
  { key: 3, label: `结束时间`, visible: true },
]);
/** 查询用户列表 */
function getList() {
  loading.value = true;
  reservationQuery({
    username:getUserName()
  }).then(
    (res) => {
      loading.value = false;
      userList.value = res;
      total.value = res.length || 0;
    }
  );
}
getList();
function handleCancel(row) {
  console.log("row===",row)
  ElMessageBox.confirm("确定取消当前备忘预约吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      reservationCancel({
        reservationCode:row.reservationCode
      }).then(() => {
        ElMessage.success("取消成功");
        getList();
      });
    })
    .catch(() => {});
  
}





  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizAccountManagementRef"].validate(valid => {
      if (valid) {
        console.log("form===",form)
         const parmas ={
            startTime:form.value.time[0],
            endTime:form.value.time[1],
            desc:form.value.content,
          }
          reservationAdd(parmas).then(res => {
            if(res===""){
                        ElMessage.success("添加成功")
        getList();
            }else{
                ElMessage.warning("预约时间冲突，请进行调整")
            }
          }); 
      }
    });
  }



</script>
<style lang="scss" scoped>
.center {
  width: 100%;
  text-align: left;
}
</style>
