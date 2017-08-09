<template>
  <div class="home-page">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  mounted () {
    let clientW = window.innerWidth
    let clientH = window.innerHeight
    this.$refs.canvas.width = clientW
    this.$refs.canvas.height = clientH
    this.$refs.canvas.style.width = `${clientW}px`
    this.$refs.canvas.style.height = `${clientH}px`
  }
}
</script>

<style lang="scss">
.home-page {
  height: 100%;
  overflow: hidden;
}
</style>
