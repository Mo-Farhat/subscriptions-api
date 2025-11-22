# Subscriptions API

A robust RESTful API for tracking and managing subscriptions, featuring automated email reminders powered by Upstash Workflow.

## 🚀 Features

- **User Authentication**: Secure Sign Up, Sign In, and Sign Out using JWT.
- **Subscription Management**: Create, Read, Update, and Delete subscriptions.
- **Automated Reminders**: Sends email notifications 7, 3, and 1 days before subscription renewal.
- **Welcome Emails**: Instant welcome email upon subscription creation.
- **Security**: Bot detection and rate limiting using Arcjet.
- **Workflow Automation**: Distributed background jobs using Upstash Workflow.
- **Database**: MongoDB with Mongoose ODM.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Workflow Engine**: Upstash Workflow & QStash
- **Security**: Arcjet
- **Email**: Nodemailer (Gmail SMTP)

## 📋 Prerequisites

Before you begin, ensure you have the following:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Upstash Account](https://upstash.com/) (for QStash and Workflow)
- [Arcjet Account](https://arcjet.com/) (for security)
- Gmail Account (for sending emails via App Password)

## ⚙️ Configuration

Create a `.env.development.local` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
SERVER_URL="http://localhost:8000"
NODE_ENV="development"

# Database
DB_URI="mongodb://localhost:27017/subscriptions-api" # or your Atlas URI

# Authentication
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="1d"

# Arcjet Security
ARCJET_KEY="aj_..." # Get from Arcjet Dashboard
ARCJET_ENV="development"

# Upstash Workflow & QStash
QSTASH_URL="http://127.0.0.1:8080" # Use local URL for dev, real URL for prod
QSTASH_TOKEN="mock_token" # Use mock for local dev
QSTASH_CURRENT_SIGNING_KEY="mock_key"
QSTASH_NEXT_SIGNING_KEY="mock_key"

# Email (Nodemailer)
EMAIL_PASSWORD="your_16_char_google_app_password"
```

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd subscriptions-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the QStash local server (for development):**
    Open a new terminal and run:
    ```bash
    npx @upstash/qstash-cli dev
    ```
    This will start a local QStash server at `http://127.0.0.1:8080`.

4.  **Start the API server:**
    In your main terminal:
    ```bash
    npm run dev
    ```

## 📡 API Endpoints

### Auth
- `POST /api/v1/auth/sign-up` - Register a new user
- `POST /api/v1/auth/sign-in` - Login
- `POST /api/v1/auth/sign-out` - Logout

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get specific user

### Subscriptions
- `POST /api/v1/subscriptions` - Create subscription (Triggers workflow)
- `GET /api/v1/subscriptions/user/:id` - Get user's subscriptions
- `PUT /api/v1/subscriptions/:id` - Update subscription
- `DELETE /api/v1/subscriptions/:id` - Delete subscription
- `PUT /api/v1/subscriptions/:id/cancel` - Cancel subscription

### Workflows
- `POST /api/v1/workflows/subscription/reminder` - Workflow endpoint (Internal/Upstash use)

## 🔄 How it Works

1.  **Subscription Creation**: When a user creates a subscription via `POST /api/v1/subscriptions`, the API saves it to MongoDB.
2.  **Workflow Trigger**: The API immediately triggers an Upstash Workflow (`/api/v1/workflows/subscription/reminder`).
3.  **Welcome Email**: The workflow sends a "Welcome" email immediately.
4.  **Reminder Schedule**: The workflow calculates the renewal date and schedules reminders for 7 days, 3 days, and 1 day before renewal.
5.  **Sleep & Execute**: The workflow "sleeps" until the reminder date. When the date arrives, Upstash wakes up the workflow endpoint, which triggers the email sending logic using Nodemailer.
