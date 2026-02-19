# Cursor Cheatsheet — What to Know

Quick reference for using Cursor effectively.

---

## ⌨️ Essential Shortcuts

| Action | Mac Shortcut | What it does |
|--------|--------------|--------------|
| **Open AI Chat (Composer)** | `Cmd + I` | Open the AI panel to ask questions or request code |
| **Terminal** | `Cmd + J` | Show/hide the bottom panel (where terminal lives) |
| **New Terminal** | `Ctrl + \`` | Open a new terminal tab |
| **Command Palette** | `Cmd + Shift + P` | Run any command by name |
| **Quick Open File** | `Cmd + P` | Jump to a file by typing its name |
| **Toggle Sidebar** | `Cmd + B` | Show/hide the left sidebar (files, search, etc.) |
| **Save** | `Cmd + S` | Save current file |
| **Markdown Preview** | `Cmd + Shift + V` | Preview a .md file as formatted text |

---

## 🤖 AI Features

| Feature | How to use |
|---------|------------|
| **Composer (Chat)** | `Cmd + I` — Ask questions, request edits, get explanations |
| **Inline Edit (Cursor Tab)** | Start typing, hit `Tab` to accept AI suggestion |
| **@ Mention** | In chat, type `@` + filename (e.g. `@Hero.tsx`) to reference that file |
| **@ Folder** | Type `@src/components` to point AI at a whole folder |
| **Fix / Explain** | Highlight code, right-click → "Edit with AI" or ask in chat |

---

## 📁 Panels & Views

| Panel | What it shows | Toggle |
|-------|---------------|--------|
| **Explorer** | File tree | Click folder icon in left sidebar |
| **Source Control** | Git status, staged changes, commit | Click branch icon in left sidebar |
| **Terminal** | Run commands | `Cmd + J`, then click Terminal tab |
| **Search** | Find text across files | `Cmd + Shift + F` |
| **Composer** | AI chat | `Cmd + I` |

---

## 🔍 Common Tasks

| Task | How to do it |
|------|--------------|
| **Find a file** | `Cmd + P` → type filename |
| **Find text in files** | `Cmd + Shift + F` → type search term |
| **Stage all changes** | Source Control → click `+` next to "Changes" |
| **Commit** | Source Control → type message → click checkmark |
| **Push** | Source Control → `...` menu → Push |
| **Refresh sidebar** | Click elsewhere and back, or `Cmd + B` twice |
| **Split editor** | Right-click file tab → "Split Right" |
| **Close tab** | `Cmd + W` |

---

## 📌 Tips

- **@ in chat** — Use `@filename` so the AI knows which file you mean
- **Be specific** — "Add a loading state to RoutePlanner" works better than "fix it"
- **Source Control** — Stage → Commit → Push. Don't commit `node_modules` or `.env.local`
- **Terminal** — Make sure you're in the right folder (`cd stillrio-website`) before running `npm` commands
- **Preview Markdown** — `Cmd + Shift + V` turns raw .md into readable formatted text

---

## 🚫 If Something Breaks

| Problem | Try this |
|---------|----------|
| Sidebar disappeared | `Cmd + B` |
| Terminal gone | `Cmd + J`, then click Terminal tab |
| Can't save | Check for "overwrite" conflict → choose Don't Save or Overwrite |
| AI not responding well | Be more specific, or @ mention the file |
| Port in use | Kill process: `lsof -ti:3000 \| xargs kill -9` |

---

## One-Liner Recap

**Cursor = VS Code + AI.** Use `Cmd + I` to chat, `Cmd + J` for terminal, `Cmd + B` for sidebar, and `@file` in chat to reference files.
