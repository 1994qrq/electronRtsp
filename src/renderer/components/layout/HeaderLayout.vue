<script setup lang="tsx">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const titleKey: any = computed(() => {
  return route?.meta?.titleKey || 'title.main'
})

const handleRoute = (path: string): void => {
  router.push(path)
}

const isCurrentRoute = (path: string): boolean => {
  return path === route.path
}

const closeWindow = (): void => {
  ElMessageBox.confirm(`您确认要退出程序吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // @ts-ignore
      window.mainApi.send('appQuit')
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: '您取消了',
      // })
    })
}
</script>
<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-title>{{ $t(titleKey) }}</v-app-bar-title>
    <template #append>
      <v-btn
        prepend-icon="mdi-home"
        variant="text"
        :class="{ active: isCurrentRoute('/') }"
        @click="handleRoute('/')"
      >
        {{ $t('title.main') }}
      </v-btn>
      <v-btn
        prepend-icon="mdi-fit-to-screen-outline"
        variant="text"
        :class="{ active: isCurrentRoute('/second') }"
        @click="handleRoute('/second')"
      >
        {{ $t('title.second') }}
      </v-btn>
      <v-btn
        prepend-icon="mdi-location-exit"
        variant="text"
        :class="{ active: true }"
        @click="closeWindow()"
      >
        {{ $t('title.exit') }}
      </v-btn>
    </template>
  </v-app-bar>
</template>
<style scoped>
.v-btn {
  opacity: 0.4;
}

.active {
  opacity: 1 !important;
}
</style>
