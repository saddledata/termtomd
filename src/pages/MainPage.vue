<template>
  <q-page class="bg-dark text-white column window-height no-wrap overflow-hidden">
    <div class="q-pa-md row items-center justify-between col-auto">
      <div class="row items-center">
          <q-icon name="terminal" size="2em" color="primary" class="q-mr-sm" />
          <div class="text-h5 text-weight-bold q-mr-md">TermToMD</div>
          <q-badge outline color="positive" label="100% Client-Side (Private)" class="q-py-xs" />
        </div>
        <div class="row q-gutter-sm items-center">
          <!-- Configuration Options Toggle -->
          <q-btn flat dense icon="settings" color="primary">
            <q-menu>
              <q-list style="min-width: 250px" class="bg-dark text-white">
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
                    <q-item-label>Strip Terminal Frames</q-item-label>
                    <q-item-label caption class="text-grey-5">Remove vertical bars (│)</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="options.stripFrames" color="primary" />
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
        class="col shadow-2 rounded-borders overflow-hidden q-mx-md q-mb-md"
        style="border: 1px solid rgba(255,255,255,0.1); width: auto;"
        :limits="[20, 80]"
      >
        <template v-slot:before>
          <div class="full-height column overflow-hidden">
            <div class="q-pa-sm bg-grey-10 text-caption text-grey-5 border-bottom" style="flex-shrink: 0">RAW TERMINAL OUTPUT</div>
            <textarea
              v-model="rawInput"
              class="col full-width q-pa-md bg-dark text-white"
              style="font-family: monospace; resize: none; outline: none; border: none; white-space: pre; overflow: auto; min-height: 0;"
              placeholder="Paste your mangled terminal mess here..."
            ></textarea>
          </div>
        </template>

        <template v-slot:after>
          <div class="full-height column bg-grey-10 overflow-hidden">
            <div class="row items-center q-pa-none bg-grey-9 border-bottom" style="flex-shrink: 0">
              <q-tabs v-model="rightTab" dense active-color="white" indicator-color="primary" align="left" narrow-indicator class="text-grey-5" no-caps>
                <q-tab name="preview" label="Preview" />
                <q-tab name="source" label="Source" />
              </q-tabs>
            </div>
            <q-tab-panels v-model="rightTab" animated class="col bg-transparent overflow-hidden" keep-alive>
              <q-tab-panel name="preview" class="q-pa-md scroll markdown-preview" tabindex="0" @keydown="handlePreviewKeydown">
                <div v-html="renderedHtml" style="word-wrap: break-word; overflow-wrap: break-word; min-height: 0;"></div>
              </q-tab-panel>
              <q-tab-panel name="source" class="q-pa-none overflow-hidden column">
                <textarea
                  readonly
                  :value="cleanedMarkdown"
                  class="col full-width q-pa-md bg-dark text-white"
                  style="font-family: monospace; resize: none; outline: none; border: none; white-space: pre-wrap; overflow: auto; min-height: 0;"
                  tabindex="0"
                  @keydown="handlePreviewKeydown"
                ></textarea>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </template>
      </q-splitter>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';
import { copyToClipboard as qCopyToClipboard, useQuasar, exportFile } from 'quasar';
import MarkdownIt from 'markdown-it';

const $q = useQuasar();
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const rawInput = ref('');
const cleanedMarkdown = ref('');
const splitterModel = ref(50);
const rightTab = ref('preview');

const options = reactive({
  stripAnsi: true,
  stripFrames: true,
  smartUnwrap: true,
  formatPrompts: true,
  stripLineNumbers: true,
  stripPrompts: false
});

// Regex for ANSI escape codes (constructed via fromCharCode to bypass ESLint no-control-regex)
const ansiRegex = new RegExp('[' + String.fromCharCode(27) + String.fromCharCode(155) + '][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]', 'g');

const cleanText = (text) => {
  if (!text) return '';

  // 1. Normalize line endings
  let clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  if (options.stripAnsi) {
    clean = clean.replace(ansiRegex, '');
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
  const promptRegex = /^(\$ |> |[\w.-]+@[\w.-]+[:~][\w./-]*[$#] )/;
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
    let line = lines[i].trimEnd();
    
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
    const looksLikeCode = /[;{}()[\]]/.test(line) || lineNumberRegex.test(line);

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

const renderedHtml = computed(() => {
  return md.render(cleanedMarkdown.value || '_No output yet..._');
});

const handlePreviewKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === 'textarea') {
      e.target.select();
    } else {
      const selection = window.getSelection();
      const range = document.createRange();
      // Select the actual wrapper div containing the HTML to better capture list styles in some browsers
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
    background: rgba(0,0,0,0.3);
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  code {
    font-family: 'Fira Code', monospace;
    background: rgba(255,255,255,0.1);
    padding: 2px 4px;
    border-radius: 3px;
  }

  p {
    margin-bottom: 1em;
  }
}

.border-bottom {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
</style>
