import { useState, useEffect } from "react";
import api from "../api";
import { TopicDTO } from "../types/TopicDTO";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import AppNavigationBar from "../components/AppNavigationBar";
import { useNavigate, useParams } from "react-router-dom";

function AddTopicPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<TopicDTO>({
    id: null,
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    // If in edit mode, fetch the topic data
    if (isEditMode && id) {
      fetchTopicData(id);
    }
  }, [id, navigate, isEditMode]);

  const fetchTopicData = async (topicId: string) => {
    setIsInitialLoading(true);
    try {
      // This is a workaround since there's no direct endpoint to get a single topic
      // In a real app, you would have an endpoint like /topic/{id}
      const response = await api.get("/topic/all");
      const topics = response.data;
      const topic = topics.find((t: TopicDTO) => t.id === Number(topicId));

      if (topic) {
        setFormData(topic);
      } else {
        setError("Topic not found");
      }
    } catch (error: any) {
      console.error("Error fetching topic:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load topic. Please try again."
      );
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/topic/save", formData);
      setSuccess(true);

      if (!isEditMode) {
        // Only reset form in add mode, not edit mode
        setFormData({
          id: null,
          title: "",
          description: "",
        });
      }

      // After a short delay, redirect back to topics page
      setTimeout(() => {
        navigate("/topics");
      }, 1500);
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} topic:`,
        error
      );
      setError(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} topic. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  if (isInitialLoading) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppNavigationBar />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppNavigationBar />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            {isEditMode ? "Edit Topic" : "Add New Topic"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Topic Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Topic Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              sx={{ mb: 3 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/topics")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1,
                  px: 3,
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isEditMode ? (
                  "Update Topic"
                ) : (
                  "Add Topic"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={
          isEditMode ? "Topic updated successfully" : "Topic added successfully"
        }
      />
    </Box>
  );
}

export default AddTopicPage;
