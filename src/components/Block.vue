<script setup lang="ts">
import { isDev } from '../composables/constant'
import type { BlockState } from '~/types'

defineProps<{ block: BlockState }>()

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

function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/10'

  if (!block.revealed)
    return 'bg-gray-500/10 hover:bg-gray-500/20'
  return block.mine ? 'text-red-500/50' : numbersColor[block.adjacentMines]
}
</script>

<template>
  <button
    w-10 h-10
    m="0.5"
    flex="~"
    items-center
    justify-center
    border="1 gray-400/10"
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine />
      <div v-else font-600>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>
