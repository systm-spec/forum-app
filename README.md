# forum-app

Reusable boilerplate for a forum app. This repository provides the core functionality as a starting point for your own projects, without predefined topics, editorial content, or an application-specific concept.

## Features

- Registration and login with a nickname and password
- User profiles with posts and comments
- Create, join, and leave communities
- Create and search posts, and view discussion threads
- Comments and nested replies
- Upvotes and downvotes for posts and comments
- User, moderator, and admin roles with configurable moderation permissions
- Responsive dark-mode interface with loading, empty, and error states

## Stack

Next.js with App Router, React, TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM, and Auth.js. Passwords are hashed with Argon2id. Dependency versions are listed in `package.json` and `pnpm-lock.yaml`.

## Local Setup

Requirements: Node.js 22, pnpm 10.15.0, and Docker with Compose.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
```

Configure `.env.local`:

```dotenv
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=forum_app
PGUSER=forum_app
PGPASSWORD=<your_database_password>
AUTH_SECRET=<separate_random_secret>
AUTH_URL=http://localhost:3000
ADMIN_USER_ID=
```

Generate `PGPASSWORD` and `AUTH_SECRET` independently, for example by running `openssl rand -hex 32` for each. Do not commit credentials.

```bash
pnpm db:start
pnpm db:migrate
pnpm dev
```

Open [localhost:3000](http://localhost:3000). PostgreSQL runs in Docker; the app runs locally.

Create an account at `/register`. To grant admin access, set `ADMIN_USER_ID` to that account’s UUID from `users.id`, then restart the app. Without a valid entry, no account has admin access.

## Project Structure

```text
app/          Pages, layout, styles, and auth route
components/   Reusable UI components
lib/auth/     Authentication and permissions
lib/db/       Database schema and connection
lib/forum/    Queries and write operations
drizzle/      Versioned SQL migrations
```

## Development

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm db:generate --name=description
pnpm db:migrate
pnpm db:stop
```

The last three commands generate migrations, apply them, and stop the database, respectively. Do not modify migrations that have already been applied. Validate input and enforce permissions on the server. Do not cache user-specific data globally.

## Using This Template

Add branding, content, and business rules for your project. Before starting the database for the first time, review existing sample content and data imports in migrations, and remove or adapt them for your template.

Post editing, profile editing, and password recovery are not yet implemented.
