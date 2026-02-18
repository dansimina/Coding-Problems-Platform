# 🖥️ Coding Problems Platform

A full-stack web application for practicing and teaching coding problems. The platform supports multiple user roles (teacher and student), allows code submission and automated evaluation in multiple languages, and includes AI-powered hints and complexity analysis via Google Gemini AI.

---

## Overview

The **Coding Problems Platform** is designed for educational environments where teachers can create coding problems, assign them as homework, and track students' progress. Students can browse problems, submit solutions, view their submission history, and get AI-powered hints. The platform features automated grading with detailed test case feedback and real-time WebSocket support.

---

## ✨ Features

### 👨‍🎓 Students
- Browse and filter coding problems by title or topic
- Submit solutions in **Python** or **C++**
- Receive instant automated grading with detailed per-test-case results
- View submission history and scores
- Get AI-powered hints (via Gemini AI) based on their current code — without revealing the solution
- Enroll in classrooms using an enrollment key
- View homework assignments, deadlines, and track personal progress

### 👨‍🏫 Teachers
- Create and manage classrooms with a unique enrollment key
- Create coding problems with test cases, constraints, difficulty levels, topics, and official solutions
- Create and manage homework assignments with deadlines
- Assign multiple coding problems to each homework
- View all students' progress and submission details per assignment
- Monitor per-student scores and completion status
- Get AI-powered complexity analysis of student submissions

### Platform
- Role-based access control (Student / Teacher)
- Password encryption via Spring Security
- Topic-based problem organization
- WebSocket support for real-time notifications
- Responsive, mobile-friendly UI built with Material-UI

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** (TypeScript) | UI framework |
| **Material UI (MUI) v7** | Component library & styling |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP client for API requests |
| **date-fns** | Date handling |
| **Vite** | Build tool |

### Backend
| Technology | Purpose |
|---|---|
| **Spring Boot 3.4.5** (Java 24) | REST API framework |
| **Spring AI** | AI/LLM integration (Gemini) |
| **Spring Security** | Password encryption |
| **Spring Data JPA / Hibernate** | ORM and database access |
| **Spring WebSocket** | Real-time communication |
| **MapStruct** | Object mapping |
| **Maven** | Build tool |

### Database
- **PostgreSQL** (via JPA repositories)

---

## 🏗️ Architecture

The project follows a classic **3-tier architecture**:

```
┌─────────────────────────────┐
│         Frontend            │
│  React + TypeScript + MUI   │
└────────────┬────────────────┘
             │ HTTP / REST API
┌────────────▼────────────────┐
│         Backend             │
│  Spring Boot REST API       │
│  ┌──────────────────────┐   │
│  │  Controllers (REST)  │   │
│  ├──────────────────────┤   │
│  │  Services (Logic)    │   │
│  ├──────────────────────┤   │
│  │  Repositories (JPA)  │   │
│  └──────────────────────┘   │
└────────────┬────────────────┘
             │
┌────────────▼────────────────┐
│         Database            │
│        PostgreSQL           │
└─────────────────────────────┘
```

---

## 👥 User Roles

| Role | Description |
|---|---|
| `teacher` | Creates and manages problems, classrooms, and assignments; monitors student progress |
| `student` | Solves problems, submits code, enrolls in classrooms, tracks personal progress |

Roles are assigned at registration and stored in the database.

---

## 🧩 Core Modules

### Problems
- Problems include: title, description, constraints, difficulty (`easy` / `medium` / `hard`), optional image, topics, test cases, and an official solution
- Test cases can be marked as **example** (visible to students) or **hidden** (only visible to teachers)
- Teachers can create, edit, and delete problems

**Backend:** `ProblemController` → `ProblemService` → `ProblemRepository`

---

### Topics
- Topics categorize problems (e.g., "Arrays", "Dynamic Programming")
- Problems can be associated with multiple topics
- Students can filter problems by topic on the Problems page

**Backend:** `TopicController` → `TopicService` → `TopicRepository`

---

### Classrooms
- Teachers create classrooms with a name, description, and a unique **enrollment key**
- Students join classrooms using the enrollment key
- Each classroom can have multiple students and multiple homework assignments

**Backend:** `ClassroomController` → `ClassroomService` → `ClassroomRepository`

---

### Homework / Assignments
- Teachers create assignments for a classroom, selecting problems and setting a **deadline**
- Students can view assignment problems and solve them directly from the assignment page
- Scores are calculated based on submissions made **before the deadline**
- Both teachers and students can view progress: completed problems, scores, and submission details

**Backend:** `HomeworkController` → `HomeworkService` → `HomeworkRepository`

---

