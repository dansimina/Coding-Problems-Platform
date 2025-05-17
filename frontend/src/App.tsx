import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { UserDTO } from "./types/UserDTO";
import MainPage from "./pages/MainPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailsPage from "./pages/ProblemDetailsPage";
import AddProblemPage from "./pages/AddProblemPage";
import AddTopicPage from "./pages/AddTopicPage";
import AuthPage from "./pages/AuthPage";
// Import classroom-related pages
import CreateClassroomPage from "./pages/AddClassroomPage";
import ClassroomsPage from "./pages/ClassroomsPage";
import ClassroomDetailsPage from "./pages/ClassroomDetailsPage";
// Import homework-related pages
import CreateHomeworkPage from "./pages/AddHomeworkPage";
import HomeworkDetailsPage from "./pages/HomeworkDetailsPage";
import UserProfilePage from "./pages/UserProfilePage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
});

// Custom route component for routes requiring authentication with specified roles
interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
}

// In your App.tsx, update the ProtectedRoute function to add more detailed logging:
function ProtectedRoute({ element, allowedRoles = [] }: ProtectedRouteProps) {
  // Get user from localStorage
  const storedUser = localStorage.getItem("user");
  console.log("ProtectedRoute raw storedUser:", storedUser);

  const user =
    storedUser && storedUser !== "null" ? JSON.parse(storedUser) : null;

  console.log("ProtectedRoute checking access...");
  console.log("User object:", user);
  console.log("User type:", user?.type);
  console.log("Allowed roles:", allowedRoles);

  if (!user) {
    console.log("No user found, redirecting to login");
    // No user, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
    console.log(
      `User type ${user.type} not in allowed roles, redirecting to home`
    );
    // User doesn't have the required role, redirect to home
    return <Navigate to="/" replace />;
  }

  console.log("Access granted, rendering protected element");
  // User authenticated and has the required role
  return <>{element}</>;
}

function App() {
  const [user, setUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    // Load user from localStorage on app init
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "null") {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (user: UserDTO) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:id" element={<ProblemDetailsPage />} />
          <Route path="/classrooms" element={<ClassroomsPage />} />
          <Route
            path="/classroom/:classroomId"
            element={<ClassroomDetailsPage />}
          />
          <Route path="/profile/:id" element={<UserProfilePage />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <AuthPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          {/* Homework routes */}
          <Route
            path="/homework/:homeworkId"
            element={<HomeworkDetailsPage />}
          />

          {/* Protected Routes */}
          {/* Admin Routes */}
          <Route
            path="/add-problem"
            element={
              <ProtectedRoute
                element={<AddProblemPage />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="/add-topic"
            element={
              <ProtectedRoute
                element={<AddTopicPage />}
                allowedRoles={["admin"]}
              />
            }
          />

          <Route
            path="/add-classroom"
            element={
              <ProtectedRoute
                element={<CreateClassroomPage />}
                allowedRoles={["teacher", "admin"]}
              />
            }
          />

          <Route
            path="/edit-classroom/:id"
            element={
              <ProtectedRoute
                element={<CreateClassroomPage />}
                allowedRoles={["teacher", "admin"]}
              />
            }
          />

          {/* Route for adding homework */}
          <Route
            path="/add-homework/:classroomId"
            element={
              <ProtectedRoute
                element={<CreateHomeworkPage />}
                allowedRoles={["teacher", "admin"]}
              />
            }
          />

          {/* Catch-all route for undefined routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
