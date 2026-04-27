<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer v-model="appStore.drawerOpen" bordered
      :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'" :width="300">
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
            <q-btn flat round dense size="sm" icon="arrow_back" @click="appStore.showCheatSheet = false"
              class="q-mr-sm" />
            <div class="text-subtitle2 text-weight-bold">Cheat Sheet</div>
          </div>

          <div class="text-caption q-gutter-y-sm">
            <q-list bordered padding>
              <q-item-label header>Styling</q-item-label>
              <q-item>
                <q-item-section>
                  <q-item-label><strong>Bold</strong></q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>**text**</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label><em>Italic</em></q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>*text*</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label><del>Strikethrough</del></q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>~~text~~</code></q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />
              <q-item-label header>Headers</q-item-label>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <h1>Header 1</h1>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code># Header 1</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <h2>Header 2</h2>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>## Header 2</code></q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />
              <q-item-label header>Lists & Links</q-item-label>
              <q-item>
                <q-item-section>
                  <q-item-label><a href="#" class="text-primary" style="text-decoration: none;">Link</a></q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>[title](url)</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <ul class="q-pl-md q-my-none">
                      <li>Item 1</li>
                      <li>Item 2</li>
                    </ul>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>- Item 1<br>- Item 2</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <ol class="q-pl-md q-my-none">
                      <li>Item 1</li>
                      <li>Item 2</li>
                    </ol>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>1. Item 1<br>2. Item 2</code></q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />
              <q-item-label header>Blocks</q-item-label>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <blockquote>Quote</blockquote>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>> Quote</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label><code>Code</code></q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>`code`</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <pre class="q-ma-none">Code<br>Block</pre>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>```bash<br>Code<br>Block<br>```</code></q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />
              <q-item-label header>Advanced</q-item-label>
              <q-item>
                <q-item-section>
                  <q-item-label><q-icon name="image" size="sm" class="q-mr-xs" color="grey-6" /> Image</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>![alt](url)</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <ul class="q-my-none" style="list-style: none; padding-left: 0; margin-bottom: 0;">
                      <li><input type="checkbox" checked disabled> Done</li>
                      <li><input type="checkbox" disabled> Todo</li>
                    </ul>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>- [x] Done<br>- [ ] Todo</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Horizontal Rule</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>---</code></q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Table</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label><code>| A | B |<br>|---|---|<br>| 1 | 2 |</code></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>



          </div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer :class="$q.dark.isActive ? 'bg-dark text-grey-5' : 'bg-white text-grey-7'" class="text-center q-pa-sm"
      style="border-top: 1px solid rgba(128,128,128,0.2)">
      <div class="row items-center justify-center q-gutter-x-md">
        <div>Brought to you by the team at <a href="https://saddledata.com" target="_blank" class="text-primary"
            style="text-decoration: none;">saddledata.com</a></div>
        <q-separator vertical inset />
        <a href="https://github.com/saddledata/termtomd" target="_blank"
          :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'" style="text-decoration: none;">
          <q-icon name="img:https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg" size="xs" class="q-mr-xs"
            :style="$q.dark.isActive ? 'filter: invert(1)' : ''" />
          GitHub
        </a>
        <q-separator vertical inset />
        <q-btn flat dense no-caps size="sm" color="primary" label="Feedback" @click="showFeedback = true" />
      </div>
    </q-footer>

    <q-dialog v-model="showFeedback">
      <q-card style="min-width: 350px" :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white text-black'">
        <q-card-section class="row items-center">
          <div class="text-h6">Send Feedback</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit="submitFeedback">
          <q-card-section class="q-gutter-y-md">
            <q-input v-model="feedbackForm.name" label="Name" dense outlined required :dark="$q.dark.isActive" />
            <q-input v-model="feedbackForm.email" label="Email" type="email" dense outlined required
              :dark="$q.dark.isActive" />
            <q-input v-model="feedbackForm.message" label="Message" type="textarea" dense outlined required
              :dark="$q.dark.isActive" />
          </q-card-section>

          <q-card-actions align="right" class="q-pb-md q-pr-md">
            <q-btn flat label="Cancel" color="grey" v-close-popup />
            <q-btn type="submit" color="primary" label="Submit" :loading="submitting" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useAppStore } from 'src/stores/app'

const $q = useQuasar()
const appStore = useAppStore()

const showFeedback = ref(false)
const submitting = ref(false)
const feedbackForm = reactive({
  name: '',
  email: '',
  message: ''
})

const submitFeedback = async () => {
  submitting.value = true

  const formData = new FormData()
  formData.append("access_key", "6e750e35-3a4e-4a8c-8502-9614b4fd21fe")
  formData.append("name", feedbackForm.name)
  formData.append("email", feedbackForm.email)
  formData.append("message", feedbackForm.message)
  formData.append("subject", "TermToMD Feedback")

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      $q.notify({
        color: 'positive',
        message: 'Feedback sent successfully!',
        icon: 'check'
      })
      showFeedback.value = false
      feedbackForm.name = ''
      feedbackForm.email = ''
      feedbackForm.message = ''
    } else {
      $q.notify({
        color: 'negative',
        message: 'Error: ' + (data.message || 'Could not send feedback')
      })
    }
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Something went wrong. Please try again.'
    })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  $q.dark.set(true)
})
</script>

<style scoped>
.cheat-sheet h1,
.cheat-sheet h2 {
  font-size: 1.1em;
  margin: 0;
  line-height: 1.2;
}

.cheat-sheet blockquote {
  margin: 0;
  padding-left: 8px;
  border-left: 3px solid rgba(128, 128, 128, 0.5);
}

.cheat-sheet pre {
  margin: 0;
}

.cheat-sheet ul,
.cheat-sheet ol {
  margin: 0;
  padding-left: 20px;
}
</style>
