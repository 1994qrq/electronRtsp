<template>
  <fileAreaVue ref="fileChild"></fileAreaVue>
</template>

<script setup lang="ts">
import fileAreaVue from '../components/layout/fileArea.vue'
import { ref } from 'vue'

const fileChild = ref()
</script>
