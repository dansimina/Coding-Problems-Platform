import { useState, useEffect } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  OutlinedInput,
  ListItemText,
  Checkbox,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DeleteIcon from "@mui/icons-material/Delete";
import { ClassroomDTO } from "../types/ClassroomDTO";
import { ProblemDTO } from "../types/ProblemDTO";
import { HomeworkDTO } from "../types/HomeworkDTO";
import { NewHomeworkDTO } from "../types/NewHomeworkDTO";

function CreateHomeworkPage() {
  const { classroomId, homeworkId } = useParams<{
    classroomId: string;
    homeworkId: string;
  }>();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState<ClassroomDTO | null>(null);
  const [availableProblems, setAvailableProblems] = useState<ProblemDTO[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<ProblemDTO[]>([]);
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);

  // Set initial deadline one week from now
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  // Format date for input field
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Format time for input field (HH:MM)
  const formatTimeForInput = (date: Date): string => {
    return date.toTimeString().substring(0, 5);
  };

  const [date, setDate] = useState(formatDateForInput(oneWeekFromNow));
  const [time, setTime] = useState(formatTimeForInput(oneWeekFromNow));

  const [formData, setFormData] = useState<Partial<HomeworkDTO>>({
    id: null,
    title: "",
    description: "",
    deadline: oneWeekFromNow.toISOString(),
    problems: [],
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is teacher or admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      navigate("/");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.type !== "teacher" && user.type !== "admin") {
      navigate("/");
      return;
    }

    if (!classroomId) {
      navigate("/classrooms");
      return;
    }

    // Check if we're in edit mode
    if (homeworkId) {
      setIsEditMode(true);
    }

    fetchClassroomAndProblems();
  }, [classroomId, homeworkId, navigate]);

  const fetchClassroomAndProblems = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch classroom details
      const classroomResponse = await api.get(`/classroom/${classroomId}`);
      setClassroom(classroomResponse.data);

      // Fetch available problems
      const problemsResponse = await api.get("/problem/all");
      setAvailableProblems(problemsResponse.data);

      // If homeworkId is provided, we're in edit mode regardless of the state variable
      if (homeworkId) {
        console.log("Fetching homework with ID:", homeworkId);
        try {
          const homeworkResponse = await api.get(`/homework/${homeworkId}`);
          console.log("Homework data received:", homeworkResponse.data);
          const homework = homeworkResponse.data;

          // Set form data
          setFormData({
            id: homework.id,
            title: homework.title,
            description: homework.description,
            deadline: homework.deadline,
            problems: homework.problems || [],
          });

          // Set date and time
          const deadlineDate = new Date(homework.deadline);
          setDate(formatDateForInput(deadlineDate));
          setTime(formatTimeForInput(deadlineDate));

          // Set selected problems
          if (homework.problems && homework.problems.length > 0) {
            setSelectedProblems(homework.problems);
            setSelectedProblemIds(
              homework.problems.map((problem: { id: any }) =>
                String(problem.id)
              )
            );
          }
          console.log("Form data updated:", {
            title: homework.title,
            description: homework.description,
            deadline: homework.deadline,
            problemsCount: (homework.problems || []).length,
          });
        } catch (fetchError) {
          console.error("Error fetching homework details:", fetchError);
          setError("Failed to load homework details. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load classroom or problems. Please try again later.");
    } finally {
      setIsLoading(false);
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    updateDeadline(e.target.value, time);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    updateDeadline(date, e.target.value);
  };

  const updateDeadline = (newDate: string, newTime: string) => {
    try {
      // Store the date and time exactly as entered, without timezone conversion
      const exactDateTimeString = `${newDate}T${newTime}:00`;

      setFormData((prev) => ({
        ...prev,
        deadline: exactDateTimeString,
      }));
    } catch (error) {
      console.error("Error updating deadline:", error);
      setError("Invalid date or time format");
    }
  };

  const handleProblemSelection = (event: SelectChangeEvent<string[]>) => {
    const selectedIds = event.target.value as string[];
    setSelectedProblemIds(selectedIds);

    // Find the full problem objects from the available problems array
    const selectedProblemObjects = availableProblems.filter((problem) =>
      selectedIds.includes(String(problem.id))
    );

    setSelectedProblems(selectedProblemObjects);
    setFormData((prev) => ({
      ...prev,
      problems: selectedProblemObjects,
    }));
  };

  const handleRemoveProblem = (problemIdToRemove: number | null) => {
    if (problemIdToRemove === null) return;

    const updatedSelectedIds = selectedProblemIds.filter(
      (id) => id !== String(problemIdToRemove)
    );
    setSelectedProblemIds(updatedSelectedIds);

    const updatedProblems = selectedProblems.filter(
      (problem) => problem.id !== problemIdToRemove
    );
    setSelectedProblems(updatedProblems);
    setFormData((prev) => ({
      ...prev,
      problems: updatedProblems,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!classroom) return;
    if (!formData.title || !formData.description || !formData.deadline) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!formData.problems || formData.problems.length === 0) {
      setError("Please select at least one problem for the homework.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const newHomeworkDTO: NewHomeworkDTO = {
        classroomDTO: classroom,
        homeworkDTO: formData as HomeworkDTO,
      };

      if (isEditMode) {
        // If in edit mode, use PUT request to update
        await api.post("/homework/update", newHomeworkDTO);
      } else {
        // If in create mode, use POST request to save
        await api.post("/homework/save", newHomeworkDTO);
      }

      console.log(newHomeworkDTO.homeworkDTO.problems);

      // Redirect to classroom details page after successful submission
      navigate(`/classroom/${classroomId}`);
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} homework:`,
        error
      );
      setError(
        `Failed to ${
          isEditMode ? "update" : "create"
        } homework. Please try again.`
      );
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/classroom/${classroomId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavigationBar />
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            py: 6,
          }}
        >
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavigationBar />

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Classroom
        </Button>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {isEditMode ? "Edit Assignment" : "Create New Assignment"}
          </Typography>

          {classroom && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              {isEditMode ? "Editing" : "Adding"} assignment for:{" "}
              <strong>{classroom.name}</strong>
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Assignment Title */}
              <TextField
                required
                fullWidth
                id="title"
                name="title"
                label="Assignment Title"
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
              />

              {/* Assignment Description */}
              <TextField
                required
                fullWidth
                id="description"
                name="description"
                label="Assignment Description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                variant="outlined"
                placeholder="Provide instructions and context for this assignment"
              />

              {/* Deadline (Date and Time) */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  id="date"
                  label="Deadline Date"
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
                <TextField
                  fullWidth
                  id="time"
                  label="Deadline Time"
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Box>

              {/* Problem Selection */}
              <FormControl fullWidth variant="outlined">
                <InputLabel id="problem-selection-label">
                  Select Problems
                </InputLabel>
                <Select
                  labelId="problem-selection-label"
                  id="problem-selection"
                  multiple
                  value={selectedProblemIds}
                  onChange={handleProblemSelection}
                  input={<OutlinedInput label="Select Problems" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => {
                        const problem = availableProblems.find(
                          (p) => String(p.id) === value
                        );
                        return (
                          <Chip
                            key={value}
                            label={problem?.title}
                            color={
                              problem
                                ? getDifficultyColor(problem.difficulty)
                                : "default"
                            }
                            variant="outlined"
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {availableProblems.map((problem) => (
                    <MenuItem key={problem.id} value={String(problem.id)}>
                      <Checkbox
                        checked={
                          selectedProblemIds.indexOf(String(problem.id)) > -1
                        }
                      />
                      <ListItemText primary={problem.title} />
                      <Chip
                        label={problem.difficulty}
                        size="small"
                        color={getDifficultyColor(problem.difficulty)}
                        sx={{ ml: 1 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Selected Problems List */}
              {selectedProblems.length > 0 && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Selected Problems
                  </Typography>
                  <List>
                    {selectedProblems.map((problem) => (
                      <ListItem
                        key={problem.id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveProblem(problem.id)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        }
                        sx={{
                          mb: 1,
                          borderRadius: 1,
                          bgcolor: "background.paper",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <ListItemIcon>
                          <AssignmentIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={problem.title}
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 0.5,
                              }}
                            >
                              <Chip
                                label={problem.difficulty}
                                size="small"
                                color={getDifficultyColor(problem.difficulty)}
                              />
                              {problem.topics && problem.topics.length > 0 && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Topics:{" "}
                                  {problem.topics
                                    .map((t) => t.title)
                                    .join(", ")}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}

              {error && <Alert severity="error">{error}</Alert>}

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  pt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AssignmentIcon />}
                  disabled={isSubmitting}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : isEditMode ? (
                    "Update Assignment"
                  ) : (
                    "Create Assignment"
                  )}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default CreateHomeworkPage;
