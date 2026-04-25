<template>
  <q-page :class="[$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black', 'column no-wrap overflow-hidden']" :style-fn="pageStyle">
    <div class="q-pa-md row items-center justify-between col-auto">
      <div class="row items-center">
          <q-btn flat round dense class="q-mr-sm" @click="appStore.toggleDrawer()">
            <img src="~assets/logo-icon-small.png" style="width: 32px; height: 32px;" />
          </q-btn>
          <div class="text-h5 text-weight-bold q-mr-md">TermToMD</div>
          <q-badge outline color="positive" label="100% Client-Side (Private)" class="q-py-xs" />
        </div>
        <div class="row q-gutter-sm items-center">
          <!-- Configuration Options Toggle -->
          <q-btn flat dense icon="settings" color="primary">
            <q-menu>
              <q-list style="min-width: 250px" :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'">
                <q-item-label header class="text-grey-5">Processing Options</q-item-label>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Strip ANSI Codes</q-item-label>
                    <q-item-label caption class="text-grey-5">Remove color/formatting codes</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="options.stripAnsi" color="primary" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Strip Session Noise</q-item-label>
                    <q-item-label caption class="text-grey-5">Remove "Last login" headers</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="options.stripNoise" color="primary" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Strip Terminal Frames</q-item-label>
                    <q-item-label caption class="text-grey-5">Remove vertical bars (│)</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="options.stripFrames" color="primary" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Trim Whitespace</q-item-label>
                    <q-item-label caption class="text-grey-5">Remove leading spaces from prose</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="options.trimWhitespace" color="primary" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Smart Un-wrap</q-item-label>
                    <q-item-label caption class="text-grey-5">Fix artificially broken lines</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="options.smartUnwrap" color="primary" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Format Prompts</q-item-label>
                    <q-item-label caption class="text-grey-5">Wrap commands in code blocks</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="options.formatPrompts" color="primary" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Strip Prompts</q-item-label>
                    <q-item-label caption class="text-grey-5">Remove bash/shell prompts ($, >)</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="options.stripPrompts" color="primary" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Strip Line Numbers</q-item-label>
                    <q-item-label caption class="text-grey-5">Remove gutters from code/diffs</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="options.stripLineNumbers" color="primary" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn
            color="primary"
            icon="content_copy"
            label="Copy Markdown"
            @click="copyToClipboard"
            :disable="!cleanedMarkdown"
          />
          <q-btn
            color="secondary"
            icon="download"
            label="Download .md"
            @click="downloadMarkdown"
            :disable="!cleanedMarkdown"
          />
          <q-btn
            color="negative"
            flat
            icon="delete"
            label="Clear"
            @click="clearAll"
          />
        </div>
      </div>

      <q-splitter
        v-model="splitterModel"
        :class="[$q.dark.isActive ? 'shadow-2' : 'shadow-1', 'col rounded-borders overflow-hidden q-mx-md q-mb-md']"
        :style="{ border: $q.dark.isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', width: 'auto' }"
        :limits="[20, 80]"
      >
        <template v-slot:before>
          <div :class="[$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-2', 'full-height column overflow-hidden']">
            <div :class="[$q.dark.isActive ? 'bg-grey-10 text-grey-5' : 'bg-grey-3 text-grey-8', 'q-pa-sm text-caption border-bottom']" style="flex-shrink: 0">RAW TERMINAL OUTPUT</div>
            <textarea
              v-model="rawInput"
              :class="[$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black', 'col full-width q-pa-md']"
              style="font-family: monospace; resize: none; outline: none; border: none; white-space: pre; overflow: auto; min-height: 0;"
              placeholder="Paste your mangled terminal mess here..."
            ></textarea>
          </div>
        </template>

        <template v-slot:after>
          <div :class="[$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-2', 'full-height column overflow-hidden']">
            <div :class="[$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-4', 'row items-center q-pa-none border-bottom']" style="flex-shrink: 0">
              <q-tabs v-model="rightTab" dense :active-color="$q.dark.isActive ? 'white' : 'primary'" indicator-color="primary" align="left" narrow-indicator :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-8'" no-caps>
                <q-tab name="raw" label="Raw MD" />
                <q-tab name="preview" label="Preview" />
              </q-tabs>
            </div>
            <q-tab-panels v-model="rightTab" animated class="col bg-transparent overflow-hidden" keep-alive>
              <q-tab-panel name="raw" class="q-pa-none overflow-hidden column">
                <textarea
                  readonly
                  :value="cleanedMarkdown"
                  :class="[$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black', 'col full-width q-pa-md']"
                  style="font-family: monospace; resize: none; outline: none; border: none; white-space: pre-wrap; overflow: auto; min-height: 0;"
                  tabindex="0"
                  @keydown="handlePreviewKeydown"
                ></textarea>
              </q-tab-panel>
              <q-tab-panel name="preview" class="q-pa-md scroll markdown-preview" tabindex="0" @keydown="handlePreviewKeydown">
                <div v-html="renderedHtml" style="word-wrap: break-word; overflow-wrap: break-word; min-height: 0;"></div>
              </q-tab-panel>
            </q-tab-panels>
            <div :class="[$q.dark.isActive ? 'bg-grey-9 text-grey-5' : 'bg-grey-4 text-grey-8', 'row justify-end items-center q-pa-xs text-caption']" :style="{ borderTop: $q.dark.isActive ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', flexShrink: 0, fontSize: '11px' }">
              <span class="q-mr-md" title="Lines"><q-icon name="format_list_numbered" class="q-mr-xs"/>{{ lineCount }} lines</span>
              <span class="q-mr-md" title="Words"><q-icon name="text_snippet" class="q-mr-xs"/>{{ wordCount }} words</span>
              <span class="q-mr-md" title="Characters"><q-icon name="text_fields" class="q-mr-xs"/>{{ charCount }} chars</span>
              <span class="q-mr-sm" title="Reading Time"><q-icon name="schedule" class="q-mr-xs"/>{{ readingTime }}</span>
            </div>
          </div>
        </template>
      </q-splitter>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';
