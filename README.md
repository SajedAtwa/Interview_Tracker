# 🚀 Interview Tracker

A full-stack web application for tracking job applications and managing interview pipelines.

Built with a modern Spring Boot backend and a React (Vite) frontend, this project demonstrates authentication, JWT security, RESTful APIs, and clean UI/UX design.

---

## 🏗 Architecture Overview

The application uses a layered Spring Boot backend (Controller → Service → Repository) with JWT authentication. 

The React frontend communicates with the backend via Axios and stores JWT tokens in local storage. Protected endpoints require Bearer token authorization.

The backend enforces user-level data isolation, ensuring users can only access their own interview records.

## 🧱 Tech Stack

### Backend
- Java 17+
- Spring Boot
- Spring Security
- JWT Authentication
- JPA / Hibernate
- PostgreSQL
- Maven

### Frontend
- React
- Vite
- Axios
- Custom CSS (dark gradient theme)

---

## 🔐 Features

- User registration & login
- JWT-based authentication
- Secure API endpoints
- Create, edit, and delete interviews
- Track:
  - Company
  - Role
  - Interview Date & Time
  - Status (Scheduled, Completed, Rejected, Offer)
  - Notes
- Modal-based editing interface
- Clean, responsive UI

---
## ⚙️ Local Development Setup

## 1️⃣ Clone the repo


git clone https://github.com/SajedAtwa/Interview_Tracker.git

cd Interview_Tracker

## 2️⃣ Backend Setup

cd backend

./mvnw spring-boot:run

Backend runs on:
http://localhost:8080

Make sure PostgreSQL is running and your application.yml or application.properties is configured correctly.

## 3️⃣ Frontend Setup

cd frontend

npm install

npm run dev

Frontend runs on:
http://localhost:5173

## 👤 Author

Sajed Atwa

Full-Stack Developer
