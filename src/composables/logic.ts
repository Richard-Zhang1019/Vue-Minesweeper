import type { Ref } from 'vue'
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

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'play' | 'win' | 'lost'
}

export class GamePlay {
  state = ref() as Ref<GameState>

  constructor(
    public width: number,
    public height: number,
    public minesNumber: number,
  ) {
    this.reset()
  }

  get board() {
    return this.state.value.board
  }

  get blocks() {
    return this.state.value.board.flat()
  }

  // 重置
  reset() {
    this.state.value = {
      mineGenerated: false,
      gameState: 'play',
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x): BlockState => ({
          x,
          y,
          revealed: false,
          adjacentMines: 0,
        })),
      ),
    }
  }

  randomRange(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  randomInt(min: number, max: number): number {
    return Math.round(this.randomInt(min, max))
  }

  // 检查游戏状态
  checkGameState() {
    if (!this.state.value.mineGenerated || this.state.value.gameState !== 'play')
      return
    const blocks = this.board.flat()

    if (!blocks.some(block => !block.mine && !block.revealed)) {
      this.state.value.gameState = 'win'
      alert('win')
    }
  }

  // 生成地雷
  generateMines(state: BlockState[][], initial: BlockState) {
    for (const row of state) {
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

  // 格子周围的地雷数
  updateNumbers() {
    this.board.forEach((row) => {
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
      return this.board[y2][x2]
    })
      .filter(Boolean) as BlockState[]
  }

  // 点击
  onClick(block: BlockState) {
    if (this.state.value.gameState !== 'play')
      return

    // 标记过 点击不会炸
    if (!this.state.value.mineGenerated) {
      this.generateMines(this.board, block)
      this.state.value.mineGenerated = true
    }
    block.revealed = true
    if (block.mine) {
      this.state.value.gameState = 'lost'
      this.showAllMines()
    }
    this.expendZero(block)
  }

  // 右键点击
  onRightClick(block: BlockState) {
    if (this.state.value.gameState !== 'play')
      return

    // 如果已经翻开 直接return
    if (block.revealed)
      return

    // 没有翻开 才能标记
    block.flagged = !block.flagged
  }

  showAllMines() {
    this.board.flat().forEach((item) => {
      if (item.mine)
        item.revealed = true
    })
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
