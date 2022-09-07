<template>
  <el-container>
    <el-main style="padding: 2px 15px 15px 15px;">
      <!--菜单-->
      <el-tabs @tab-click="changeMenu" v-model="active">
        <el-tab-pane label="排卡" name="排卡"/>

         <el-tab-pane label="聊天" name="聊天"/>


      </el-tabs>

      <!--排卡功能-->
      <div v-if="now_menu===1">
        <el-card style="text-align: center">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card>
                你好，{{acc}}
                <el-divider class="divider"/>
                <div v-if="this.acc_index===-1">

                  <a v-if="card_queue.length>0">未排队</a>
                  <a v-if="card_queue.length===0">无人排队</a>


                </div>
                <div v-if="this.acc_index!==-1">
                  <div v-if="this.acc_index>2">
                    <a>排队中</a><br><a>第{{this.acc_index}}名</a>
                  </div>


                  <a v-if="this.acc_index<=2">上机中</a>

                </div>
                <el-divider class="divider"/>
                <el-space direction="vertical">




                  <el-button ><el-icon><Shop /></el-icon>商店</el-button>
                  <el-button @click="exitAcc('0')" ><el-icon><CloseBold /></el-icon>登出</el-button>
                </el-space>




              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <el-space direction="vertical">
                  <el-button v-if="this.acc_index===-1" @click="pushQueue"><a>排队</a></el-button>
                  <el-button v-if="this.acc_index!==-1" @click="exitQueue"><a>取消</a></el-button>

                  <el-button v-if="this.acc_index!==-1 && this.acc_index<=2" @click="balanceQueue"><a>下机</a></el-button>
                  <el-button v-if="this.kind>1" @click="balanceQueue"><a>强制下机</a></el-button>
                  <el-button @click="addOp" v-if="this.kind==='3'">添加OP</el-button>
                  <el-button @click="deleteOp" v-if="this.kind==='3'">撤销OP</el-button>
                  <el-button v-if="this.kind==='3'" @click="clearQueue"><a>清空</a></el-button>


                </el-space>

              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <!--聊天-->
      <div v-if="now_menu===2">
        <el-card>
          <el-scrollbar height="300px" id="textBar" >
            <div style="margin-bottom: 10px;" v-for="item in this.text_queue">
                <el-space style="margin-bottom: 5px;">
                  <el-avatar shape="circle" :size="'small'" :src='default_avatar'/>
                  <a v-if="item.name!==acc">{{item.name}}</a>
                  <a v-if="item.name===acc">{{item.name}}(你)</a>

                  <div style="margin-left: 2px;">
                    <el-icon><Clock /></el-icon>
                    <a>{{item.time}}</a>

                  </div>


                </el-space>
                <el-row>
                  <el-col :span="1"></el-col>
                  <el-col :span="22">
                    <el-card>{{item.text}}</el-card>

                  </el-col>
                </el-row>
            </div>
          </el-scrollbar>
          <el-divider class="divider"/>
          <el-input resize="none" type="textarea" :rows="3" v-model="send_text" placeholder="说点什么吧！"></el-input>
          <el-row style="margin-top: 7px;" justify="end">

            <el-button @click="clearText">清空</el-button>
            <el-button v-if="countDown===-1" @click="sendText(this.acc,this.send_text)">发送</el-button>
            <el-button v-if="countDown!==-1" disabled>请等待{{5-countDown}}秒</el-button>


          </el-row>

        </el-card>
      </div>

      <!--排卡板-->
      <el-card v-if="card_queue.length>0" style="margin-top: 10px;">

        <el-scrollbar max-height="400px">
          <div v-for="(item,index) in this.card_queue" :key="item" >

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
import {ElMessage, ElMessageBox, ElNotification, ElScrollbar} from "element-plus";
import axios from "axios";
import qs from "qs";
import global from "@/components/global";
import {ref} from "vue";


const Base64 = require('js-base64').Base64
const server_url="http://"+global.ip+":"+global.port;
let cdTimer=null;


