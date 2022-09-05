<template>

  <el-container>
    <el-header>
      <el-card style="text-align: center;">

        <el-row justify="end">

          <el-col :span="8"></el-col>
          <el-col :span="8">
            <div>
              欢迎，<a v-if="kind==='1'">玩家</a><a v-if="kind==='2'">管理员</a><a v-if="kind==='3'">超级管理员</a>
              {{acc}}
            </div>
          </el-col>

          <el-col :span="8">
            <el-button @click="exit_acc('xixi')" style="float: right">登出</el-button>
          </el-col>

        </el-row>

      </el-card>
    </el-header>
    <el-main>
      <el-card style="text-align: center">



        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              当前状态
              <el-divider/>
              <div v-if="this.acc_index===-1">
                <a>未排队</a>
              </div>
              <div v-if="this.acc_index!==-1">
                <div v-if="this.acc_index>2">
                  <a>排队中</a>
                  <br>
                  <a>第{{this.acc_index}}名</a>
                </div>


                <a v-if="this.acc_index<=2">上机中</a>




              </div>
              <el-divider/>
              <el-button ><el-icon><Message /></el-icon>&nbsp;广域轰炸</el-button>
              <el-button ><el-icon><MessageBox /></el-icon>&nbsp;收信箱</el-button>


            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <el-space direction="vertical">
                <el-button v-if="this.acc_index===-1" @click="pushQueue"><a>排队</a></el-button>
                <el-button v-if="this.acc_index!==-1" @click="exit_queue"><a>取消</a></el-button>

                <el-button v-if="this.acc_index!==-1 && this.acc_index<=2" @click="balanceQueue"><a>下机</a></el-button>
                <el-button v-if="this.kind>1" @click="balanceQueue"><a>强制下机</a></el-button>
                <el-button @click="op_add" v-if="this.kind==='3'">添加OP</el-button>
                <el-button @click="op_delete" v-if="this.kind==='3'">撤销OP</el-button>
                <el-button v-if="this.kind==='3'" @click="clear"><a>清空</a></el-button>


              </el-space>

            </el-card>
          </el-col>
        </el-row>

      </el-card>

      <el-card style="margin-top: 10px;">

        <el-scrollbar max-height="400px">
          <div v-for="(item,index) in this.queue" :key="item" >

            <p v-if="item===this.acc" class="scrollbar-demo-item-self">{{index+1}}.{{ item }}(你)</p>
            <p v-if="index>1 && item!==this.acc" class="scrollbar-demo-item-waiting">{{index+1}}.{{ item }}</p>
            <p v-if="index<=1  && item!==this.acc" class="scrollbar-demo-item-playing">{{index+1}}.{{ item }}</p>

          </div>
        </el-scrollbar>
      </el-card>
    </el-main>



  </el-container>

</template>

<script>
import 'element-plus/theme-chalk/display.css';
import router from "@/router";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import axios from "axios";
import qs from "qs";
import global from "@/components/global";

const Base64 = require('js-base64').Base64
const server_url="http://"+global.ip+":"+global.port;


