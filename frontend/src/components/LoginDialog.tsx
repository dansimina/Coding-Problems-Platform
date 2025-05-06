import { useState } from "react";
import api from "../api";
import { LoginDTO } from "../types/LoginDTO";
import { UserDTO } from "../types/UserDTO";
import {
  Alert,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import Register from "./Register";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserDTO) => void;
}

function LoginDialog({ open, onClose, onLoginSuccess }: LoginDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const loginDTO: LoginDTO = {
        username,
        password,
      };

      const response = await api.post<UserDTO>("/login", loginDTO);
      onLoginSuccess(response.data);
      resetForm();
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setError("");
    setActiveTab(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Login" sx={{ py: 2 }} />
          <Tab label="Register" sx={{ py: 2 }} />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        // Login Tab
        <>
          <DialogTitle>
            <Typography variant="h5" align="center" fontWeight="bold">
              Login to Your Account
            </Typography>
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ width: "100%", mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 3 }}
                />

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={handleClose}
                color="inherit"
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                  fontSize: "0.9rem",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </DialogActions>
          </form>
        </>
      ) : (
        // Register Tab - we'll reuse the existing Register component
        <Box sx={{ p: 2 }}>
          <Register
            onRegisterSuccess={(user) => {
              onLoginSuccess(user);
              handleClose();
            }}
          />
        </Box>
      )}
    </Dialog>
  );
}

export default LoginDialog;
