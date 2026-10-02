# User Service API

REST API for user management built with **Node.js HTTP + TypeScript**.

## Features

- User registration
- User login with JWT-style tokens
- Get user by ID (admin or the same user)
- Get all users (admin only)
- Block user (admin or the same user)
- Reactivate user (admin only)
- File-based JSON storage for easy local run

## Project Structure

```bash
src/
  config/
  controllers/
  db/
  middleware/
  routes/
  schemas/
  types/
  utils/
  app.ts
  server.ts
```

## Requirements

- Node.js `22.6.0` or newer

## Setup

```bash
npm ci
cp .env.example .env
npm run seed
npm run dev
```

## Build & Run

```bash
npm run build
npm start
```

## Default Admin

These seeded credentials are for local development only. Replace them before exposing a deployment to other users.

- Email: `admin@example.com`
- Password: `Admin12345`

## API Endpoints

### Health

```http
GET /health
```

### Register

```http
POST /api/auth/register
```

Body:

```json
{
  "fullName": "John Doe",
  "birthDate": "1998-05-10",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Get User By ID

```http
GET /api/users/:id
Authorization: Bearer <token>
```

### Get All Users

```http
GET /api/users
Authorization: Bearer <admin_token>
```

### Block Or Activate User

```http
PATCH /api/users/:id/block
Authorization: Bearer <token>
```

Body:

```json
{
  "isActive": false
}
```

Notes:

- A regular user can block only themselves.
- Only an admin can reactivate a blocked user.
- Email is unique.
- Passwords are stored hashed.
- Blocked users cannot keep using old tokens.
