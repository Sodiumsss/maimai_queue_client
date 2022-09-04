<template>
  <el-card style="text-align: center">
    <a>用户注册</a>
    <el-divider/>
    <el-input v-model="ac">
      <template #prepend>账号</template>

    </el-input>
    <el-input v-model="pw" style="margin-top:30px;">
      <template #prepend>密码</template>
    </el-input>


    <el-button @click="register" class="button">注册</el-button>
    <el-button @click="back" class="button">返回</el-button>
    <p style="font-size: small;">你可以取一些奇怪的ID，包括中文......</p>
  </el-card>
</template>

<script>
import router from "@/router";
import axios from "axios";
import qs from "qs";
import {ElMessage, ElNotification} from "element-plus";
import global from "@/components/global";
export default {
  name: "register",
  data()
{
  return{
    ac:"",
    pw:"",
  }
},
methods:{
  register(){
    if (this.ac==="" || this.pw==="")
    {
      ElMessage.error("请将账户/密码输入完整");

      return;
    }

    axios.post("http://"+global.ip+":"+global.port+"/register",qs.stringify({"acc":this.ac,"pw":this.pw})).then(res =>{

      console.log(res);

      if (res.data===-1)
      {
        ElMessage.error("请尝试更换账户");
      }
      else
      {
        ElNotification.success("注册成功");
        router.push("/login");
      }
    })
  },
  back()
  {
    router.back();
  }
}

}
</script>

<style scoped>
.button{
  margin-top: 20px;
}
</style>
