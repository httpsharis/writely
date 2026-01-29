# 📝 Writely - Project Master Plan

## 🚀 Phase 0: Project Initialization & Config
*Foundation work. Setting up the environment.*
- [x] **Initialize Next.js Project**
    - `npx create-next-app@latest` (TypeScript, Tailwind, App Router).
- [x] **Clean Boilerplate**
    - Remove default content in `page.tsx` and `globals.css`.
- [x] **Install Core Dependencies**
    - `npm install mongoose` (Database).
    - `npm install next-auth` (Authentication).
    - `npm install lucide-react classnames` (UI/Icons).
    - `npm install @tiptap/react @tiptap/starter-kit` (Text Editor).
- [ ] **Setup Environment Variables**
    - Create `.env.local`.
    - Add `MONGODB_URI`.
    - Add `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`.
    - Add `NEXTAUTH_SECRET` & `NEXTAUTH_URL`.
- [ ] **Database Connection Utility**
    - Create `src/lib/db.ts`.
    - Implement caching logic for "Serverless" environment.

---

## 🔐 Phase 1: Authentication (The Gatekeeper)
*Securing the app and managing user identity.*
- [x] **Google Cloud Console Setup**
    - Create Project "Writely".
    - Configure OAuth Consent Screen.
    - Generate Client ID/Secret.
    - Add Redirect URI: `http://localhost:3000/api/auth/callback/google`.
- [ ] **NextAuth Configuration**
    - Create `src/lib/auth.ts` (Auth Options).
    - Create `src/app/api/auth/[...nextauth]/route.ts` (Handler).
- [ ] **Frontend Session Provider**
    - Create `src/app/providers.tsx` (Client Component).
    - Wrap `RootLayout` in `src/app/layout.tsx` with `<Providers>`.
- [ ] **User Interface**
    - Create `src/components/UserButton.tsx` (Login/Logout logic).
    - Add `UserButton` to `page.tsx` to verify login works.

---

## 💾 Phase 2: The Backend Engine (Database)
*Defining the data structure and API endpoints.*
- [ ] **Create Novel Schema**
    - File: `src/models/Novel.ts`.
    - Fields: `userEmail`, `title`, `updatedAt`, `chapters` array.
- [ ] **API: Create Novel**
    - File: `src/app/api/novels/route.ts` (POST).
    - Logic: Check Auth -> Connect DB -> Create Document -> Return ID.
- [ ] **API: Fetch Novels**
    - File: `src/app/api/novels/route.ts` (GET).
    - Logic: Find all novels where `userEmail` matches session user.
- [ ] **API: Get Single Novel**
    - File: `src/app/api/novels/[id]/route.ts` (GET).
    - Logic: Verify ownership -> Return specific novel data.

---

## 🖥️ Phase 3: The Dashboard (Home Screen)
*Where the user manages their projects.*
- [ ] **Dashboard Layout**
    - Create `src/app/dashboard/page.tsx` (Protected Route).
    - Redirect unauthenticated users to `/`.
- [ ] **Project List Component**
    - Fetch data from `/api/novels`.
    - Render a Grid of cards (Novel Title + Word Count).
- [ ] **"New Novel" Action**
    - Add a "Create Project" button.
    - Connect to POST `/api/novels`.
    - Redirect to the Editor page upon success.

---

## ✍️ Phase 4: The Editor Core (The Heart of Writely)
*The actual writing interface.*
- [ ] **Editor Page Structure**
    - Create `src/app/novel/[id]/page.tsx`.
    - Fetch novel data server-side (using `params.id`).
- [ ] **The "Three-Pane" Layout**
    - **Left:** Chapter List Sidebar.
    - **Center:** Writing Area.
    - **Right:** Notes/Idea Drawer.
- [ ] **Tiptap Editor Integration**
    - Create `src/components/Editor.tsx`.
    - Implement `useEditor` hook.
    - Add basic toolbar (Bold, Italic, Heading).
- [ ] **Auto-Save Mechanism**
    - Create `useAutosave` custom hook.
    - Implement `Debounce` logic (wait 1000ms after typing).
    - API: PATCH `/api/novels/[id]/chapter` to update content.
- [ ] **Visual Feedback**
    - Add "Saving...", "Saved", "Error" status indicators.

---

## 📱 Phase 5: Mobile Optimization
*Making it work on the phone.*
- [ ] **Responsive Layout Utils**
    - Hide sidebars by default on screens smaller than `md` (768px).
- [ ] **The "Drawer" System**
    - Create a state `isLeftMenuOpen` and `isRightMenuOpen`.
    - Add "Hamburger Menu" button (Top Left).
    - Add "Brain/Notes" button (Top Right).
    - CSS: Use absolute positioning to slide menus over the text on mobile.
- [ ] **Touch Optimization**
    - Ensure buttons are large enough for thumbs (min 44px).
    - Prevent "pull-to-refresh" behaviors if necessary.

---

## 🧠 Phase 6: World Building (The "Brain")
*Adding context to the story.*
- [ ] **Global Inbox (Quick Notes)**
    - Add a "Quick Note" text area in the Right Sidebar.
    - Save notes to the `Novel` model (`notes` array).
- [ ] **Character Cards (Basic)**
    - Add a "Characters" tab in the Right Sidebar.
    - Form: Name, Role, Description.
    - Display list of characters.

---

## 🚀 Phase 7: Deployment
*Going live.*
- [ ] **Environment Check**
    - Ensure all secrets are added to Vercel Project Settings.
- [ ] **Deploy**
    - Push to GitHub.
    - Import repo to Vercel.
- [ ] **Final Smoke Test**
    - Login on Production.
    - Create a Novel.
    - Write a chapter on Mobile.