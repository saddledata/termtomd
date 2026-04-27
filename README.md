# TermToMD (termtomd)

**TermToMD** is a specialized tool designed to clean up messy terminal output and convert it into clean, readable Markdown. It's particularly useful for documentation, blog posts, or sharing terminal sessions without the "noise" of ANSI codes, gutters, or broken line wraps.

## 🚀 Key Features

-   **100% Client-Side:** All processing happens in your browser. Your terminal data never touches a server.
-   **ANSI Code Stripping:** Removes all color and formatting escape sequences.
-   **Smart Un-wrap:** Intelligently merges lines that were artificially broken by terminal width constraints.
-   **Session Noise Removal:** Automatically strips "Last login" headers and shell welcome messages.
-   **Terminal Frame Cleanup:** Removes vertical bars (`│`) and gutters often found in formatted output.
-   **Prompt Formatting:** Automatically detects shell prompts (`$`, `➜`, etc.) and wraps commands in code blocks.
-   **Gutter/Line Number Stripping:** Removes line numbers from code snippets or diffs.

## 📖 How to Use

1.  **Paste:** Paste your raw terminal output into the left-hand panel.
2.  **Configure:** Click the **Settings (gear icon)** to toggle processing options:
    -   Enable **Smart Un-wrap** to fix prose lines broken by your terminal window.
    -   Enable **Format Prompts** to turn shell commands into `bash` code blocks.
    -   Enable **Strip ANSI** to get rid of raw color codes.
3.  **Refine:** Switch to the **Raw MD** tab on the right to manually edit the resulting Markdown using the formatting toolbar.
4.  **Export:** Use the **Copy Markdown** button or **Download .md** to save your cleaned-up content.

## 🛠 Development

### Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode
```bash
quasar dev
```

### Build for production
```bash
quasar build
```

## ⚖️ License
MIT
