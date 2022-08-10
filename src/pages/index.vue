<script setup lang="ts">
interface BlockState {
  // x坐标
  x: number
  // y坐标
  y: number
  // 是否被翻开
  revealed?: boolean
  // 是否是地雷
  mine?: boolean
  // 是否被标记
  flagged?: boolean
  // 周边地雷数量
  adjacentMines?: number
}

const WIDTH = 10
const HEIGHT = 10
const state = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({
      x, y,
    })),
  ),
)

// 生成地雷
function generateMines() {
  for (const row of state) {
    for (const block of row)
      block.mine = Math.random() < 0.1
  }
}

// 点击
function onClick(x: number, y: number) {
  console.log(x, y)
}

generateMines()
</script>

<template>
  <div>
    <div m-4>
      Minesweeper
    </div>
    <div
      v-for="row, y in state"
      :key="y"
    >
      <button
        v-for="item, x in row"
        :key="x"
        w-10 h-10
        hover:bg-gray
        border
        @click="onClick(x, y)"
      >
        {{ item.mine ? 'X' : '-' }}
      </button>
    </div>
  </div>
</template>
