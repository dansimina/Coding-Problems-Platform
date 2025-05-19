import { useState, useEffect } from "react";
import api from "../api";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { TopicDTO } from "../types/TopicDTO";
import { useNavigate } from "react-router-dom";

function TopicsPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<TopicDTO[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<TopicDTO[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.type !== "admin") {
      navigate("/");
      return;
    }

    fetchTopics();
  }, [navigate]);

  // Filter topics when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTopics(topics);
      return;
    }

    const filtered = topics.filter((topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTopics(filtered);
  }, [searchQuery, topics]);

  const fetchTopics = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/topic/all");
      setTopics(response.data);
      setFilteredTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setError("Failed to load topics. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddTopic = () => {
    navigate("/add-topic");
  };

  const handleEditTopic = (topic: TopicDTO) => {
    navigate(`/edit-topic/${topic.id}`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavigationBar />

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Topics Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTopic}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Add New Topic
          </Button>
        </Box>

        {/* Search Box */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <TextField
            fullWidth
            placeholder="Search topics by title..."
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
        </Paper>

        {/* Topics Table */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : filteredTopics.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h6">No topics found</Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? "Try changing your search criteria"
                : "Add topics to get started"}
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
                All Topics ({filteredTopics.length})
              </Typography>
            </Box>

            <Divider />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="30%">Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="center" width="15%">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTopics.map((topic) => (
                    <TableRow key={topic.id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {topic.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {topic.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Topic">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditTopic(topic)}
                            sx={{
                              borderRadius: 1.5,
                              textTransform: "none",
                            }}
                          >
                            Edit
                          </Button>
                        </Tooltip>
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

export default TopicsPage;
