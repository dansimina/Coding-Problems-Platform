import { useState, useEffect } from "react";
import api from "../api";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Snackbar,
  Chip,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import { ProblemDTO } from "../types/ProblemDTO";
import { TopicDTO } from "../types/TopicDTO";
import { TestCaseDTO } from "../types/TestCaseDTO";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function AddProblemPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProblemDTO>({
    id: null,
    title: "",
    author: "",
    description: "",
    constraints: "",
    difficulty: "medium",
    image: null,
    tests: [],
    topics: [],
    officialSolution: null,
  });

  const [availableTopics, setAvailableTopics] = useState<TopicDTO[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [newTestCase, setNewTestCase] = useState<TestCaseDTO>({
    id: null,
    input: "",
    output: "",
    example: true,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch available topics when component mounts
    const fetchTopics = async () => {
      try {
        const response = await api.get("/admin/topics");
        setAvailableTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
        setError("Failed to load topics. Please refresh the page.");
      }
    };

    fetchTopics();

    // Pre-fill author with current user's name if available
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "null") {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        author: `${user.firstName} ${user.lastName}`,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTopicChange = (event: SelectChangeEvent<string[]>) => {
    const selectedTopicTitles = event.target.value as string[];
    setSelectedTopics(selectedTopicTitles);

    // Update the topics in the form data
    const selectedTopicObjects = availableTopics.filter((topic) =>
      selectedTopicTitles.includes(topic.title)
    );

    setFormData((prev) => ({
      ...prev,
      topics: selectedTopicObjects,
    }));
  };

  const handleTestCaseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTestCase((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestCaseCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewTestCase((prev) => ({
      ...prev,
      example: e.target.checked,
    }));
  };

  const handleAddTestCase = () => {
    if (!newTestCase.input || !newTestCase.output) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tests: [...prev.tests, newTestCase],
    }));

    // Reset the new test case form
    setNewTestCase({
      id: null,
      input: "",
      output: "",
      example: true,
    });
  };

  const handleRemoveTestCase = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should not exceed 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setPreviewImage(base64String);
      setFormData((prev) => ({
        ...prev,
        image: base64String,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/admin/problem", formData);
      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        id: null,
        title: "",
        author: "",
        description: "",
        constraints: "",
        difficulty: "medium",
        image: null,
        tests: [],
        topics: [],
        officialSolution: null,
      });
      setSelectedTopics([]);
      setPreviewImage(null);

      // Keep the author field with current user's name
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "null") {
        const user = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          author: `${user.firstName} ${user.lastName}`,
        }));
      }
    } catch (error: any) {
      console.error("Error adding problem:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add problem. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavigationBar />

      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
            Add New Problem
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Stack spacing={3}>
              {/* Problem Title and Difficulty */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Problem Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  sx={{ flexGrow: 1 }}
                />

                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="difficulty-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-label"
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    label="Difficulty"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Author Field */}
              <TextField
                required
                fullWidth
                id="author"
                label="Author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                helperText="The name of the problem author"
              />

              {/* Description */}
              <TextField
                required
                fullWidth
                id="description"
                label="Problem Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={6}
              />

              {/* Constraints */}
              <TextField
                fullWidth
                id="constraints"
                label="Constraints"
                name="constraints"
                value={formData.constraints}
                onChange={handleChange}
                multiline
                rows={3}
                placeholder="e.g., 1 <= n <= 10^5, Time limit: 1s"
              />

              {/* Topics */}
              <FormControl fullWidth>
                <InputLabel id="topics-label">Topics</InputLabel>
                <Select
                  labelId="topics-label"
                  id="topics"
                  multiple
                  value={selectedTopics}
                  onChange={handleTopicChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {availableTopics.map((topic) => (
                    <MenuItem key={topic.title} value={topic.title}>
                      {topic.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Official Solution */}
              <TextField
                fullWidth
                id="officialSolution"
                label="Official Solution (Code)"
                name="officialSolution"
                value={formData.officialSolution || ""}
                onChange={handleChange}
                multiline
                rows={8}
                placeholder="Provide an official solution to the problem (code with comments)"
                sx={{ fontFamily: "monospace" }}
              />

              {/* Image Upload */}
              <Box>
                <Button variant="outlined" component="label">
                  Upload Problem Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                {previewImage && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={previewImage}
                      alt="Problem illustration"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </Box>
                )}
              </Box>
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* Test Cases Section */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Test Cases
            </Typography>

            {/* Display existing test cases */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              {formData.tests.map((test, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{ p: 2, position: "relative" }}
                >
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => handleRemoveTestCase(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="subtitle2">Input:</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontFamily: "monospace",
                          bgcolor: "grey.100",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        {test.input}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Output:</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontFamily: "monospace",
                          bgcolor: "grey.100",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        {test.output}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        component="span"
                        sx={{ mr: 1 }}
                      >
                        Example:
                      </Typography>
                      <Chip
                        size="small"
                        label={test.example ? "Yes" : "No"}
                        color={test.example ? "primary" : "default"}
                      />
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            {/* Add new test case */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Add New Test Case
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  id="input"
                  label="Input"
                  name="input"
                  value={newTestCase.input}
                  onChange={handleTestCaseChange}
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  id="output"
                  label="Output"
                  name="output"
                  value={newTestCase.output}
                  onChange={handleTestCaseChange}
                  multiline
                  rows={3}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={newTestCase.example}
                        onChange={handleTestCaseCheckboxChange}
                        name="example"
                      />
                    }
                    label="Is Example"
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddTestCase}
                    disabled={!newTestCase.input || !newTestCase.output}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                    }}
                  >
                    Add Test Case
                  </Button>
                </Box>
              </Stack>
            </Paper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || formData.tests.length === 0}
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
                ) : (
                  "Add Problem"
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
        message="Problem added successfully"
      />
    </Box>
  );
}

export default AddProblemPage;
