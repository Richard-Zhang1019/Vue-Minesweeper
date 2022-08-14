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
  state = ref<BlockState[][]>([])
  mineGenerated = false

  constructor(
    public width: number,
    public height: number,
  ) {
    this.reset()
    // watchEffect(this.checkGameState)
  }

  // 重置
  reset() {
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width }, (_, x): BlockState => ({
        x,
        y,
        revealed: false,
        adjacentMines: 0,
      })),
    )
  }

  // 检查游戏状态
  checkGameState() {
    console.log(this.mineGenerated)
    if (this.mineGenerated === false)
      return
    const blocks = this.state.value.flat()
    if (!blocks.some(block => !block.flagged && !block.mine))
      alert('You Win!')
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
    this.state.value.forEach((row) => {
      row.forEach((block) => {
        if (block.mine)
          return

        this.getSiblings(block).forEach((item) => {
          if (item.mine)
            block.adjacentMines += 1
        })
      })
    })
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.height || y2 < 0 || y2 >= this.width)
        return undefined
      return this.state.value[y2][x2]
    })
      .filter(Boolean) as BlockState[]
  }

  // 点击
  onClick(block: BlockState) {
    // 标记过 点击不会炸
    if (!this.mineGenerated) {
      this.generateMines(block)
      this.mineGenerated = true
    }
    block.revealed = true
    if (block.mine) {
      alert('Boom!')
      return
    }
    this.expendZero(block)
  }

  // 右键点击
  onRightClick(block: BlockState) {
    // 如果已经翻开 直接return
    if (block.revealed)
      return

    // 没有翻开 才能标记
    block.flagged = !block.flagged
  }

  // 展开
  expendZero(block: BlockState) {
    if (block.adjacentMines)
      return
    this.getSiblings(block).forEach((s) => {
      if (!s.revealed) {
        if (!s.flagged)
          s.revealed = true
        this.expendZero(s)
      }
    })
  }
}