import { copyToClipboard as qCopyToClipboard, useQuasar, exportFile } from 'quasar';
import { marked } from 'marked';
import { useAppStore } from 'src/stores/app';

const $q = useQuasar();
const appStore = useAppStore();

const pageStyle = (offset, height) => ({ height: `${height - offset}px` });

const rawInput = ref('');
const cleanedMarkdown = ref('');
const splitterModel = ref(50);
const rightTab = ref('raw');

const renderedHtml = computed(() => {
  return marked.parse(cleanedMarkdown.value || '_No output yet..._');
});

const wordCount = computed(() => {
  if (!cleanedMarkdown.value) return 0;
  return cleanedMarkdown.value.trim().split(/\s+/).filter(w => w.length > 0).length;
});

const charCount = computed(() => {
  return cleanedMarkdown.value.length;
});

const lineCount = computed(() => {
  if (!cleanedMarkdown.value) return 0;
  return cleanedMarkdown.value.split('\n').length;
});

const readingTime = computed(() => {
  const wordsPerMinute = 200;
  const minutes = wordCount.value / wordsPerMinute;
  if (minutes < 1) {
    return '< 1 min read';
  }
  return Math.ceil(minutes) + ' min read';
});

const options = reactive({
  stripAnsi: true,
  stripNoise: true,
  stripFrames: true,
  trimWhitespace: true,
  smartUnwrap: true,
  formatPrompts: true,
  stripLineNumbers: true,
  stripPrompts: false
});

// Regex for ANSI escape codes (constructed via fromCharCode to bypass ESLint no-control-regex)
const ansiRegex = new RegExp('[' + String.fromCharCode(27) + String.fromCharCode(155) + '][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]', 'g');