export default {
  name: "home",
  data()
  {
    return{
      acc:"",//账号
      kind:-1,//账号类型
      info:"",//公告
      ws:null,//websocket
      state:-1,//websocket连接状态
      acc_index:-1,//排卡位置
      card_queue:[],//排卡队列
      text_queue:[],//文本队列
      now_menu:1,//选中的菜单
      send_text:"",//要发送的文本
      active:ref('排卡'),//引用
      default_avatar:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',//默认头像
      countDown:-1,//发送文本倒计时
    }
  },
  watch:{
    state:function (n){
      if (n===3)
      {
        ElMessage.error({message:"连接已丢失，尝试重新连接",duration:1500});
        this.createWebsocket(this);
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

    //检查cookies是否存在
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
      //检查cookies是否被修改
      this.checkModify();

      this.acc=Base64.decode(this.$cookies.get("name"));
      this.kind=Base64.decode(this.$cookies.get("kind"));
      this.createWebsocket(this);
      setInterval(()=>{
        this.state=this.ws.readyState;
      },500);
    }



  },
  methods:{
    strictAction()
    {
      if (global.strict)
      {
        this.checkModify();
      }
    },
    checkModify()
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
          this.exitAcc();
        }
      })
    },
    checkSocket()
    {
      return this.ws.readyState === 1;
    },
    changeMenu(tab)
    {
      if (tab.props.name==="聊天")
      {
       this.now_menu=2;
      }
      else if (tab.props.name==="排卡" )
      {
        this.now_menu=1;
      }
      console.log(tab);
    },
    pushQueue()
    {

      this.strictAction();

      if (this.checkSocket())
      {
        let posted = {type:2,index:1,name:this.acc};
        this.sendJSON(posted);
        //console.log("尝试加入队列");
      }else
      {
        ElMessage.error("操作失败，请尝试刷新页面/联系管理员");
      }


    },
    exitQueue()
    {
      this.strictAction();

      if (this.checkSocket())
      {
        let posted = {type:2,index:2,name:this.acc};
        this.sendJSON(posted);
        //console.log("尝试退出队列");
      }
      else {
        ElMessage.error("操作失败，请尝试刷新页面/联系管理员");

      }
    },
    addOp()
    {
      this.strictAction();

      if (this.checkSocket())
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
    deleteOp()
    {
      this.strictAction();

      if (this.checkSocket())
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
    exitAcc(kind)
    {
      if (kind!==undefined)
      {
        ElMessage.success({message:"已登出",duration:1500});
      }

      this.$cookies.remove("name");
      this.$cookies.remove("kind");
      this.$cookies.remove("password");
      this.ws.close();
      router.push("/login");
    },
    balanceQueue()
    {
      this.strictAction();

      if (this.checkSocket())
      {
        const posted={type:2,index:3};
        this.sendJSON(posted);
      }
      else{ElMessage.error("操作失败");}


    },
    createWebsocket(my)
    {
      this.ws=null;
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
                });

            let posted ={type:3,index:1};
            my.sendJSON(posted);
            posted ={type:4,index:1};
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
            while(my.card_queue.length!==0)
            {
              my.card_queue.pop();
            }
            for (let i=0;i<received.data.length;i++)
            {
              my.card_queue.push(received.data[i]);
            }

            my.acc_index=-1;
            for (let i=0;i<my.card_queue.length;i++)
              {
                if (my.card_queue[i]===Base64.decode(my.$cookies.get("name")))
                {
                  my.acc_index=i+1;
                  return;
                }
              }
            break;
          case 4:
            my.text_queue=received.data;
            console.log(my.text_queue);

            break;

        }
      };


    },
    clearQueue()
    {
      this.strictAction();

      if (this.checkSocket())
      {
        const posted={type:2,index:4};
        this.sendJSON(posted);
      }
      else
      {
        ElMessage.error("操作失败");
      }

    },
    clearText()
    {
      this.send_text="";
    },
    sendJSON(msg)
    {
      this.ws.send(JSON.stringify(msg));
    },
    sendText(name, text)
    {
      this.strictAction();
      if (this.checkSocket())
      {
        if (text==="")
        {
          ElMessage.error("请不要发送空文本");
          return;
        }
        this.countDown=0;
        const date=new Date();
        const time=(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        const userText={name:name,text:text,time:time};
        const posted={type:4,index:2,userText:userText};
        //console.log(posted);
        this.sendJSON(posted);
        ElMessage.success("发送成功");
        document.getElementById('textBar').scrollTop=9999;
        this.clearText();
        this.createCd(this);
      }
      else
      {
        ElMessage.error("发送失败");
      }
    },
    createCd(my)
    {
      cdTimer=setInterval(function ()
      {
        my.countDown++;
        if (my.countDown===5)
        {
          console.log("可以再次发送消息");
          my.countDown=-1;
          clearInterval(cdTimer);
        }
      },1000);
    }
  }
}
</script>

<style scoped>
.divider
{
  margin-top: 10px;
  margin-bottom: 10px;
}

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
