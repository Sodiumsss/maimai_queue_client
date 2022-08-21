<template>

    <el-card style="text-align: center">
      <a>用户登录</a>
      <el-divider/>
      <el-input v-model="ac">
        <template #prepend>账号</template>

      </el-input>
      <el-input v-model="pw" style="margin-top:30px;">
        <template #prepend>密码</template>
      </el-input>
      <el-button @click="login" class="button">登录</el-button>

      <el-button @click="go_register" class="button">注册</el-button>
    </el-card>



</template>

<script>
import router from "@/router";
import axios from "axios";
import qs from "qs";
import {ElMessage, ElNotification} from "element-plus";
import global from "@/components/global";
export default {
  name: "login",
  data()
  {
    return{
      ac:"",
      pw:"",
    }
  },
  methods: {
    login(){
      axios.post("http://"+global.ip+":6324/login",qs.stringify({"acc":this.ac,"pw":this.pw})).then(res =>{

        console.log(res);
        if (res.data===-1)
        {
          ElMessage.error("请检查账户/密码是否输入正确！");
        }
        else
        {
          ElNotification({type:"success", message:"登录成功！",offset:60,duration:600});
          this.$cookies.set("login",this.ac,-1 );
          this.$cookies.set("kind",res.data,-1);
          router.push("/home");
        }
      })
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