// Zsh/Bash prompts, handling arrows like ➜ or ❯, standard $, >, #, or user@machine
const promptRegex = /^(\$ |> |# |[➜❯]\s+(?:[\w./~-]+\s+)?|[\w.-]+@[\w.-]+:.*?[#$]\s+)/;

const cleanText = (text) => {
  if (!text) return '';

  // 1. Normalize line endings
  let clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  if (options.stripAnsi) {
    clean = clean.replace(ansiRegex, '');
  }

  // 1.5 Strip Terminal Noise
  if (options.stripNoise) {
    const noiseRegex = /^(?:Last login:|Welcome to .*|.*zsh: command not found:).*$/gm;
    clean = clean.replace(noiseRegex, '');
  }

  // 2. Strip Terminal Frames (the │ characters)
  if (options.stripFrames) {
    clean = clean.split('\n').map(line => {
      // Remove leading/trailing pipes if they seem to be gutter artifacts
      return line.replace(/^[ \t]*[│┃║][ \t]*/, '').replace(/[ \t]*[│┃║][ \t]*$/, '');
    }).join('\n');
  }

  const lines = clean.split('\n');
  const processedLines = [];
  
  let inCodeBlock = false;
  const lineNumberRegex = /^\s*\d+\s+/; // Matches " 80  ", "80: ", etc.

  // 3. Identify if this is a Code/Diff block
  const codeSignals = (clean.match(/[{()[\];=<>]/g) || []).length;
  // Check for diff indicators: must have both + and - lines to confidently be a diff, not just a bulleted list
  let hasPlus = false;
  let hasMinus = false;
  for (const l of lines) {
    const trimmed = l.trimStart();
    if (/^(?:\d+\s+)?\+\s/.test(trimmed)) hasPlus = true;
    if (/^(?:\d+\s+)?-\s/.test(trimmed)) hasMinus = true;
  }
  const isDiff = hasPlus && hasMinus;
  const isCode = codeSignals > (lines.length * 0.5); // Heuristic

  // If Smart Unwrap is disabled, we don't need to treat code/prose differently for merging
  if ((isCode || isDiff) && options.smartUnwrap) {
    // 4. Handle as Code: Preserve lines, strip gutters
    const cleanLines = lines.map(line => {
      let processed = line;
      if (options.stripLineNumbers) {
        // Strip line numbers: must be followed by space, pipe, or +/- to avoid breaking ordered lists (1.)
        processed = processed.replace(/^[ \t]*\d+(?:[ \t]+|[ \t]*[│|:][ \t]*|[ \t]*([-+])[ \t]+)/, (match, p1) => {
          return p1 ? p1 + ' ' : '';
        });
      }
      if (options.stripPrompts && promptRegex.test(processed.trimStart())) {
        processed = processed.replace(promptRegex, '');
      }
      return processed;
    });
    
    let lang = isDiff ? 'diff' : 'javascript';
    if (!isDiff && cleanLines.some(l => promptRegex.test(l.trimStart()))) {
        lang = 'bash';
    }
    return `\`\`\`${lang}\n${cleanLines.join('\n')}\n\`\`\``;
  }

  // 5. Handle as Prose (Your existing un-wrap logic goes here)
  for (let i = 0; i < lines.length; i++) {
    let line = options.trimWhitespace ? lines[i].trim() : lines[i].trimEnd();
    
    // Skip completely empty lines if we already have one
    if (line === '' && processedLines.length > 0 && processedLines[processedLines.length-1] === '') {
      continue;
    }

    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      processedLines.push(line);
      continue;
    }

    if (inCodeBlock) {
      processedLines.push(line);
      continue;
    }

    // Prompt Detection
    const isPromptLine = promptRegex.test(line.trimStart());
    if (isPromptLine) {
      if (options.stripPrompts) {
        line = line.replace(promptRegex, '');
      }

      if (options.formatPrompts) {
        const lastLine = processedLines.length > 0 ? processedLines[processedLines.length-1] : '';
        if (lastLine === '```') {
          processedLines.pop(); 
          processedLines.push(line);
          processedLines.push('```');
        } else {
          processedLines.push('```bash');
          processedLines.push(line);
          processedLines.push('```');
        }
        continue;
      }
    }

    // Intelligence: Don't merge if it looks like code or a diff
    const isDiffLine = /^[+-] /.test(line.trimStart());
    const looksLikeCode = /[{}]|;\s*$/.test(line) || lineNumberRegex.test(line);

    if (options.smartUnwrap && i < lines.length - 1) {
      const nextLine = lines[i+1].trimStart();
      // Only treat terminal punctuation (.!?) as hard breaks, ignoring ) or ]
      const endsWithSentenceEnder = /[.!?]$/.test(line.trimEnd());
      const nextStartsPrompt = promptRegex.test(nextLine);
      const nextIsEmpty = nextLine === '';
      const nextIsDiff = /^[+-] /.test(nextLine);
      const nextIsLineNumber = lineNumberRegex.test(nextLine);
      const isListItem = /^(?:[-*]|\d+\.)\s/.test(nextLine);

      // CRITICAL: If current or next line looks like code/diff/line-number, DO NOT MERGE
      if (!isDiffLine && !looksLikeCode && !nextIsDiff && !nextIsLineNumber && !isListItem &&
          !endsWithSentenceEnder && (!options.formatPrompts || !nextStartsPrompt) && !nextIsEmpty && 
          (line.trim().length > 40)) {
        line = line.trimEnd() + ' ' + nextLine.trimStart();
        i++; 
        lines[i] = line;
        i--;
        continue;
      }
    }

    processedLines.push(line);
  }

  return processedLines.join('\n');
};

watch([rawInput, options], () => {
  cleanedMarkdown.value = cleanText(rawInput.value);
}, { deep: true });

const handlePreviewKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === 'textarea') {
      e.target.select();
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNode(e.currentTarget.firstElementChild || e.currentTarget);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};

const copyToClipboard = async () => {
  try {
    await qCopyToClipboard(cleanedMarkdown.value);
    $q.notify({
      message: 'Markdown copied to clipboard!',
      color: 'positive',
      icon: 'content_paste'
    });
  } catch {
    $q.notify({
      message: 'Failed to copy',
      color: 'negative'
    });
  }
};

const downloadMarkdown = () => {
  const status = exportFile('termtomd.md', cleanedMarkdown.value, 'text/markdown');
  if (status !== true) {
    $q.notify({
      message: 'Browser blocked download',
      color: 'negative'
    });
  }
};

const clearAll = () => {
  rawInput.value = '';
  cleanedMarkdown.value = '';
};
</script>

<style lang="scss">
.markdown-preview {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  
  pre {
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  code {
    font-family: 'Fira Code', monospace;
    padding: 2px 4px;
    border-radius: 3px;
  }

  p {
    margin-bottom: 1em;
  }
}

body.body--dark .markdown-preview {
  pre {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
  }
  code {
    background: rgba(255,255,255,0.1);
  }
}

body.body--light .markdown-preview {
  pre {
    background: rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.1);
  }
  code {
    background: rgba(0,0,0,0.05);
  }
}

.border-bottom {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
body.body--light .border-bottom {
  border-bottom: 1px solid rgba(0,0,0,0.1);
}
</style>
