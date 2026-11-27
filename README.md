# **Undoubt**

[![Vercel](https://vercelbadge.vercel.app/api/akashdas99/undoubt-next?style=for-the-badge)](https://undoubt.by-akashdas.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-0.44.4-FF6B6B?style=for-the-badge)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> A modern Q&A web application built with the **Next.js App Router**, featuring user authentication, real-time interactions, and a clean UI.

---

## 🚀 Live Demo

🌐 [**Visit Undoubt**](https://undoubt.by-akashdas.com/)

---

## 📌 Overview

**Undoubt** is a full-stack Question & Answer platform where users can:

- Ask and answer questions
- Manage their profile
- Perform full CRUD operations
- Search questions
- Interact with content in a clean and responsive UI

---

## ✨ Features

- ✅ User registration and login
- 🔍 Search existing questions
- ✍️ Post new questions and answers
- ✏️ Edit questions and answers
- 🗑️ Delete your content
- 👤 View other users' profiles
- 🖼️ Upload or update profile image

---

## 🖼️ Screenshots

### 📐 Design Preview

[![Open in Figma](https://img.shields.io/badge/Open%20in-Figma-blue?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/rSfLDaZAtPxeVm1l3r8siU/Undoubt?node-id=0-1&t=JoEZ9oE3gQSNmXoc-1)

| Desktop                                                                     | Mobile                                                                    |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Desktop Screenshot](./src/public/assets/screenshots/desktop.png?raw=true) | ![Mobile Screenshot](./src/public/assets/screenshots/mobile.png?raw=true) |

---

## 🛠️ Technologies Used

### 🧩 Backend

- **Next.js API Routes** — for server-side logic
- **Next.js Middleware** — for route protection
- **Drizzle ORM** — Type-safe PostgreSQL ORM
- **PostgreSQL** (Neon) — Relational database
- **jose** — JWT-based authentication
- **bcryptjs** — password hashing
- **Zod** — Schema validation
- **sanitize-html** — HTML sanitization

### 🎨 Frontend

- **Next.js (App Router)** — SSR and routing
- **Tailwind CSS** — utility-first styling
- **TypeScript** — static type checking
- **Shadcn/UI** — component library for modern UI
- **TipTap** — Rich text editor
- **React Hook Form** — Form management
- **Redux Toolkit** — State management

---

## 📁 Project Structure

```markdown:README.md
undoubt-next/
├── src/
│   ├── actions/              # Server actions (Next.js)
│   │   ├── answer.ts
│   │   ├── auth.ts
│   │   └── question.ts
│   ├── app/                  # Next.js App Router pages
│   │   ├── (auth)/           # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/              # API routes
│   │   │   ├── profile/
│   │   │   ├── questions/
│   │   │   └── user/
│   │   ├── profile/          # User profile page
│   │   ├── question/         # Question pages
│   │   │   └── [slug]/       # Dynamic question route
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── StoreProvider.tsx
│   ├── components/           # React components
│   │   ├── answer/          # Answer-related components
│   │   ├── auth/            # Authentication components
│   │   ├── common/          # Shared/common components
│   │   ├── profile/         # Profile components
│   │   ├── question/        # Question-related components
│   │   └── ui/              # Shadcn/UI components
│   ├── data/                # Data layer (server actions)
│   │   ├── answer.ts
│   │   ├── auth.ts
│   │   ├── question.ts
│   │   └── user.ts
│   ├── db/                  # Database configuration
│   │   ├── helpers/         # Database helpers
│   │   ├── migrations/      # Database migrations
│   │   ├── schema/          # Drizzle schema definitions
│   │   └── drizzle.ts       # Database connection
│   ├── hooks/               # Custom React hooks
│   │   ├── useDebounce.tsx
│   │   └── useTiptapEditor.tsx
│   ├── lib/                 # Utility functions and helpers
│   │   ├── store/           # Redux store configuration
│   │   │   ├── hooks/
│   │   │   ├── questions/
│   │   │   ├── user/
│   │   │   └── store.ts
│   │   ├── functions.ts
│   │   ├── response.ts
│   │   ├── session.ts
│   │   └── utils.ts
│   ├── middleware.ts        # Next.js middleware
│   ├── public/              # Static assets
│   │   └── assets/
│   │       └── screenshots/
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.ts
│   │   └── misc.ts
│   └── validations/         # Zod validation schemas
│       ├── answer.tsx
│       ├── auth.ts
│       └── question.ts
├── .env                     # Environment variables (not in repo)
├── drizzle.config.ts       # Drizzle ORM configuration
├── next.config.mjs         # Next.js configuration
├── package.json
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (or Neon account)
- Vercel Blob Storage account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/akashdas99/undoubt-next.git
   cd undoubt-next
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   ##### Database
   DATABASE_URI=your_postgresql_connection_string

   ##### Authentication
   SECRET=your_jwt_secret_key

   ##### Application URLs
   NEXT_PUBLIC_BASEURL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3001

   ##### Nest API (apps/api)
   WEB_ORIGIN=http://localhost:3000
   # Share session across web + API in staging/production (e.g. .yourdomain.com)
   # COOKIE_DOMAIN=.yourdomain.com

   ##### Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

   ##### CDN URL for assets
   NEXT_PUBLIC_CDNURL=your_cdn_url
   ```

4. **Run database migrations**

   ```bash
   npx drizzle-kit push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Web app and Nest API

The browser calls Nest at `NEXT_PUBLIC_API_URL` with `credentials: "include"`. In production, set `COOKIE_DOMAIN` on the API (e.g. `.yourdomain.com`) so `access_token` is sent to both the web host and the API host. Set `WEB_ORIGIN` to the exact web app URL for CORS.

| Variable              | Where | Purpose                                                                                                        |
| --------------------- | ----- | -------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | web   | Base URL for all API fetches (client and server)                                                               |
| `WEB_ORIGIN`          | api   | Allowed CORS origin (`credentials: true`)                                                                      |
| `COOKIE_DOMAIN`       | api   | Required when web and API are sibling subdomains (local two-port dev needs a shared dev domain or single host) |

The browser always calls `NEXT_PUBLIC_API_URL` directly. Next does not proxy API paths.

---

## 🧠 Core Concepts

- Full **CRUD operations**
- JWT-based **authentication system**
- **Password encryption** using bcrypt
- **Server-Side Rendering (SSR)**
- **Incremental Static Regeneration (ISR)** for dynamic performance
- **Type-safe database queries** with Drizzle ORM

---

## 🔧 Available Scripts

- `npm run dev` — Start development server with Turbopack
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

---
