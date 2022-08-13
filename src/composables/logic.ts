import type { BlockState } from '../types'

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

export class GamePlay {
  WIDTH = 10
  HEIGHT = 10
  state: ref<BlockState[][]>([])

  constructor(public width: number, public height: number,){
    watchEffect(this.checkGameState)
    this.reset()
  }

  // 重置
  reset(){
    this.state.value = Array.from({ length: this.HEIGHT }, (_, y) =>
    Array.from({ length: this.WIDTH }, (_, x): BlockState => ({
      x,
      y,
      revealed: false,
      adjacentMines: 0,
    })),
  ),
  }

  // 检查游戏状态
  checkGameState() {
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

  // 生成地雷
 generateMines(initial: BlockState) {
  for (const row of this.state.value) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue
      block.mine = Math.random() < 0.2
    }
  }
  this.updateNumbers()
}

 updateNumbers() {
  this.state.value.forEach((row, y) => {
    row.forEach((block, x) => {
      if (block.mine)
        return

      this.getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines += 1
      })
    })
  })
}

 getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= this.WIDTH || y2 < 0 || y2 >= this.HEIGHT)
      return undefined
    return this.state.value[y2][x2]
  })
    .filter(Boolean) as BlockState[]
}
}
