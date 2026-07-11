# Real Estate Management System - Backend

## Overview

RESTful API powering a real estate management platform.

## Architecture

Route --> Controller --> Service --> MongoDB

## Features

- JWT Authentication
- Verify via email
- User Management
- Property Management
- Category Management
- Statistics
  
## Technologies

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- BREVO
- SUFY

## Environment Variables

To run this project locally, you need to create the following environment variables.

### Sufy Cloud
### 1. Create a Sufy Cloud account
Register for a Sufy Cloud account and create a storage bucket.

### 2. Get your credentials
Copy the required credentials from your Sufy Cloud dashboard.

### 3. Create a `.env` file
Create a `.env` file in the project root and add the following variables:


SUFY_ACCESS_KEY= This section can be found in the Sufy Cloud service

SUFY_SECRET_KEY= This section can be found in the Sufy Cloud service

SUFY_BUCKET= This section can be found in the Sufy Cloud service

SUFY_PUBLIC_URL = This section can be found in the Sufy Cloud service

### Brevo
### 1. Create a Brevo
Register for a Brevo and press Settings.

### 2. Get your credentials
Press SMTP & API and Create create API Keys.

copy the API Keys

### 3 Create variable in `.env` file
API_KEY_BREVO = the API Keys


BREVO_SENDER_EMAIL = the email that you sign up on Brevo

### another environment variables
POST=8089
MONGODB_URL = your MongoDB connection string

JWT_SECRET = you set it up yourself

ACCESS_TOKEN = you set it up yourself

REFRESH_TOKEN = you set it up yourself

## Related Repository
Frontend: https://github.com/Phucttgiakiem/landFE.git
