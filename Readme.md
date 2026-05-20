# BOB: Mental Health and Psychological Support System

A web-based mental health support platform for college and university students. The project is designed to provide a private, accessible space where students can track their mood, complete a DASS-21 assessment, use self-care tools, speak with the local BOB chatbot, and book counselling appointments.

The work is based on the dissertation topic **"Development of a Mental Health and Psychological Support System"**, which focuses on stigma-free student support, confidentiality, local deployment, and timely access to counsellors.

## Why This Project

This project was built to reduce the gap between students and mental health support on campus. Many students avoid seeking help because of stigma, privacy concerns, or long counselling wait times. BOB provides a private digital space where students can take early steps toward support through self-care tools, mood tracking, assessments, chatbot guidance, and appointment booking.

## Features

- Student registration and login with JWT-based cookie sessions
- Password hashing with Bcrypt
- Mood logging with daily updates, history, streaks, and weekly statistics
- DASS-21 assessment with depression, anxiety, and stress severity scoring
- Counselling appointment booking for authenticated students
- Counsellor dashboard for viewing, completing, and cancelling appointments
- User profile page with appointment, mood, and DASS-21 history
- Wellness section with breathing exercises, wind-down activities, and curated videos
- BOB chatbot integration through a local Ollama endpoint
- Discord/community entry point from the home page

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Material UI
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL
- **Language:** TypeScript across frontend and backend
- **Auth & Security:** JWT, bcryptjs, cookie-parser, CORS
- **AI Integration:** Ollama local API with `bobbuddy:latest`
- **Utilities:** axios, react-toastify, react-hot-toast
- **UI & Components:** lucide-react, react-icons, Tailwind CSS

## Project Structure

```text
bob/
  front/
    src/
      components/        Reusable UI, chatbot, wellness, home, and layout components
      pages/             App pages such as Home, Login, DASS21, Appointment, Dashboard

  back/
    src/
      app.ts             Express app setup, middleware, and route mounting
      server.ts          API server entry point
      routes/            Auth, appointment, counsellor, mood, DASS, profile, chat routes
      controllers/       Request handlers and business logic
      middlewares/       Authentication middleware
      config/            Prisma client configuration
    prisma/
      schema.prisma      PostgreSQL data model
      migrations/        Database migration history
```

## Prerequisites

- Node.js
- PostgreSQL
- npm
- Ollama, if using the chatbot feature

## Setup and Run

Install backend dependencies and prepare Prisma:

```bash
cd back
npm install
npx prisma migrate dev
npm run dev
```

Install frontend dependencies and start Vite:

```bash
cd front
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default, and the backend runs on `http://localhost:5000` unless `PORT` is changed.

## Chatbot Setup

The backend sends chat requests to Ollama using the model name `bobbuddy:latest`. Make sure Ollama is running locally and that the model is available before using the chat page.

```bash
ollama serve
```

## Main API Areas

- `POST /auth/signup` and `POST /auth/login`
- `GET /auth/session` and `POST /auth/logout`
- `POST /mood/log`, `GET /mood/history`, `GET /mood/stats`
- `POST /dass/result`, `GET /dass/my-results`
- `POST /book/appointment`, `GET /book/my-appointments`
- `GET /counsellor/dashboard`, `GET /counsellor/stats`
- `POST /chat/message`

## Build

```bash
cd back
npm run build

cd ../front
npm run build
```

## Notes

This platform is intended as a support and early-intervention tool for student wellbeing. It is not a replacement for professional medical care or formal clinical diagnosis. The dissertation describes a privacy-first system with local deployment as a key goal; this repository implements the web application, API, database schema, and local Ollama chatbot integration needed for that system.
