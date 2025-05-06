import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import MainPage from "./pages/MainPage";

function App() {
  useEffect(() => {
    localStorage.setItem("user", "null");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="login" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
