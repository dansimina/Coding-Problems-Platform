import { useState } from "react";
import Login from "../components/Login";
import { UserDTO } from "../types/UserDTO";

function HomePage() {
  const [user, setUser] = useState<UserDTO | null>(null);

  const handleLogin = (user: UserDTO) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  return (
    <div>
      {!user ? <Login onLogin={handleLogin} /> : <h1>Welcome back!</h1>}
    </div>
  );
}

export default HomePage;
