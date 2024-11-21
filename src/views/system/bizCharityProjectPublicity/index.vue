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
              />
          </el-form-item>
          <el-form-item label="备忘内容" prop="content">
            <el-input v-model="form.content" type="textarea" placeholder="请输入备忘内容" />
          </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup name="BizAccountManagement">
  import { mailSend } from "@/api/system/user";
  import { checkEmail } from '@/utils/validate'
import { ElMessage } from 'element-plus'

  const { proxy } = getCurrentInstance();
  const askText = ref("无问答数据")
  const loading = ref(false);

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




  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["bizAccountManagementRef"].validate(valid => {
      if (valid) {
         const parmas ={
            content:form.value.content,
            subject:form.value.title,
            to:form.value.address,
          }
          mailSend(parmas).then(res => {
            // if(res==="success"){
            //   ElMessage.success("邮件发送成功了，请注意查收")
            //   reset()
            // }
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
