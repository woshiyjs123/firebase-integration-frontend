<template>
  <div class="login_1">
    <div class="login-opacity">
      <div class="login_o">
        <div class="title">慈善网站管理系统</div>
        <div class="login_b">
          <div class="login_in">
            <el-form
              ref="form"
              :model="formInfo"
              @keyup.enter="submitHandle()"
              :rules="formRules"
            >
              <el-form-item label="账号" prop="username">
                <el-input v-model="formInfo.username" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  type="password"
                  v-model="formInfo.password"
                  placeholder="请输入"
                />
              </el-form-item>
              <el-form-item
                label=""
                prop="checkAgre"
                v-if="isRegister"
                class="agre_item"
              >
                <el-checkbox
                  class="agreement"
                  v-model="formInfo.checkAgre"
                ></el-checkbox
                >我已阅读并同意<span class="agre">用户条款</span>和<span
                  class="agre"
                  >隐私协议</span
                >
              </el-form-item>
            </el-form>
            <div class="comit" @click="commit">
              {{ !isRegister ? "确定" : "立即注册" }}
            </div>
            <div class="bot_tip" v-if="isRegister">
              已有账号？<span @click="changeForm">立即登录</span>
            </div>
            <!-- <div class="bot_tip" v-else>
              还没有账号？<span @click="changeForm">立即注册</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from "@/store/modules/user";
import { ref, computed } from "vue";
import router from "@/router";

const userStore = useUserStore();
const route = useRoute();
const { proxy } = getCurrentInstance();

const formInfo = ref({
  username: "admin",
  password: "admin123",
  rememberMe: false,
  code: "",
  uuid: "",
});

// const formInfo = ref({
//   username: "",
//   password: "",
//   name: "amei",
//   confirmPassword: "",
//   sourceType: 1, //管理端登录需要校验角色
//   checkAgre: false,
// });
const formRules = ref({
  username: { required: true, message: "请输入账号", trigger: "blur" },
  password: { required: true, message: "请输入密码", trigger: "blur" },
  confirmPassword: { required: true, message: "请确认密码", trigger: "blur" },
  checkAgre: {
    validator: (rule, val, callback) => {
      console.log(rule.message);
      val ? callback() : callback(new Error(rule.message));
    },
    message: "请勾选协议",
    trigger: "change",
  },
});

const redirect = ref(undefined);

watch(
  route,
  (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect;
  },
  { immediate: true }
);

const form = ref(null);
const isRegister = ref(false);

const changeForm = () => {
  isRegister.value = !isRegister.value;
  form.value.resetFields([
    "accout",
    "password",
    "comfirmPassword",
    "checkAgre",
  ]);
};

const commit = async () => {
  proxy.$refs.form.validate((valid) => {
    if (valid) {
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (formInfo.value.rememberMe) {
        Cookies.set("username", formInfo.value.username, { expires: 30 });
        Cookies.set("password", encrypt(formInfo.value.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", formInfo.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore.login(formInfo.value).then(() => {
        const query = route.query;
        const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
        router.push({ path: redirect.value || "/", query: otherQueryParams });
      });
    }
  });
};
</script>

<style lang="scss">
.login_1 {
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background: url("../assets/images/login_bg.png") no-repeat center / cover;
  position: relative;
  .login_o {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
  }
  .login-opacity {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    background: rgba(0, 0, 0, 0.4);
  }
  .title {
    opacity: 1;
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    margin-bottom: 20px;
  }
  .login_b {
    margin: 0 auto;
    opacity: 1;
    border: 10px solid rgba(255, 255, 255, 0.4);
    display: flex;
    width: 468px;
    border-radius: 20px;
    overflow: hidden;
  }
  .login_in {
    width: 468px;
    background: #ffffff;
    padding: 40px 35px 40px;
  }
  .el-form-item {
    display: block;
    margin-bottom: 16px;
  }
  .el-form label.el-form-item__label {
    text-align: left;
    padding-right: 0;
    font-size: 16px;
    font-weight: bold;
    color: #1e1e1e;
  }
  .agreement,
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #8d9095;
    font-size: 14px;
    margin-right: 10px;
  }
  .agre {
    color: #1e1e1e;
    text-decoration: underline;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #1e1e1e;
    border-color: #1e1e1e;
  }
  .el-input__wrapper {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .comit {
    width: 380px;
    height: 50px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1e1e1e;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.08);
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    margin: 34px 0 24px;
    cursor: pointer;
  }
  .bot_tip {
    opacity: 1;
    font-size: 16px;
    line-height: 24px;
    color: #8d8d8d;
    text-align: center;
    span {
      color: #1e1e1e;
      font-weight: bold;
      cursor: pointer;
    }
  }
  .agre_item {
    color: #8d9095;
  }
}
</style>
