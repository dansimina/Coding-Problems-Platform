import { useState, useEffect } from "react";
import api from "../api";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import AppNavigationBar from "../components/AppNavigationBar";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { UserDTO } from "../types/UserDTO";
import { useNavigate } from "react-router-dom";

function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);

  useEffect(() => {
    // Load current user from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(storedUser));

    fetchUsers();
  }, [navigate]);

  // Filter users when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/user/all");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewProfile = (userId: number | null) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "admin":
        return "error";
      case "teacher":
        return "primary";
      case "student":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppNavigationBar />

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Users Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View all users in the system
          </Typography>
        </Box>

        {/* Search Box */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <TextField
            fullWidth
            placeholder="Search users by username..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    edge="end"
                    aria-label="clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          {searchQuery && (
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                label={`Search: ${searchQuery}`}
                onDelete={() => setSearchQuery("")}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
        </Paper>

        {/* Users Table */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : filteredUsers.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6">No users found</Typography>
            <Typography variant="body2" color="text.secondary">
              Try changing your search criteria
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                All Users ({filteredUsers.length})
              </Typography>
              <Box>
                <Chip
                  label={`Admins: ${
                    filteredUsers.filter((u) => u.type === "admin").length
                  }`}
                  color="error"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`Teachers: ${
                    filteredUsers.filter((u) => u.type === "teacher").length
                  }`}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`Students: ${
                    filteredUsers.filter((u) => u.type === "student").length
                  }`}
                  color="success"
                  size="small"
                />
              </Box>
            </Box>

            <Divider />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Account Type</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar
                            src={user.profilePicture || undefined}
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: getUserTypeColor(user.type),
                            }}
                          >
                            {user.firstName?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {user.id === currentUser?.id ? "(You)" : ""}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>@{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            user.type.charAt(0).toUpperCase() +
                            user.type.slice(1)
                          }
                          size="small"
                          color={getUserTypeColor(user.type)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewProfile(user.id)}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: "none",
                          }}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default UsersPage;
