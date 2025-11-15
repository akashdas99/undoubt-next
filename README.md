# **Undoubt**

[![Vercel](https://vercelbadge.vercel.app/api/akashdas99/undoubt-next?style=for-the-badge)](https://undoubt.by-akashdas.com/)

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (or Neon account)
- Vercel Blob Storage account (for image uploads)

### Installation

1. **Clone the repository**
   git clone https://github.com/akashdas99/undoubt-next.git
   cd undoubt-next 2. **Install dependencies**h
   npm install 3. **Set up environment variables**

   Create a `.env` file in the root directory:

   # Database

   DATABASE_URI=your_postgresql_connection_string

   # Authentication

   SECRET=your_jwt_secret_key

   # Application URLs

   NEXT_PUBLIC_BASEURL=http://localhost:3000

   # Vercel Blob Storage

   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

   # CDN URL for assets

   NEXT_PUBLIC_CDNURL=your_cdn_url 4. **Run database migrations**
   npx drizzle-kit push 5. **Start the development server**

   npm run dev 6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

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

## 👤 Author

**Akash Das**

- Website: [by-akashdas.com](https://by-akashdas.com)
- GitHub: [@akashdas99](https://github.com/akashdas99)

---

## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the amazing component library
- [TipTap](https://tiptap.dev/) for the rich text editor
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database queries
