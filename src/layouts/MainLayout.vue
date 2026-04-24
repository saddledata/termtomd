<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark text-grey-5 text-center q-pa-sm" style="border-top: 1px solid rgba(255,255,255,0.1)">
      <div>Brought to you by the team at <a href="https://saddledata.com" target="_blank" class="text-primary" style="text-decoration: none;">saddledata.com</a></div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

onMounted(() => {
  $q.dark.set(true)
})
</script>
