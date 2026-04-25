<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="appStore.drawerOpen"
      bordered
      :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'"
      :width="300"
    >
      <q-scroll-area class="fit">
        <div v-if="!appStore.showCheatSheet" class="q-pa-md">
          <div class="text-h6 q-mb-md">Settings</div>
          <q-list>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Dark Mode</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle :model-value="$q.dark.isActive" @update:model-value="$q.dark.toggle()" color="primary" />
              </q-item-section>
            </q-item>
            <q-separator spaced />
            <q-item clickable v-ripple @click="appStore.showCheatSheet = true">
              <q-item-section avatar>
                <q-icon name="help_outline" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Markdown Cheat Sheet</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div v-else class="q-pa-md cheat-sheet">
          <div class="row items-center q-mb-sm">
            <q-btn flat round dense size="sm" icon="arrow_back" @click="appStore.showCheatSheet = false" class="q-mr-sm" />
            <div class="text-subtitle2 text-weight-bold">Cheat Sheet</div>
          </div>
          
          <div class="text-caption q-gutter-y-sm">
            <div>
              <strong>Bold</strong><br>
              <code>**text**</code>
            </div>
            <div>
              <em>Italic</em><br>
              <code>*text*</code>
            </div>
            <div>
              <del>Strikethrough</del><br>
              <code>~~text~~</code>
            </div>
            <div>
              <h1>Header 1</h1>
              <code># Header 1</code>
            </div>
            <div>
              <h2>Header 2</h2>
              <code>## Header 2</code>
            </div>
            <div>
              <a href="#">Link</a><br>
              <code>[title](https://url)</code>
            </div>
            <div>
              <ul><li>Item 1</li><li>Item 2</li></ul>
              <code>- Item 1<br>- Item 2</code>
            </div>
            <div>
              <ol><li>Item 1</li><li>Item 2</li></ol>
              <code>1. Item 1<br>2. Item 2</code>
            </div>
            <div>
              <blockquote>Blockquote</blockquote>
              <code>> Blockquote</code>
            </div>
            <div>
              <code>Code</code><br>
              <code>`code`</code>
            </div>
            <div>
              <pre>Code block</pre>
              <code>```bash<br>Code block<br>```</code>
            </div>
          </div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer :class="$q.dark.isActive ? 'bg-dark text-grey-5' : 'bg-white text-grey-7'" class="text-center q-pa-sm" style="border-top: 1px solid rgba(128,128,128,0.2)">
      <div>Brought to you by the team at <a href="https://saddledata.com" target="_blank" class="text-primary" style="text-decoration: none;">saddledata.com</a></div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAppStore } from 'src/stores/app'

const $q = useQuasar()
const appStore = useAppStore()

onMounted(() => {
  $q.dark.set(true)
})
</script>

<style scoped>
.cheat-sheet h1, .cheat-sheet h2 {
  font-size: 1.1em;
  margin: 0;
  line-height: 1.2;
}
.cheat-sheet blockquote {
  margin: 0;
  padding-left: 8px;
  border-left: 3px solid rgba(128,128,128,0.5);
}
.cheat-sheet pre {
  margin: 0;
}
.cheat-sheet ul, .cheat-sheet ol {
  margin: 0;
  padding-left: 20px;
}
</style>
