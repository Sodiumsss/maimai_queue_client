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
      if (this.$cookies.isKey("login") && this.$cookies.isKey("kind"))
      {
        router.push("/home")
      }
      else
      {
        this.$cookies.remove("login");
        this.$cookies.remove("kind")
        router.push("/login")
      }
    },


  },
}
</script>

<style scoped>

</style>