<script setup lang="ts">
import { m } from 'vitest/dist/index-3f764034'
import Block from '../components/Block.vue'
import { GamePlay } from '../composables/logic'
import { isDev, toggleDev } from '../composables/constant'

const play = new GamePlay(10, 10, 20)
useStorage('vue-minesweeper', play.state)
const state = computed(() => play.board)

watchEffect(() => {
  play.checkGameState()
})

const mineCount = () => {
  return play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0) - (b.flagged ? 1 : 0), 0)
}

function newGame(diffculty: 'easy' | 'medium' | 'hard') {
  switch (diffculty) {
    case 'easy':
      play.reset(10, 10, 10)
      break
    case 'medium':
      play.reset(15, 15, 25)
      break
    case 'hard':
      play.reset(20, 20, 40)
      break
  }
}
</script>

<template>
  <div w-full overflow-auto>
    <div m-4>
      Minesweeper
    </div>
    <div>
      <button m-3 btn @click="newGame('easy')">
        Easy
      </button>
      <button m-3 btn @click="newGame('medium')">
        Medium
      </button>
      <button m-3 btn @click="newGame('hard')">
        Hard
      </button>
    </div>
    <div
      flex="~"
      items-center
      justify-center
      flex-col
    >
      <div
        v-for="row, y in state"
        :key="y"
        flex="~"
        items-center
        justify-center
        w-max
      >
        <Block
          v-for="block, x in row"
          :key="x"
          :block="block"
          @click="play.onClick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>
  </div>
  <div m-2>
    remaining mines : {{ mineCount() }}
  </div>
  <div>
    <button m-3 w-25 btn @click="toggleDev()">
      {{ isDev ? 'DEV' : 'NORMAL' }}
    </button>
    <button m-3 btn @click="play.reset()">
      RESET
    </button>
  </div>
</template>
