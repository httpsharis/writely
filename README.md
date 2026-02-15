# WRITELY_

A brutalist novel-writing studio built with Next.js — write, organize, encrypt, and publish your stories.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js "Next.js")
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react "React")
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss "Tailwind CSS")
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?style=flat-square&logo=mongodb "MongoDB")
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript "TypeScript")

---

## Overview

**Writely** is a full-stack novel-writing application designed for authors who want a focused, distraction-free environment to draft, edit, and publish their work. It features a rich text editor, chapter management, character tracking, encrypted storage, and a public reader view — all wrapped in a bold brutalist UI.

## Features

### Writing & Editing

- **Tiptap Rich Text Editor** — bold, italic, underline, headings, lists, blockquotes, code blocks, horizontal rules
- **Chapter Management** — create, reorder, rename, delete chapters with sidebar navigation
- **Auto-Save with Flush** — content saves automatically as you type; pending saves flush immediately on page unload, tab switch, or component unmount — no lost writing
- **Font Size Controls** — adjustable editor font size (A+/A-)
- **Inline Title Editing** — click-to-edit novel and chapter titles

### Organization

- **Novel Dashboard** — overview of all projects with status, word count, and character count
- **Novel Details Page** — comprehensive view with stats cards, chapter list, progress bar, and author notes
- **Character Database** — add/remove characters with role classification (Protagonist, Antagonist, Support, Minor)
- **Writer Comments** — anchor notes to specific text selections in each chapter, with resolve/delete
- **Project Status** — track progress through Planning, Drafting, Editing, Completed

### Publishing

- **One-Click Publish** — toggle novel visibility between draft and published
- **Per-Chapter Status** — independently publish or unpublish individual chapters
- **Public Reader View** — clean, immersive reading experience at `/read/[novelId]`
- **Share Link** — copy a shareable URL for published novels
- **Author Notes** — post public announcements visible to readers on the novel landing page
- **"NEW" Badges** — chapters published in the last 7 days are highlighted for readers

### Security

- **AES-256-GCM Encryption** — all chapter content is encrypted at rest in MongoDB
- **JWT Sessions (24h)** — signed/encrypted session cookie via NextAuth, persists across browser restarts with no server-side lookup per request
- **Google OAuth** — secure authentication via NextAuth with Google provider
- **Content Protection** — copy/paste prevention, right-click blocking, print blocking, and base64 transport obfuscation on public reader pages
- **No-Cache Headers** — sensitive API responses include cache-control headers to prevent local storage of content
- **Input Sanitization** — all user input is sanitized against XSS before storage

### Performance

- **Batch Editor Bootstrap** — single API request (`/api/novels/[id]/editor-data`) loads novel + chapter list + first chapter content instead of 3 sequential calls
- **In-Memory Chapter Cache** — chapters are cached client-side after first load; switching chapters is instant
- **Optimistic UI Updates** — delete, status toggle, rename, and publish update the UI immediately with automatic rollback on failure
- **Connection Pooling** — Mongoose warm pool (min 2, max 10) with `readyState` fast-path to skip redundant reconnects
- **Novels List Cache** — 5-second stale-while-revalidate cache for instant back-navigation
- **Save Flush on Unload** — `beforeunload` and `visibilitychange` listeners ensure pending saves fire before the page closes

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16.1 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4 |
| **Editor** | Tiptap (ProseMirror) |
| **Database** | MongoDB Atlas + Mongoose 9 |
| **Auth** | NextAuth 4 + Google OAuth + JWT sessions (24h) |
| **Encryption** | AES-256-GCM (Node.js crypto) |
| **Icons** | Lucide React |
| **Package Manager** | pnpm |

## Project Structure

