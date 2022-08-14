<script setup lang="ts">
import Block from '../components/Block.vue'
import { GamePlay } from '../composables/logic'

const play = new GamePlay(12, 12)
const state = play.state
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
