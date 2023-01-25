<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <nav text-xl mt-2>
    <button class="icon-btn mx-2 !outline-none" :title="t('button.toggle_dark')" @click="toggleDark()">
      <div i="carbon-sun dark:carbon-moon" />
    </button>

    <a class="icon-btn mx-2" rel="noreferrer" href="https://github.com/richard-zhang1019/Vue-Minesweeper" target="_blank" title="GitHub">
      <div i-carbon-logo-github />
    </a>
  </nav>
</template>