export default {
  name: "home",
  data()
  {
    return{
      acc:"",//账号
      info:"",//公告
      ws:null,//websocket
      acc_index:-1,//位置
      queue:[],//队列
      kind:-1,//账号类型
      state:-1,//websocket连接状态
    }
  },
  watch:{
    state:function (n){
      if (n===3)
      {
        ElMessage.error({message:"连接已丢失，尝试重新连接",duration:1500});
        this.CreateWebsocket(this);
      }
      if (n===1)
      {

        ElMessage.success({message:"与服务器连接成功",duration:1500});
        let data ={type:1}
        this.ws.send(JSON.stringify(data));
      }
    },
    '$route'(to){
      if (to.name==="404")
      {
        this.ws.close();
      }
    }
  }
  ,
  mounted() {
    switch (Math.floor(Math.random()*(3))+1)
    {
      case 1:
        document.title="(￣▽￣)／";
        break;
      case 2:
        document.title="(^_−)☆";
        break;
      case 3:
        document.title="o(´^｀)o";
    }



    if (!(this.$cookies.isKey("name") && this.$cookies.isKey("kind") && this.$cookies.isKey("password")))
    {
      ElNotification.error("你还没有登录");
      this.$cookies.remove("name");
      this.$cookies.remove("password");
      this.$cookies.remove("kind");
      router.push("/login");
    }
    else
    {
      this.check_modify();
      this.acc=Base64.decode(this.$cookies.get("name"));
      this.kind=Base64.decode(this.$cookies.get("kind"));
      this.CreateWebsocket(this);
      setInterval(()=>{
        this.state=this.ws.readyState;
      },500);
    }


  },
  methods:{
    strict_action()
    {
      if (global.strict)
      {
        this.check_modify();
      }
    },
    check_modify()
    {
      axios.post("http://"+global.ip+":"+global.port+"/check",qs.stringify(
          {"acc":Base64.decode(this.$cookies.get("name"))
            ,"pw":Base64.decode(this.$cookies.get("password"))
            ,"kind":Base64.decode(this.$cookies.get("kind"))})).then(res=>{
        if (res.data===1)
        {
          console.log("验证成功");
        }
        else
        {
          console.log("验证失败");
          ElMessage.error("你的Cookies出了一些问题，请重新登录");
          this.exit_acc();
        }
      })
    }
    ,
    check_socket()
    {
      return this.ws.readyState === 1;
    },
    pushQueue(){

      this.strict_action();

      if (this.check_socket())
      {
        let posted = {type:2,index:1,name:this.acc};
        this.sendJSON(posted);
        //console.log("尝试加入队列");
      }else
      {
        ElMessage.error("操作失败，请尝试刷新页面/联系管理员");
      }


    },
    exit_queue(){
      this.strict_action();

      if (this.check_socket())
      {
        let posted = {type:2,index:2,name:this.acc};
        this.sendJSON(posted);
        //console.log("尝试退出队列");
      }
      else {
        ElMessage.error("操作失败，请尝试刷新页面/联系管理员");

      }
    },
    op_add()
    {
      this.strict_action();

      if (this.check_socket())
      {
        ElMessageBox.prompt("请输入要升级为OP的用户名","提示",).then(({value})=>{
          axios.post(server_url+"/op_add",qs.stringify({"name":value})).then(res =>{
            console.log(res);

            if (res.data!==-1)
            {
              ElMessage.success("已升级为OP");
              //此处应通知被添加人刷新
            }
            else
            {
              ElMessage.error("服务器操作失败");
            }
          });
        })
      }
      else{
        ElMessage.error("操作失败");
      }

    },
    op_delete()
    {
      this.strict_action();

      if (this.check_socket())
      {
        ElMessageBox.prompt("请输入要降级为玩家的用户名","提示",).then(({value})=>{
          axios.post(server_url+"/op_delete",qs.stringify({"name":value})).then(res =>{
            //console.log(res);
            if (res.data!==-1)
            {
              ElMessage.success("已降级为玩家");
              //此处应通知被降级人刷新
            }
            else
            {
              ElMessage.error("服务器操作失败");
            }
          });
        })
      }else{ElMessage.error("操作失败");}
    },
    exit_acc(kind)
    {
      if (kind!==undefined)
      {
        ElMessage.success("已登出")
      }

      this.$cookies.remove("name");
      this.$cookies.remove("kind");
      this.$cookies.remove("password");
      this.ws.close();
      router.push("/login");
    },
    balanceQueue()
    {
      this.strict_action();

      if (this.check_socket())
      {
        const posted={type:2,index:3};
        this.sendJSON(posted);
      }
      else{ElMessage.error("操作失败");}


    },
    CreateWebsocket(my)
    {

      this.ws=new WebSocket("ws://"+global.ip+":"+global.port+"/socket/"+this.acc);
      this.ws.onmessage=function (e)
      {
        let received=JSON.parse(e.data);
        console.log(received)

        let receivedType=received.type;

        switch (receivedType)
        {
          case 1://type(1)，data(公告)
            my.info=received.data;
            ElNotification(
                {
                  title:"公告",
                  message:received.data,
                  type:'info',
                  duration:0,
                }
            )
            const posted ={type:3,index:1};
            my.sendJSON(posted);
            break;
          case 2://type(2)，status(true/false)
            let status=received.status;
            if (status===false)
            {//type2操作失败
              //console.log("操作失败");
            }
            else if (status===true)
            {//type2操作成功
              //console.log("操作成功，向服务器发送广播请求");
              const posted={type:3,index:2};
              my.sendJSON(posted);
            }
            break;
          case 3:
            //console.log("收到队列数据");
            while(my.queue.length!==0)
            {
              my.queue.pop();
            }
            for (let i=0;i<received.data.length;i++)
            {
              my.queue.push(received.data[i]);
            }

            my.acc_index=-1;
            for (let i=0;i<my.queue.length;i++)
              {
                if (my.queue[i]===Base64.decode(my.$cookies.get("name")))
                {
                  my.acc_index=i+1;
                  return;
                }
              }
            break;

        }
      };


    },
    clear(){
      this.strict_action();

      if (this.check_socket())
      {
        const posted={type:2,index:4};
        this.sendJSON(posted);
      }
      else
      {
        ElMessage.error("操作失败");
      }

    },
    sendJSON(msg)
    {
      this.ws.send(JSON.stringify(msg));
    },
  }
}
</script>

<style scoped>

.scrollbar-demo-item-playing {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-success);
}

.scrollbar-demo-item-self {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-danger);
}

.scrollbar-demo-item-waiting {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
