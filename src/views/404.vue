<template>
<el-card >
  <h1 style="text-align: center;">∑(っ°Д°;)っ啊喔，你好像走丢了？</h1>

  <el-row justify="center"> <el-link @click="index" type="primary">点我回去</el-link></el-row>

</el-card>
</template>

<script>
import router from "@/router";

export default {
  name: "404",
  mounted() {
      document.title="やだ😩"

  },
  methods:{
    index()
    {
      router.push("/");
    }
  },

}

</script>

<style scoped>

</style>
