import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import MainPage from "./pages/MainPage";
import AddTopicPage from "./pages/AddTopicPage";
import AddProblemPage from "./pages/AddProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailsPage from "./pages/ProblemDetailsPage";

function LoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigate(location.pathname); // Redirect to the current path
  }, [navigate, location]);

  return null; // Render nothing
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<LoginRedirect />} />
        <Route path="add-topic" element={<AddTopicPage />} />
        <Route path="add-problem" element={<AddProblemPage />} />
        <Route path="problems" element={<ProblemsPage />} />
        <Route path="problems/:id" element={<ProblemDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
