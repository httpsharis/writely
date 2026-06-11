
# 📚 PROJECT CONTEXT: Writely App

## 1. Core Identity

* **App Name:** Writely
* **Description:** A premium web application for novel writers and world-builders. It functions as an "Author's Second Brain."
* **Role/Persona for AI:** Act as a Senior UI/UX Designer and Next.js/Tailwind Frontend Architect.

## 2. Tech Stack

* **Frontend:** Next.js (App Router), Tailwind CSS, TypeScript
* **State Management & Data Fetching:** Redux Toolkit + RTK Query
* **Editor:** Tiptap / Novel.sh
* **Backend:** Node.js, Express, MongoDB
* **Image Hosting:** Cloudinary (Unsigned client-side uploads via `lib/uploadImage.ts`)
* **Authentication:** JWT (via HTTP-Only Cookies / `cookie-parser`)

---

## 3. Strict Design Philosophy ("Editorial & Invisible Bento")

The interface must fade entirely into the background so the writer's story takes center stage.

* **Editorial over Dashboard:** Writely is NOT a generic corporate SaaS app. Rely heavily on typography (Plus Jakarta Sans for UI, Lora for text).
* **Negative Space:** Use generous padding and margins. Let elements breathe.
* **Dividers over Cards:** Separate content sections using 1px hairline dividers (`divide-y`, `divide-x`, `border-t`) instead of bulky background cards.

### 🚫 ANTI-PATTERNS (NEVER DO THESE):

* NEVER use glassmorphism or thick blur effects.
* NEVER use heavy drop shadows (`shadow-lg`, `shadow-xl`). Stick to flat design or extremely subtle shadows.
* NEVER use filled, heavy background cards for layouts.
* NEVER force content into tight CSS Grid columns if it cramps text.
* NEVER use emojis in code or UI responses.
* NEVER make a flush sidebar that touches the screen edges (keep a floating gap).

---

## 4. Routing Architecture (The Three Zones)

**ZONE 1: The Global Hub `app/(main)/`**
*Layout includes the Main Global Sidebar.*

* `/` -> Dashboard (Recent activity, Word stats, RTK Query driven)
* `/library` -> Grid/List of all Novel projects
* `/global-notes` -> Universal scratchpad

**ZONE 2: The Project Lobby `app/(project)/project/[projectId]/`**
*Layout includes Project-Specific Sidebar (Chapters, Lore).*

* `/project/[projectId]` -> Project Details / Hub (Cover, Synopsis, Stats)
* `/project/[projectId]/characters` -> Database for this specific book
* `/project/[projectId]/world` -> Lore, locations, rules
* `/project/[projectId]/notes` -> Book-specific research

**ZONE 3: The Canvas `app/(editor)/project/[projectId]/write`**
*Layout is Distraction-Free. NO SIDEBAR.*

* `/project/[projectId]/write` -> The Tiptap Editor (Frictionless auto-create, auto-save).

---

## 5. Backend API Integration (Completed)

The Express backend is fully configured with security middleware (`helmet`, `cors`, `mongoSanitize`, `rateLimiter`, `cookieParser`) and exposes the following routes for RTK Query consumption:

* `POST /api/auth` -> Authentication & Session Management
* `GET /api/users` -> User Management
* `CRUD /api/documents` -> Novels and Chapters structure
* `CRUD /api/characters` -> World-building / Character entities
* `CRUD /api/notes` -> Project & Global notes
* `GET /api/profile` -> Dashboard aggregation feeds
* `GET /api/analytics` -> Word goals & Streak calculations
* `POST /api/upload` -> Internal file handling
* `GET /api/export` -> Manuscript compilation/export
* `GET /api/search` -> Global elastic search
* `POST /api/likes` -> Interaction tracking

---

## 6. Current Progress & Tasks

*(Update this section before starting a new session)*

### ✅ Completed:

* Complete Express.js Backend Architecture.
* RTK Query setup (`baseQuery` handling 401s, `documentApi`).
* Dynamic Cloudinary Image Upload logic.
* Editor frictionless auto-create fix (no infinite loops, single source of truth for `chapterId`).
* Dashboard & App Route architecture defined.

### 🚧 Currently Working On:

* Making the library page dynamic

### ❌ Known Bugs / Issues:

* So made the details or project lobby page But its not fetching the picture and cant seem to create the chapter in editor.
* When opening editor page there is all blacn i cant  even write anything. i want when i click the +Chapter editor should open and I have black or untiled page for writing. When click Open Editor there should be latest chapter or new chapter if there is no chapters at all.