```text
writely/
├── app/
│   ├── page.tsx                          # Dashboard (home)
│   ├── layout.tsx                        # Root layout
│   ├── provider.tsx                      # NextAuth SessionProvider
│   ├── globals.css                       # Tailwind + custom styles
│   ├── editor/[novelId]/page.tsx         # 3-column editor workspace
│   ├── novel/[novelId]/page.tsx          # Novel details & management
│   ├── read/[novelId]/page.tsx           # Public novel landing (reader)
│   ├── read/[novelId]/[chapterId]/page.tsx # Chapter reader
│   └── api/
│       ├── auth/[...nextauth]/route.ts   # NextAuth handler
│       ├── novels/route.ts               # GET/POST novels
│       ├── novels/[id]/route.ts          # GET/PATCH/DELETE novel
│       ├── novels/[id]/editor-data/route.ts # Batch editor bootstrap
│       ├── novels/[id]/chapters/route.ts # GET/POST chapters
│       ├── novels/[id]/chapters/[chapterId]/route.ts
│       └── public/                       # Unauthenticated reader endpoints
│           └── novels/[id]/...
├── components/
│   ├── editor/
│   │   ├── ChapterSidebar.tsx            # Chapter list sidebar
│   │   ├── EditorToolbar.tsx             # Formatting toolbar
│   │   ├── MetaStrip.tsx                 # Top bar (title, save, publish)
│   │   ├── PublishDialog.tsx             # Publish modal
│   │   ├── TiptapEditor.tsx              # Rich text editor (forwardRef)
│   │   └── ToolsPanel.tsx                # Characters & comments panel
│   └── ui/
│       ├── ConfirmDialog.tsx             # Reusable confirm modal
│       ├── ContentShield.tsx             # Copy protection wrapper
│       └── Spinner.tsx                   # Loading spinner
├── hooks/
│   └── useEditor.ts                      # Editor state + chapter cache
├── lib/
│   ├── api-client.ts                     # Client-side API functions + caching
│   ├── api-helpers.ts                    # Server-side response helpers
│   ├── auth.ts                           # NextAuth configuration (JWT)
│   ├── contentUtils.ts                   # Content parsing utilities
│   ├── db.ts                             # Mongoose connection (pooled, cached)
│   ├── encryption.ts                     # AES-256-GCM encrypt/decrypt
│   ├── mongodb-client.ts                 # Native MongoClient for adapter
│   └── utils.ts                          # General utilities (cn)
├── models/
│   ├── Chapter.ts                        # Chapter Mongoose schema
│   └── Project.ts                        # Project/Novel Mongoose schema
└── types/
    ├── api.ts                            # API route param types
    ├── chapter.ts                        # Chapter interfaces
    └── project.ts                        # Project interfaces
```

## Getting Started

### Prerequisites

- **Node.js** 18.17+
- **pnpm** 8+
- **MongoDB Atlas** cluster (or local MongoDB instance)
- **Google OAuth** credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### 1. Clone the Repository

```bash
git clone https://github.com/httpsharis/writely.git
cd writely
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# NextAuth
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Encryption (64 hex chars = 32 bytes)
ENCRYPTION_KEY=<generate-with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
pnpm build
pnpm start
```

## API Routes

### Authenticated (require Google OAuth session)

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/novels` | List all user's novels |
| `POST` | `/api/novels` | Create a new novel |
| `GET` | `/api/novels/[id]` | Get novel details |
| `PATCH` | `/api/novels/[id]` | Update novel (title, description, status, characters, author notes, publish) |
| `DELETE` | `/api/novels/[id]` | Delete novel + cascade delete chapters |
| `GET` | `/api/novels/[id]/editor-data` | Batch: novel + chapters + first chapter (editor bootstrap) |
| `GET` | `/api/novels/[id]/chapters` | List chapters |
| `POST` | `/api/novels/[id]/chapters` | Create a chapter |
| `GET` | `/api/novels/[id]/chapters/[chapterId]` | Get chapter (decrypted) |
| `PATCH` | `/api/novels/[id]/chapters/[chapterId]` | Update chapter content/title/status/comments |
| `DELETE` | `/api/novels/[id]/chapters/[chapterId]` | Delete a chapter |

### Public (no auth, published content only)

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/public/novels/[id]` | Get published novel metadata + author notes |
| `GET` | `/api/public/novels/[id]/chapters` | List published chapters |
| `GET` | `/api/public/novels/[id]/chapters/[chapterId]` | Get chapter content (base64-encoded) |

## Security Model

```text
┌─────────────────────────────────────────────────┐
│                   CLIENT                        │
│                                                 │
│  ContentShield (no copy/paste/print/right-click)│
│           ↕  base64 decode                      │
├─────────────────────────────────────────────────┤
│                   NETWORK                       │
│                                                 │
│  Content sent as base64-encoded JSON            │
│  No-cache headers on all content responses      │
├─────────────────────────────────────────────────┤
│                   SERVER                        │
│                                                 │
│  NextAuth JWT sessions (signed, encrypted)      │
│  Ownership verification on every request        │
│  Input sanitization (XSS prevention)            │
├─────────────────────────────────────────────────┤
│                   DATABASE                      │
│                                                 │
│  AES-256-GCM encryption at rest                 │
│  Random IV per encryption (no pattern leaks)    │
│  Auth tag for tamper detection                  │
└─────────────────────────────────────────────────┘
```

## Design Philosophy

Writely uses a **brutalist design language** characterized by:

- Hard box shadows (`shadow-[5px_5px_0px_black]`)
- Thick black borders (`border-[3px] border-black`)
- Monospace micro-labels with wide tracking
- Primary yellow (`#ffeb3b`) and accent pink (`#ff2e93`)
- Engineering grid background pattern
- Three typefaces: Space Grotesk (UI), JetBrains Mono (code/labels), Merriweather (prose)

## License

This project is private and not licensed for redistribution.

---

*Built with brutalist conviction.*
