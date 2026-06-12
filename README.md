# File Hash Generator

A browser-based web application for generating and verifying cryptographic hashes from text and files. Built with React, TypeScript, and Vite, it provides a graphical interface and a simulated interactive terminal for users who want a command-line-style experience without leaving the browser.

All hashing is performed **client-side** using [CryptoJS](https://github.com/brix/crypto-js). Files never leave the user's device.

---

## Screenshots

> Screenshots are not included yet. Add them to `docs/screenshots/` and update the paths below.

| Home | Hash Generator | Hash Verification | Interactive Terminal |
|------|----------------|-------------------|----------------------|
| ![Home dashboard](docs/screenshots/home.png) | ![Hash generator](docs/screenshots/hash-generator.png) | ![Hash verification](docs/screenshots/verify-hash.png) | ![Interactive terminal](docs/screenshots/terminal.png) |

**Suggested captures:**
- `docs/screenshots/home.png` — Main dashboard with navigation cards
- `docs/screenshots/hash-generator.png` — File or text hash generation view
- `docs/screenshots/verify-hash.png` — Hash verification result (match / mismatch)
- `docs/screenshots/terminal.png` — Interactive terminal with sample commands

---

## Features

- **Text hashing** — Generate hashes from plain text input
- **File hashing** — Upload any file type and compute its hash
- **Image hashing** — Dedicated flow for image files with MIME-type validation
- **Video hashing** — Dedicated flow for video files with MIME-type validation
- **Hash verification** — Compare a file against a known reference hash (case-insensitive)
- **Algorithm selection** — Choose from five supported hash algorithms
- **Interactive terminal** — Simulated CLI with Linux/Windows-style prompts for hash operations
- **Responsive UI** — Card-based navigation layout built with Tailwind CSS
- **Client-side processing** — File reading via the FileReader API; no backend required

---

## Supported Hash Algorithms

| Algorithm   | GUI (Forms) | Interactive Terminal |
|-------------|:-----------:|:--------------------:|
| MD5         | ✅          | ✅                   |
| SHA-1       | ✅          | ✅                   |
| SHA-256     | ✅          | ✅                   |
| SHA-512     | ✅          | ✅                   |
| RIPEMD-160  | ✅          | ✅*                  |

\* The terminal `help` command lists MD5, SHA1, SHA256, and SHA512 explicitly, but RIPEMD160 is supported through the same CryptoJS integration used in the GUI.

---

## Tech Stack

| Category        | Technology                          |
|-----------------|-------------------------------------|
| Framework       | React 18                            |
| Language        | TypeScript 5                        |
| Build tool      | Vite 5                              |
| Routing         | React Router DOM 6                  |
| Styling         | Tailwind CSS 3                      |
| Cryptography    | crypto-js 4                         |
| Icons           | Lucide React                        |
| Linting         | ESLint 9 + TypeScript ESLint        |

---

## Project Structure

```
file-hash-generator/
├── src/
│   ├── components/
│   │   ├── HashGenerator.tsx      # Text, file, image, and video hash generation
│   │   ├── VerifyHash.tsx         # Reference hash verification
│   │   └── InteractiveTerminal.tsx # Simulated CLI for hash operations
│   ├── types/
│   │   └── index.ts               # Shared TypeScript types and interfaces
│   ├── App.tsx                    # Router setup and main navigation
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Tailwind CSS directives
├── docs/
│   └── screenshots/               # Project screenshots (add before publishing)
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── eslint.config.js
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (included with Node.js)

---

## Installation

```bash
git clone https://github.com/<your-username>/file-hash-generator.git
cd file-hash-generator
npm install
```

---

## Running the Project

### Development server

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Usage Guide

### Dashboard

The home screen displays six navigation cards:

1. **Generar Hash de Texto** (`/texto`) — Hash plain text
2. **Generar Hash de Archivo** (`/archivo`) — Hash any file
3. **Generar Hash de Imagen** (`/imagen`) — Hash image files only
4. **Generar Hash de Video** (`/video`) — Hash video files only
5. **Verificar Hash** (`/verificar`) — Verify a file against a reference hash
6. **Terminal Interactiva** (`/terminal`) — Use CLI-style commands

### Generating a hash (GUI)

1. Select a hash type from the dashboard.
2. Choose the desired algorithm (default: SHA-256).
3. Enter text or upload a file.
4. Click **Generate Hash**.
5. Copy the displayed hash from the result panel.

### Verifying a hash

1. Open **Verificar Hash**.
2. Select the hash algorithm used to create the reference hash.
3. Choose the file type filter (Any, Image, or Video).
4. Paste the reference hash.
5. Upload the file to verify.
6. Click **Verify Hash** — a green or red result indicates match or mismatch.

### Interactive terminal

Switch between **Linux** and **Windows** prompt styles. Upload files with the button or the `upload` command.

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `clear` | Clear terminal output |
| `ls` | List uploaded files |
| `cd <dir>` | Change current directory (simulated) |
| `pwd` | Show current directory |
| `os <linux\|windows>` | Switch OS prompt style |
| `upload` | Open file upload dialog |
| `hash <type> <file\|text>` | Generate a hash |
| `verify <type> <file> <hash>` | Verify a file hash |
| `rm <file>` | Remove an uploaded file |
| `cat <file>` | Display text file contents |

**Examples:**

```bash
hash sha256 "hello world"
hash md5 document.txt
verify sha256 document.txt a1b2c3d4e5f6...
```

---

## Learning Objectives

This project demonstrates:

- Building a **single-page application** with React and client-side routing
- Working with the **FileReader API** and binary file processing in the browser
- Integrating **cryptographic hashing** via a JavaScript library (CryptoJS)
- Designing **reusable React components** with typed props (TypeScript)
- Creating a **simulated terminal interface** with command parsing and state management
- Applying **Tailwind CSS** for responsive, utility-first styling
- Configuring a modern **Vite + TypeScript** development workflow

---

## Future Improvements

- Add copy-to-clipboard for generated hashes
- Enforce file size limits mentioned in the UI (10 MB images, 100 MB videos/files)
- Support drag-and-drop file uploads in the GUI
- Add hash generation progress indicator for large files
- Extend terminal `help` to document RIPEMD160
- Add unit and integration tests
- Deploy as a static site (GitHub Pages, Netlify, or Vercel)
- Add internationalization (i18n) for consistent language across UI and terminal
- Replace MD5/SHA-1 with security warnings for legacy use cases

---

## Security Note

MD5 and SHA-1 are included for compatibility and learning purposes. For security-sensitive use cases (password storage, digital signatures, integrity in adversarial environments), prefer **SHA-256** or **SHA-512**.

---

## Author

**Kurlis**

- Email: 
- GitHub: 

---

## License

This project is open source. Add a license file (e.g., MIT) before publishing if you plan to share it publicly.
