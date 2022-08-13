<script setup lang="ts">
import type { BlockState } from '../types'
import Block from '../components/Block.vue'

const WIDTH = 10
const HEIGHT = 10

let mineGenerated = false

const state = ref(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({
      x,
      y,
      revealed: false,
      adjacentMines: 0,
    })),
  ),
)

// 记录当前点周围地雷数
const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
]

// 生成地雷
function generateMines(initial: BlockState) {
  for (const row of state.value) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue
      block.mine = Math.random() < 0.2
    }
  }
  updateNumbers()
}

function updateNumbers() {
  state.value.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return

      getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines += 1
      })
    })
  })
}

function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined
    return state.value[y2][x2]
  })
    .filter(Boolean) as BlockState[]
}

// 点击
function onClick(block: BlockState) {
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true
  }
  block.revealed = true
  if (block.mine) {
    alert('Boom!')
    return
  }
  expendZero(block)
}

// 右键点击
function onRightClick(block: BlockState) {
  // 如果已经翻开 直接return
  if (block.revealed)
    return

  // 没有翻开 才能标记
  block.flagged = !block.flagged
}

// 展开
function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return
  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
      if (!s.flagged)
        s.revealed = true
      expendZero(s)
    }
  })
}

// 检查游戏状态
function checkGameState() {
  if (!mineGenerated)
    return
  const blocks = state.value.flat()

  if (blocks.every(block => block.revealed || block.flagged)) {
    if (blocks.some(block => block.flagged && block.mine))
      alert('You Cheat!')
    else
      alert('You Win!')
  }
}

watchEffect(checkGameState)

updateNumbers()
</script>

<template>
  <div>
    <div m-4>
      Minesweeper
    </div>
    <div
      v-for="row, y in state"
      :key="y"
      flex="~"
      items-center
      justify-center
    >
      <Block
        v-for="block, x in row"
        :key="x"
        :block="block"
        @click="onClick(block)"
        @contextmenu.prevent="onRightClick(block)"
      />
    </div>
  </div>
</template>
