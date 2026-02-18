# Coding Problems Platform

A comprehensive full-stack web application for coding education that enables teachers to create coding problem assignments, manage classrooms, and track student progress. The platform features AI-powered code analysis, automated grading, and real-time collaboration.

## 🌟 Key Features

### For Teachers
- **Classroom Management**: Create and manage multiple classrooms with enrollment keys
- **Problem Creation**: Design coding problems with custom test cases, constraints, and difficulty levels
- **Homework Assignments**: Assign problems to classrooms with deadlines
- **Student Monitoring**: Track student progress, view submissions, and analyze performance
- **AI-Powered Insights**: Get automated complexity analysis of student submissions using AI

### For Students
- **Problem Solving**: Browse and solve coding problems organized by topics and difficulty
- **Multiple Languages**: Submit solutions in various programming languages
- **Instant Feedback**: Receive automated grading with detailed test case results
- **Submission History**: Track your progress and review past submissions
- **Classroom Enrollment**: Join classrooms using enrollment keys and complete homework assignments

### Platform Features
- **Authentication & Authorization**: Secure user authentication with role-based access (Student/Teacher)
- **Topic Organization**: Organize problems by topics for better categorization
- **Test Case Management**: Define input/output test cases for automated validation
- **Real-time Updates**: WebSocket support for live notifications
- **AI Integration**: OpenAI/Gemini integration for code complexity analysis
- **Responsive UI**: Modern, mobile-friendly interface built with Material-UI

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.4.5
- **Language**: Java 24
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security
- **AI Integration**: Spring AI with OpenAI/Gemini API
- **Real-time Communication**: WebSocket (Spring WebSocket)
- **Build Tool**: Maven
- **Additional Libraries**:
  - MapStruct for object mapping
  - Jackson for JSON processing
  - Bean Validation

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Code Quality**: ESLint

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Java Development Kit (JDK)**: Version 24 or higher
- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 12 or higher
- **Maven**: Version 3.6 or higher (or use the included Maven wrapper)
- **Git**: For cloning the repository

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/dansimina/Coding-Problems-Platform.git
cd Coding-Problems-Platform
```

### 2. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE "coding-problems-platform-database";
```

### 3. Backend Configuration

Navigate to the backend directory and configure the application:

```bash
cd backend
```

Edit `src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/coding-problems-platform-database
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password

# AI API Configuration (Optional - for AI features)
spring.ai.openai.api-key=your_api_key_here
```

### 4. Backend Installation & Run

Using Maven wrapper (recommended):
```bash
./mvnw clean install
./mvnw spring-boot:run
```

Or using Maven:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 5. Frontend Configuration & Run

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🏗️ Project Structure

```
Coding-Problems-Platform/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/org/example/backend/
│   │   │   │   ├── business/        # Business logic services
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── data/            # Data access repositories
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── mappers/         # MapStruct mappers
│   │   │   │   ├── model/           # JPA entities
│   │   │   │   └── presentation/    # REST controllers
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── types/           # TypeScript type definitions
    │   ├── api.ts           # API client configuration
    │   └── App.tsx          # Main application component
    ├── package.json
    └── vite.config.ts
```

## 📊 Data Model

### Core Entities
- **User**: Represents both students and teachers with authentication
- **Problem**: Coding challenges with descriptions, constraints, and solutions
- **TestCase**: Input/output pairs for problem validation
- **Submission**: Student solutions with scores and reports
- **Classroom**: Groups of students managed by teachers
- **Homework**: Problem assignments with deadlines
- **Topic**: Categories for organizing problems

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User authentication

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/{id}` - Get problem details
- `POST /api/problems` - Create new problem (Teacher only)
- `PUT /api/problems/{id}` - Update problem
- `DELETE /api/problems/{id}` - Delete problem

### Submissions
- `POST /api/submissions` - Submit solution
- `GET /api/submissions/user/{userId}` - Get user's submissions
- `GET /api/submissions/problem/{problemId}` - Get problem submissions

### Classrooms
- `POST /api/classrooms` - Create classroom (Teacher only)
- `GET /api/classrooms` - List user's classrooms
- `POST /api/classrooms/enroll` - Enroll in classroom (Student)
- `GET /api/classrooms/{id}` - Get classroom details

### Homework
- `POST /api/homework` - Create homework (Teacher only)
- `GET /api/homework/classroom/{classroomId}` - Get classroom homework
- `GET /api/homework/{id}` - Get homework details

### AI Features
- `GET /api/ask?prompt={prompt}` - Ask AI a question
- `POST /api/analyze-complexity/{submissionId}` - Analyze code complexity

### Topics
- `GET /api/topics` - List all topics
- `POST /api/topics` - Create new topic

### Users
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user profile

## 🎨 Features in Detail

### Problem Management
Teachers can create comprehensive coding problems including:
- Problem title, description, and constraints
- Multiple test cases with inputs and expected outputs
- Difficulty levels (Easy, Medium, Hard)
- Official solutions
- Topic categorization
- Image/diagram support

### Automated Grading
The platform automatically evaluates submissions against defined test cases:
- Runs code against all test cases
- Calculates score based on passed tests
- Provides detailed feedback report
- Stores submission history

### AI-Powered Analysis
Integration with OpenAI/Gemini API provides:
- Code complexity analysis (time and space complexity)
- Algorithm explanation
- Code review suggestions
- Natural language problem assistance

### Classroom Collaboration
- Teachers create classrooms with unique enrollment keys
- Students join classrooms using enrollment keys
- Teachers assign homework with deadlines
- Real-time progress tracking
- Submission review and grading

## 🔒 Security Features

- Password encryption using Spring Security
- Role-based access control (Student/Teacher)
- CORS configuration for secure cross-origin requests
- JWT-based authentication (configurable)
- SQL injection prevention through JPA

## 🧪 Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Dan Simina** - *Initial work* - [dansimina](https://github.com/dansimina)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React and Material-UI communities
- OpenAI/Google for AI integration capabilities
- All contributors who help improve this platform

## 📞 Support

For support, questions, or suggestions:
- Open an issue in the GitHub repository
- Contact the maintainers through GitHub

## 🔮 Future Enhancements

Potential features for future development:
- Code execution in isolated containers
- Real-time collaborative coding
- Leaderboards and achievements
- More programming language support
- Advanced analytics and reporting
- Mobile applications
- Integration with IDEs
- Plagiarism detection
- Video tutorials integration
- Discussion forums

---

**Happy Coding!** 🚀