### Submissions
- Students submit code in **Python** or **C++**
- Code is evaluated against all test cases (see [Code Evaluation](#code-evaluation))
- A score (0–100%) is calculated based on the number of passing test cases
- Detailed per-test-case feedback is provided
- Submission history is available on the problem page and the user profile

**Backend:** `SubmissionController` → `SubmissionService` → `SubmissionRepository`

---

### Users
- Users can view and edit their own profile (name, email, profile picture, password)
- Teachers can view any user's profile and submission history
- The platform displays per-user statistics: problems solved, success rate, difficulty breakdown

**Backend:** `UserController` / `AuthenticationController` → `UserService` → `UserRepository`

---

## 🤖 AI Integration

The platform integrates with **Google Gemini AI** via Spring AI.

### Features
- **Ask for a Hint** — Available on the problem details page. Sends the student's latest code + problem description + official solution (hidden from the student) to Gemini and returns a short, targeted hint (under 100 words) without revealing the solution.
- **Complexity Analysis** — Analyzes a submission and returns the algorithm explanation, time complexity, and space complexity.

**Backend:** `GeminiModelController`

**API Endpoints:**
- `GET /api/ask?prompt={prompt}` — Ask AI a question
- `POST /api/analyze-complexity/{submissionId}` — Analyze code complexity

---

## ⚙️ Code Evaluation

Submitted code is executed in a sandboxed subprocess with a **5-second timeout** per test case.

### Supported Languages

| Language | Evaluator Class | How it works |
|---|---|---|
| **Python** | `PhytonEvaluator` | Writes code to a `.py` temp file, runs it with `python`, feeds input via stdin |
| **C++** | `CPPEvaluator` | Writes code to a `.cpp` temp file, compiles with `g++`, runs the binary, feeds input via stdin |

### Evaluation Flow
1. Code is written to a temporary file
2. For C++: compiled first — compilation errors are returned immediately
3. Each test case is run individually with input passed via stdin
4. Output is compared to expected output (trimmed)
5. A report is generated listing pass/fail per test case
6. Score = `(passed / total) * 100`

**Core classes:** `Evaluator` (abstract), `PhytonEvaluator`, `CPPEvaluator`, `SubmissionEvaluator`, `EvaluationResult`

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **Java 24+**
- **Maven** 3.6+ (or use the included Maven wrapper)
- **PostgreSQL** 12+
- **Python** (for Python code evaluation)
- **g++** (for C++ code evaluation)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/dansimina/Coding-Problems-Platform.git
```

### 2. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE "coding-problems-platform-database";
```

### 3. Backend Configuration

Navigate to the backend directory:

Edit `src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/coding-problems-platform-database
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password

# Gemini AI Configuration (optional — required for AI features)
spring.ai.openai.api-key=YOUR_GEMINI_API_KEY
```

### 4. Run the Backend

Using Maven directly:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.

### 5. Run the Frontend

In a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

---

## 📁 Project Structure

```
Coding-Problems-Platform/
├── backend/
│   └── src/main/java/org/example/backend/
│       ├── presentation/          # REST Controllers
│       │   ├── AuthenticationController.java
│       │   ├── ProblemController.java
│       │   ├── TopicController.java
│       │   ├── ClassroomController.java
│       │   ├── HomeworkController.java
│       │   ├── SubmissionController.java
│       │   ├── UserController.java
│       │   └── GeminiModelController.java
│       │
│       ├── business/              # Services + Evaluators
│       │   ├── ProblemService.java
│       │   ├── TopicService.java
│       │   ├── ClassroomService.java
│       │   ├── HomeworkService.java
│       │   ├── SubmissionService.java
│       │   ├── UserService.java
│       │   └── evaluator/
│       │       ├── Evaluator.java
│       │       ├── PhytonEvaluator.java
│       │       ├── CPPEvaluator.java
│       │       ├── SubmissionEvaluator.java
│       │       └── EvaluationResult.java
│       │
│       ├── data/                  # JPA Repositories
│       ├── dto/                   # Data Transfer Objects
│       ├── mappers/               # MapStruct Entity <-> DTO Mappers
│       ├── model/                 # JPA Entities
│       └── config/                # Configuration classes
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── AuthPage.tsx
        │   ├── MainPage.tsx
        │   ├── ProblemsPage.tsx
        │   ├── ProblemDetailsPage.tsx
        │   ├── AddProblemPage.tsx
        │   ├── TopicsPage.tsx
        │   ├── AddTopicPage.tsx
        │   ├── ClassroomsPage.tsx
        │   ├── ClassroomDetailsPage.tsx
        │   ├── AddClassroomPage.tsx
        │   ├── HomeworkDetailsPage.tsx
        │   ├── AddHomeworkPage.tsx
        │   ├── UsersPage.tsx
        │   └── UserProfilePage.tsx
        │
        ├── components/            # Reusable UI components
        ├── types/                 # TypeScript DTO interfaces
        └── api.ts                 # Axios instance configuration
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/register` — User registration
- `POST /api/login` — User authentication

### Problems
- `GET /api/problems` — List all problems
- `GET /api/problems/{id}` — Get problem details
- `POST /api/problems` — Create new problem (Teacher only)
- `PUT /api/problems/{id}` — Update problem
- `DELETE /api/problems/{id}` — Delete problem

### Submissions
- `POST /api/submissions` — Submit solution
- `GET /api/submissions/user/{userId}` — Get user's submissions
- `GET /api/submissions/problem/{problemId}` — Get problem submissions

### Classrooms
- `POST /api/classrooms` — Create classroom (Teacher only)
- `GET /api/classrooms` — List user's classrooms
- `POST /api/classrooms/enroll` — Enroll in classroom (Student)
- `GET /api/classrooms/{id}` — Get classroom details

### Homework
- `POST /api/homework` — Create homework (Teacher only)
- `GET /api/homework/classroom/{classroomId}` — Get classroom homework
- `GET /api/homework/{id}` — Get homework details

### Topics
- `GET /api/topics` — List all topics
- `POST /api/topics` — Create new topic

### Users
- `GET /api/users` — List all users
- `GET /api/users/{id}` — Get user profile

### AI
- `GET /api/ask?prompt={prompt}` — Ask AI a question
- `POST /api/analyze-complexity/{submissionId}` — Analyze code complexity
