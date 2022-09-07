<template>

</template>

<script>
const ip = "127.0.0.1";
const port="6324";
const strict=true;//当设置为true，客户端websocket的任何（每一次）操作都会与服务端进行一次验证。否则只是在进入Home页面时做一次校验。
export default {
  ip,
  port,
  strict,
}
</script>

<style scoped>

</style>
