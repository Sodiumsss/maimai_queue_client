<template>
  <div @keyup.enter="login">

    <el-card  style="text-align: center">
      <a>用户登录</a>

      <el-divider/>
      <el-input v-model="ac">
        <template #prepend>账号</template>

      </el-input>
      <el-input  v-model="pw" style="margin-top:30px;">
        <template #prepend>密码</template>
      </el-input>


      <el-row justify="center">
        <el-button  @click="login" :loading="login_state" class="button">登录</el-button>

        <el-button  @click="go_register" class="button">注册</el-button>


        <el-tooltip placement="right">
          <template #content>
            程序使用Cookies来存储你的信息，<br/>请用排卡页面内"登出"来重新登录账号。
          </template>
          <span class="button">
          <el-icon ><Warning /></el-icon>
        </span>
        </el-tooltip>
      </el-row>






      <div v-show="show_info">
        <el-divider></el-divider>
        <p>Coder:
          <a href="https://space.bilibili.com/621726">{{ coder }}</a>
        </p>
        <p>Email:
          <a href="javascript:void(0)" @click="copy_email">{{email}}</a>
        </p>
      </div>


    </el-card>


  </div>


</template>

<script>
import router from "@/router";
import axios from "axios";
import qs from "qs";
import {ElMessage} from "element-plus";
import global from "@/components/global";
document.title="你怎么又来出勤了！";
const Base64 = require('js-base64').Base64
export default {
  name: "login",
  data()
  {
    return{
      ac:"",
      pw:"",
      login_state:false,
      email:"sodiumsss@foxmail.com",
      coder:"Sodiums",
      show_info:true,//是否显示信息，可email/coder可设置为管理员联系方式
    }
  },
  methods: {
    login(){
      this.login_state=true;
      axios.post("http://"+global.ip+":"+global.port+"/login",qs.stringify({"acc":this.ac,"pw":this.pw}),{timeout:5000}).then(res =>{
        console.log(res);
        this.login_state=false;
        if (res.data===-1)
        {
          ElMessage.error("请检查账户/密码是否输入正确");

        }
        else
        {

          this.$cookies.set("name",Base64.encode(this.ac) ,-1);
          this.$cookies.set("password",Base64.encode(this.pw),-1);
          this.$cookies.set("kind",Base64.encode(res.data),-1);
          router.push("/home");
        }
      }).catch(err =>{
        this.login_state=false;
        ElMessage.error("与账号服务器连接超时")
      })
    },
    copy_email()
  {
    if (navigator.clipboard && window.isSecureContext)
    {
      navigator.clipboard.writeText(this.email);
      ElMessage.success("已将邮箱复制至剪贴板");
    }
    else
    {
      ElMessage.info("请手动复制邮箱");

    }

  },
    go_register(){
      router.push("/register")
    }
  }
}
</script>

<style scoped>

.button{
  margin-top: 20px;
}


</style>
