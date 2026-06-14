<div align="center">
  <img src="https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=Formsalgo" alt="FormForge Logo" width="120" height="120" style="border-radius: 20px;" />
  <br/>
  <h1>✨ Formsalgo ✨</h1>
  <p><strong>Next-Generation Form Builder & Audience CRM</strong></p>
  <p>Craft beautiful, interactive, and intelligent forms with a premium "Notebook" experience.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
  [![tRPC](https://img.shields.io/badge/tRPC-11-2596be?style=for-the-badge&logo=trpc)](https://trpc.io/)
</div>

<br/>

## 📖 Overview

**FormForge** is an enterprise-grade form creation platform that reimagines how users interact with online forms. Moving away from the traditional, endless-scrolling web forms, FormForge introduces a tactile, **3D paginated "Notebook" UI**, ensuring users focus on exactly one question at a time. Coupled with a powerful drag-and-drop builder, built-in Role-Based Access Control (RBAC), and AI-driven audience analytics, FormForge is designed to maximize completion rates and deliver actionable insights.

---

## 🚀 Key Features

### 🎨 The "Notebook" Experience (Published Forms)
* **Single-Question Pagination:** Users interact with one field at a time, minimizing cognitive load.
* **3D Page Flips:** Built with Framer Motion, navigating between questions mimics the physical turning of a notebook page (`rotateX` / `rotateY` transitions).
* **Responsive Binding:** A chunky, neo-brutalist spiral binding that sits on the left on desktop and repositions to the top (steno-pad style) on mobile devices.
* **Thematic Aesthetics:** Switch between multiple premium backgrounds (Aurora, Zen, Cybergrid, Neo-grid) while maintaining the core "Scribble" notebook feel.

### 🛠 Drag & Drop Form Builder
* **Intuitive Canvas:** Powered by `@dnd-kit`, allowing creators to easily drag, drop, and reorder fields.
* **Rich Field Types:** Supports Text, Email, Phone, Dropdowns, Multiple Choice, Ratings, Matrix layouts, and Statement blocks.

### 🛡 Security & Role-Based Access (RBAC)
* **Protected Routes:** Administrative dashboards (`/admin` and `/dashboard`) are strictly gated. Non-admin users are automatically shielded and redirected.
* **Mobile Blocker:** Creator interfaces are optimized for desktop to ensure a pristine building environment, automatically blocking small screens while keeping public forms 100% accessible everywhere.

### 🧠 Audience CRM & AI Analytics
* **Groq AI Integration:** Automatically analyzes raw response data to generate demographic profiles, sentiment analysis, and audience clustering mapped by user email.
* **Real-time Dashboard:** Visualize response completion rates, response tracking, and template usage in one centralized hub.

---

## 💻 Tech Stack

**Architecture:** Monorepo using **Turborepo**

* **Frontend (`apps/web`):**
  * **Framework:** Next.js 15 (App Router)
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS v4
  * **Animation:** Framer Motion
  * **State Management:** Zustand
  * **Drag & Drop:** `@dnd-kit`

* **Backend (`apps/api`):**
  * **Framework:** Fastify
  * **API Layer:** tRPC (`@trpc/server`)
  * **Database ORM:** Drizzle ORM
  * **Auth/DB Provider:** Supabase & Firebase Admin

---

## 📂 Project Structure

```text
formsalgo/
├── .github/                 # GitHub Actions & Workflows
├── apps/
│   ├── api/                 # Fastify + tRPC Backend Server
│   │   ├── src/             # API routes and server initialization
│   │   └── package.json
│   └── web/                 # Next.js Frontend Application
│       ├── src/
│       │   ├── app/         # Next.js App Router (Pages, Layouts)
│       │   │   ├── dashboard/   # Admin & Creator Portal
│       │   │   └── f/[slug]/    # Published Form Viewer (Notebook UI)
│       │   ├── components/  # React Components (UI, Builder, Shared)
│       │   ├── lib/         # Utility functions, Supabase clients
│       │   └── stores/      # Zustand state stores
│       └── package.json
├── packages/                # Shared internal packages
│   ├── db/                  # Drizzle ORM schema & connections
│   ├── trpc/                # Shared tRPC routers and context
│   └── types/               # Shared TypeScript types & interfaces
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # PNPM workspace definitions
└── package.json             # Root dependencies
```

---

## 🛠 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+ recommended)
* [pnpm](https://pnpm.io/) (v9+)
* A [Supabase](https://supabase.com/) account for database & authentication.
* A [Groq](https://groq.com/) API Key for AI analytics.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/formsalgo.git
   cd formsalgo
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   * Copy the `.env.example` file to `.env` in the root directory.
   * Fill in your Supabase credentials, Groq API key, and Next.js public URLs.

4. **Initialize Database:**
   Ensure your Supabase instance is running and execute the provided SQL setup script:
   ```bash
   # Run the SQL file in your Supabase SQL Editor
   cat database_init.sql
   ```

5. **Start the Development Server:**
   ```bash
   pnpm dev
   ```
   * The Next.js frontend will run on `http://localhost:3000`
   * The Fastify backend will run on `http://localhost:4000` (or configured port)

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/formsalgo/issues).

## 📝 License
This project is [MIT](LICENSE) licensed.
