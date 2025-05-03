import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    localStorage.setItem("user", "null");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
