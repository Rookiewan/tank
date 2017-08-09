<template>
  <div class="home-page">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import Engine from '@/model/Engine'
import Tank from '@/model/Tank'
export default {
  data () {
    return {
      options: {},
      bg: {
        canvas: null,
        ctx: null
      },
      clientW: window.innerWidth,
      clientH: window.innerHeight
    }
  },
  created () {
    this.genBgCanvas()
  },
  mounted () {
    let canvas = this.$refs.canvas
    canvas.width = this.clientW
    canvas.height = this.clientH
    canvas.style.width = `${this.clientW}px`
    canvas.style.height = `${this.clientH}px`
    // tank
    let tank = new Tank(this.bg, {
      width: 30,
      height: 30
    })
    let engine = new Engine(canvas, this.options)
    engine.start(ctx => {
      // 绘制背景
      this.updateCtx(ctx, () => {
        ctx.fillStyle = '#007EC6'
        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.fill()
      })
      this.updateCtx(ctx, () => {
        ctx.translate((canvas.width - tank.width) / 2, canvas.height - tank.height)
        ctx.drawImage(tank.bg, 0, 0, tank.width, tank.height)
      })
    })
  },
  methods: {
    updateCtx (ctx, cb = () => {}) {
      ctx.save()
      cb()
      ctx.restore()
    },
    genBgCanvas () {
      // bg canvas
      this.bg.canvas = document.createElement('canvas')
      this.bg.canvas.width = this.clientW
      this.bg.canvas.height = this.clientH
      this.bg.canvas.style.width = `${this.clientW}px`
      this.bg.canvas.style.height = `${this.clientH}px`
      this.bg.ctx = this.bg.canvas.getContext('2d')
      // tank
      let tankW = 30
      let tankH = 30
      this.updateCtx(this.bg.ctx, () => {
        this.bg.ctx.beginPath()
        this.bg.ctx.moveTo(0, tankH)
        this.bg.ctx.lineTo(0, tankH / 3)
        this.bg.ctx.lineTo(tankW / 3, tankH / 3)
        this.bg.ctx.lineTo(tankW / 3, 0)
        this.bg.ctx.lineTo(tankW * 2 / 3, 0)
        this.bg.ctx.lineTo(tankW * 2 / 3, tankH / 3)
        this.bg.ctx.lineTo(tankW, tankH / 3)
        this.bg.ctx.lineTo(tankW, tankH)
        this.bg.ctx.lineTo(tankW * 2 / 3, tankH)
        this.bg.ctx.lineTo(tankW * 2 / 3, tankH * 2 / 3)
        this.bg.ctx.lineTo(tankW / 3, tankH * 2 / 3)
        this.bg.ctx.lineTo(tankW / 3, tankH)
        this.bg.ctx.closePath()
        this.bg.ctx.fillStyle = '#fff'
        this.bg.ctx.fill()
      })
    }
  }
}
</script>

<style lang="scss">
.home-page {
  height: 100%;
  overflow: hidden;
}
</style>
