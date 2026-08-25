
# AGENTS.md — Writely Workspace Blueprint & Guardrails

## 🎯 Project Overview

- **Project Name:** Writely
- **Frontend Stack:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Hosting Target:** Vercel.
- **Docker Environment:** Managed via containerized development services (Frontend container name: `writely-frontend`).

## 🔗 Cross-Repository Backend Context

- **Backend Location:** `/mnt/a0d79cc5-6dd9-440b-b6fc-23c61c69d7e8/personal-projects/writely-backend`
- **Agent Instruction:** You have full authority to navigate to this absolute path to check backend schemas, verify API routes, inspect the `.env` setup, or ensure contract alignment between the frontend and backend. Do not assume backend structures; verify them directly at this path.

## 🗂️ Workspace Architecture & File Seams

- **Global State Management:** All global state files must live strictly in a dedicated root-level `/store` directory.
- **Folder Naming Constraint:** Never name state folders 'state'. It must strictly use 'store'.
- **Feature Separation:** The `/features` directory contains standalone, isolated layout contexts. Feature sub-folders may only contain UI components and localized hooks. Do not embed global state definitions within features.
- **Clean Structure:** Reject messy, overly nested, or hyper-complex directory setups. Keep the codebase flat and hyper-scannable.

## 🤖 The `.agent` Folder Lifecycle

- **Purpose:** The `.agent/` directory is the local brain for Google Antigravity. It houses custom orchestration workflows, persona definitions, and specialized instructions (`.agent/skills/`).
- **Isolation:** Never bleed application code, assets, or components into the `.agent/` folder. It is purely for tool/agent configuration.
- **Git Guardrail:** This directory is strictly local and listed in `.gitignore`. Never stage, track, or commit `.agent/` runtime files or cache layers to Git.
