
Diary web app with:

- `client` - React + Vite + Tailwind CSS
- `server` - Node.js + Express + Prisma + SQLite (easy local) or PostgreSQL

## 1) Prerequisites

- Node.js 18+
- SQLite (default local) or PostgreSQL running locally/remotely

## 2) Backend setup (`server`)

```bash
cd server
cp .env.example .env
```

Update `server/.env` with your real database credentials and JWT secret.
Set `ADMIN_EMAIL` to your creator account email for admin access.

Then run:

```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

Backend will run on `http://localhost:5000`.

## 3) Frontend setup (`client`)

```bash
cd client
cp .env.example .env
npm install
npm run dev
```


## 4) API overview

### Auth

- `POST /api/auth/register` - register user, returns `{ token, user }`
- `POST /api/auth/login` - login user, returns `{ token, user }`

### Entries (JWT protected)

- `GET /api/entries`
- `GET /api/entries/:id`
- `POST /api/entries`
- `PUT /api/entries/:id`
- `DELETE /api/entries/:id`

### Admin (creator only, JWT protected)

- `GET /api/admin/overview`
- `GET /api/admin/users`

## 5) User flow

1. Register
2. Login
3. Create entry
4. View entries on dashboard
5. Open and edit entry
6. Delete entry with confirmation

## 6) Notes

- JWT is stored in browser `localStorage`.
- Axios client auto-attaches `Authorization: Bearer <token>`.
- Dashboard includes search and month filter.
- Rich text editor uses React Quill.
- Admin panel is visible only when logged-in email matches `VITE_ADMIN_EMAIL`.
