# AI Employee Support

An internal employee support portal for a company — employees can chat with an AI assistant for HR/IT policy questions, raise support tickets, view announcements and tasks, and apply to internal job postings. HR, IT, and Admin each get a dedicated console to manage their side of things.

## Features

- **AI policy assistant** — employees ask HR/IT questions in a chat UI; answers are grounded strictly in the company's policy documents (`src/lib/policies.js`) via the Groq API (Llama 3.3), with a keyword-matching fallback if no API key is configured.
- **Auto-escalation to tickets** — when the assistant can't answer a question from policy content, it's classified (HR/IT + priority) and routed into the ticket queue instead of being silently dropped.
- **Ticket management** — a ticket board for HR/IT staff to resolve employee-raised issues.
- **Role-based dashboards** — Admin, HR, and IT each have their own management console (user management, announcements, job postings/applications); Employees get a personal dashboard with tasks, announcements, and the AI chat.
- **Job postings & applications** — HR can post openings; employees can view and apply (with resume upload).
- **Announcements & notifications** — company-wide announcements (with optional PDF attachments) and a notification bell.
- **Task tracking** — a "today's tasks" view per employee.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React
- MongoDB Atlas for data storage
- [Groq](https://groq.com) (Llama 3.3 70B) for the AI assistant, with a local keyword-based fallback
- Tailwind CSS
- [lucide-react](https://lucide.dev) for icons

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
MONGODB_URI=your-mongodb-atlas-connection-string
MONGODB_DB=ai_employee_support
GROQ_API_KEY=your-groq-api-key   # optional — falls back to keyword matching if omitted
GROQ_MODEL=llama-3.3-70b-versatile
```

### 3. Seed demo accounts (optional)

```bash
cp scripts/seed-data.example.mjs scripts/seed-data.local.mjs
# edit scripts/seed-data.local.mjs with real demo users
npm run seed
```

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001).

## Demo accounts

The login page has a "Demo accounts" panel that autofills credentials for each role — no signup flow, since this simulates pre-provisioned company accounts:

| Role     | Email                  |
|----------|------------------------|
| Admin    | khushi@company.com     |
| HR       | hr@company.com         |
| IT       | it@company.com         |
| Employee | employee@company.com   |

## Project structure

```
src/
  app/            Routes (login, dashboard, hr, it, admin, chat, tickets, jobs, profile) + API routes
  components/     Shared UI components
  data/           MongoDB-backed data access functions
  lib/            AI assistant, ticket classifier, policies, roles, session, uploads
scripts/
  seed.mjs        Seeds demo accounts into MongoDB
```

## Known limitations

- PDF uploads (resumes, announcement attachments) are saved to local disk (`public/uploads/`). This works for local development but **will not persist on serverless hosts like Vercel** — the filesystem there is ephemeral. Swap in an object storage service (e.g. S3, Vercel Blob) before relying on uploads in production.
