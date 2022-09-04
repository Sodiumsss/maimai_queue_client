<template>
  <router-view/>

</template>

<script>
import router from "@/router";

export default {
  name: "index",
  data()
  {
    return{

    }
  },
  mounted() {
    this.check();
  },
  methods:{
    check(){
      if (this.$cookies.isKey("name") && this.$cookies.isKey("kind") && this.$cookies.isKey("password"))
      {
        router.push("/home");
      }
      else
      {
        this.$cookies.remove("name");
        this.$cookies.remove("kind");
        this.$cookies.remove("password");
        router.push("/login");
      }
    },


  },
}
</script>

<style scoped>

</style>
