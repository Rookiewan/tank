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
      clientH: window.innerHeight,
      enemies: [],
      maxEnemiesCount: 5,
      existEnemiesCount: 0
    }
  },
  created () {
    this.genBgCanvas()
    this.genEnemies(20)
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
      height: 30,
      color: '#fff'
    })
    tank.born()
    let engine = new Engine(canvas, this.options)
    engine.start(ctx => {
      // 绘制背景
      this.updateCtx(ctx, () => {
        ctx.fillStyle = '#007EC6'
        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.fill()
      })
      this.updateCtx(ctx, () => {
        this.enemies.map(enemy => {
          if (this.existEnemiesCount < this.maxEnemiesCount && !enemy.show) {
            this.existEnemiesCount++
            enemy.born()
          }
          if (enemy.show) {
            let _deltaDis = enemy.speed
            // 边界检测
            if ((enemy.x - _deltaDis <= 0 && enemy.dir === 4) ||
              (enemy.y - _deltaDis <= 0 && enemy.dir === 1) ||
              (enemy.x + enemy.width + _deltaDis >= canvas.width && enemy.dir === 2) ||
              (enemy.y + enemy.height + _deltaDis >= canvas.height && enemy.dir === 3)
            ) {
              enemy.changeDir()
            }
            // 碰撞检测，未实现
            switch (enemy.dir) {
              case 1:
                // up
                enemy.y -= _deltaDis
                break
              case 2:
                // right
                enemy.x += _deltaDis
                break
              case 3:
                // down
                enemy.y += _deltaDis
                break
              case 4:
                // left
                enemy.x -= _deltaDis
                break
              default:
            }
            ctx.drawImage(enemy.entity, enemy.x, enemy.y, enemy.width, enemy.height)
          }
        })
      })
      this.updateCtx(ctx, () => {
        ctx.translate((canvas.width - tank.width) / 2, canvas.height - tank.height)
        ctx.drawImage(tank.entity, 0, 0, tank.width, tank.height)
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
    },
    genEnemies (num) {
      for (let i = 0; i < num; i++) {
        this.enemies.push(new Tank(this.bg, {
          width: 30,
          height: 30
        }))
      }
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
