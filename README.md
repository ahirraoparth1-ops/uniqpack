# UniqPack

A full-stack web application for browsing and managing a packaging product catalog — built with React, Node.js, Express, and PostgreSQL.

---

## Prerequisites

Before running locally, ensure you have:

| Requirement | Version |
|-------------|---------|
| **Node.js** | v18 or higher |
| **npm** | v9+ (or yarn / pnpm) |
| **PostgreSQL** | v12+ (running locally or accessible) |

---

## Steps to Run on Your Local Machine

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd uniqpack_01
```

### 2. Navigate to the main project

```bash
cd uniqpack
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up environment variables

Create a `.env` file in the `uniqpack` folder:

```bash
# Copy the example and edit with your values
copy .env.example .env
# On macOS/Linux: cp .env.example .env
```

Edit `.env` and set:

```env
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/uniqpack

# Admin portal (required to access /admin)
ADMIN_USER=admin
ADMIN_PASSWORD=change-me
```

Replace:
- `YOUR_PASSWORD` with your PostgreSQL password
- `localhost:5432` if PostgreSQL uses a different host/port (e.g. `localhost:5433`)

### 5. Create and prepare the database

Create a database named `uniqpack` in PostgreSQL (if not exists):

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE uniqpack;"
```

Apply the schema with Drizzle:

```bash
npm run db:push
```

Optional — seed sample data:

```bash
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

The app will be available at:

- **Main app**: http://localhost:5000
- **Admin portal**: http://localhost:5000/admin

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Express + Vite) |
| `npm run build` | Build for production |
| `npm run start` | Run production server (run `npm run build` first) |
| `npm run db:push` | Push schema to PostgreSQL via Drizzle |
| `npm run db:seed` | Seed sample booklet data |
| `npm run db:seed:csv` | Seed products from admin/images/products_final.csv |

---

## Project Structure

```
uniqpack_01/
├── uniqpack/           # Main full-stack app
│   ├── client/         # React frontend (Vite)
│   ├── server/         # Express backend
│   ├── shared/         # Shared types & Drizzle schema
│   ├── public/         # Static assets
│   ├── .env.example    # Environment template
│   └── package.json
└── README.md           # This file
```

---

## Troubleshooting

- **"DATABASE_URL must be set"** — Ensure `.env` exists in the `uniqpack` folder and contains a valid PostgreSQL connection string.
- **Database connection refused** — Check that PostgreSQL is running and the host/port in `DATABASE_URL` are correct.
- **Admin portal 401** — Set `ADMIN_USER` and `ADMIN_PASSWORD` in `.env` and use those credentials to log in.
