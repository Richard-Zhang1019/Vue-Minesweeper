<script setup lang="ts">
import Block from '../components/Block.vue'
import { GamePlay } from '../composables/logic'

const play = new GamePlay(10, 10, 30)
useStorage('vue-minesweeper', play.state)
const state = computed(() => play.board)

watchEffect(() => {
  play.checkGameState()
})

const mineCount = () => {
  return play.blocks.reduce((a, b) => a + (b.mine ? 1 : 0), 0)
}
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
        @click="play.onClick(block)"
        @contextmenu.prevent="play.onRightClick(block)"
      />
    </div>
  </div>
  <div>Count: {{ mineCount() }}</div>
  <div>
    <button m-3 btn @click="play.reset()">
      RESET
    </button>
  </div>
</template>
