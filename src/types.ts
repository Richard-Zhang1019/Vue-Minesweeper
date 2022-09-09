export interface BlockState {
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

export interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'play' | 'win' | 'lost'
}
