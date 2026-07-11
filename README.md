# Real Estate Management System - Backend

## Overview

RESTful API powering a real estate management platform.

## Architecture

```
Route → Controller → Service → MongoDB
```

## Features

- JWT Authentication
- Email Verification
- User Management
- Property Management
- Category Management
- Statistics Dashboard

## Technologies

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Brevo
- Sufy Cloud Storage

## Environment Variables

Create a `.env` file in the project root and configure the following variables.

### Sufy Cloud

This project uses Sufy Cloud for image storage.

1. Create a Sufy Cloud account.
2. Create a storage bucket.
3. Copy your credentials from the Sufy Cloud dashboard.

```env
SUFY_ACCESS_KEY=
SUFY_SECRET_KEY=
SUFY_BUCKET=
SUFY_PUBLIC_URL=
```

### Brevo

This project uses Brevo for email verification.

1. Create a Brevo account.
2. Navigate to **Settings → SMTP & API**.
3. Generate an API Key.

```env
API_KEY_BREVO=
BREVO_SENDER_EMAIL=
```

### Application Configuration

```env
PORT=8089

MONGODB_URL=

JWT_SECRET=

ACCESS_TOKEN=

REFRESH_TOKEN=
```

## Running the Project

```bash
npm install
npm start
```

## Related Repository

Frontend Repository:

https://github.com/Phucttgiakiem/landFE
