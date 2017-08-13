<template>
  <div class="home-page">
    <canvas ref="canvas"></canvas>
    <div class="control-panel">
      <div
        class="direction"
        ref="direction"
        @touchstart="onHandleDirTouchStart"
        @touchmove="onHandleDirTouchMove"
        @touchend="onHandleDirTouchEnd"
      >
        <div class="rocker"></div>
      </div>
    </div>
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
      maxEnemiesCount: 3,
      existEnemiesCount: 0,
      player1: {
        controller: {
          el: null,
          rocker: null,
          holded: false,
          originX: 0,
          originY: 0,
          startX: 0,
          startY: 0,
          dir: 0
        }
      }
    }
  },
  created () {
    this.genBgCanvas()
    this.genEnemies(20)
  },
  mounted () {
    this.player1.controller.el = this.$refs.direction
    this.player1.controller.rocker = this.$refs.direction.querySelector('.rocker')
    let rockerPos = this.player1.controller.rocker.getBoundingClientRect()
    this.player1.controller.originX = rockerPos.left + rockerPos.width / 2
    this.player1.controller.originY = rockerPos.top + rockerPos.height / 2
    let canvas = this.$refs.canvas
    canvas.width = this.clientW
    canvas.height = this.clientH
    canvas.style.width = `${this.clientW}px`
    canvas.style.height = `${this.clientH}px`
    canvas.style.backgroundColor = '#007EC6'
    // player1
    let player1 = new Tank(this.bg, {
      width: 30,
      height: 30,
      color: '#fff',
      isRole: true
    })
    player1.x = (canvas.width - player1.width) / 2
    player1.y = canvas.height - player1.height
    player1.born()
    let engine = new Engine(canvas, this.options)
    engine.start(ctx => {
      // 绘制背景
      this.updateCtx(ctx, () => {
        ctx.fillStyle = '#007EC6'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })
      this.updateCtx(ctx, () => {
        this.enemies.map(enemy => {
          if (this.existEnemiesCount < this.maxEnemiesCount && !enemy.show) {
            this.existEnemiesCount++
            enemy.born()
          }
          if (enemy.show) {
            // let _deltaDis = enemy.speed
            // 边界检测
            enemy.checkImpact(this.enemies.concat([player1]), () => {
              enemy.changeDir()
            })
            ctx.drawImage(enemy.entity, enemy.x, enemy.y, enemy.width, enemy.height)
          }
          enemy.AiLevel()
        })
      })
      this.updateCtx(ctx, () => {
        // ctx.translate((canvas.width - player1.width) / 2, canvas.height - player1.height)
        ctx.drawImage(player1.entity, player1.x, player1.y, player1.width, player1.height)
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
    },
    onHandleDirTouchStart (e) {
      this.player1.controller.holded = true
      this.player1.controller.startX = e.touches[0].clientX
      this.player1.controller.startY = e.touches[0].clientY
    },
    onHandleDirTouchMove (e) {
      let moveX = e.touches[0].clientX - this.player1.controller.startX
      let moveY = e.touches[0].clientY - this.player1.controller.startY
      let angle = Math.floor(Math.atan2(-moveY, moveX) * 180 / Math.PI)
      let _dis = Math.floor(Math.sqrt(Math.pow(moveX, 2) + Math.pow(moveY, 2)))
      if (_dis >= 100) {
        if (angle > 45 && angle <= 135) {
          // up
          this.player1.controller.dir = 1
        } else if (angle > 135 || angle <= -135) {
          // left
          this.player1.controller.dir = 4
        } else if (angle > -135 && angle <= -45) {
          // down
          this.player1.controller.dir = 3
        } else if ((angle > -45 && angle <= 0) || (angle >= 0 && angle <= 45)) {
          // right
          this.player1.controller.dir = 2
        }
      }
      this.player1.controller.rocker.style.transform = `translate3d(0, 0, 0)`
    },
    onHandleDirTouchEnd (e) {
      this.player1.controller.holded = false
    }
  }
}
</script>

<style lang="scss">
.home-page {
  height: 100%;
  overflow: hidden;
  .control-panel {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 200px;
    z-index: 3;
  }
  .direction {
    position: absolute;
    width: 150px;
    height: 150px;
    top: 25px;
    left: 30px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .6);
  }
  .rocker {
    position: absolute;
    width: 40px;
    height: 40px;
    left: 50%;
    top: 50%;
    margin: -20px 0 0 -20px;
    background-color: #fff;
    border-radius: 50%;
  }
}
</style>
