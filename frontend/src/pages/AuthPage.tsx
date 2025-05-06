import { useState } from "react";
import { UserDTO } from "../types/UserDTO";
import { Container, Box, Tabs, Tab, Typography } from "@mui/material";
import Login from "../components/Login";
import Register from "../components/Register";

interface AuthPageProps {
  onLoginSuccess: (user: UserDTO) => void;
}

function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ padding: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #6b73ff 0%, #000dff 100%)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 3,
            pb: 1,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="inherit"
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.7)",
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                minWidth: 100,
                "&.Mui-selected": {
                  color: "white",
                },
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </Box>

        <Box
          sx={{ width: "100%", display: activeTab === 0 ? "block" : "none" }}
        >
          <Login onLogin={onLoginSuccess} />
        </Box>

        <Box
          sx={{ width: "100%", display: activeTab === 1 ? "block" : "none" }}
        >
          <Register onRegisterSuccess={onLoginSuccess} />
        </Box>
      </Box>
    </Container>
  );
}

export default AuthPage;
