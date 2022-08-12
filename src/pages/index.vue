<script setup lang="ts">
interface BlockState {
  // x坐标
  x: number
  // y坐标
  y: number
  // 是否被翻开
  revealed: boolean
  // 是否是地雷
  mine?: boolean
  // 是否被标记
  flagged?: boolean
  // 周边地雷数量
  adjacentMines: number
}

const WIDTH = 10
const HEIGHT = 10
const state = reactive(
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

// 生成数字颜色
const numbersColor = [
  'text-transparent',
  'text-green-500',
  'text-blue-500',
  'text-yellow-500',
  'text-orange-500',
  'text-red-500',
  'text-purple-500',
  'text-pink-500',
  'text-teal-500',
]

// 生成地雷
function generateMines() {
  for (const row of state) {
    for (const block of row)
      block.mine = Math.random() < 0.3
  }
}

function updateNumbers() {
  state.forEach((row, y) => {
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
    return state[y2][x2]
  })
    .filter(Boolean) as BlockState[]
}

function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return ''
  return block.mine ? 'text-red-500' : numbersColor[block.adjacentMines]
}

// 点击
function onClick(block: BlockState) {
  block.revealed = true
}

generateMines()
updateNumbers()
</script>

<template>
  <div>
    <!-- <div>{{ state }}</div> -->
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
      <button
        v-for="block, x in row"
        :key="x"
        w-10 h-10
        m="0.5"
        hover:bg-gray
        flex="~"
        items-center
        justify-center
        border
        :class="getBlockClass(block)"
        @click="onClick(block)"
      >
        <div v-if="block.mine" i-mdi-mine />
        <div v-else>
          {{ block.adjacentMines }}
        </div>
      </button>
    </div>
  </div>
</template>
