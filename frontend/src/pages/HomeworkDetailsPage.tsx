import { useState, useEffect } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Stack,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CodeIcon from "@mui/icons-material/Code";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import { HomeworkDTO } from "../types/HomeworkDTO";
import { HomeworkStatusDTO } from "../types/HomeworkStatusDTO";
import { ClassroomDTO } from "../types/ClassroomDTO";
import { SubmissionDTO } from "../types/SubmissionDTO";
import SubmissionDetailsDialog from "../components/SubmissionDetailsDialog";
import StudentSubmissionsDialog from "../components/StudentSubmissionsDialog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`homework-tabpanel-${index}`}
      aria-labelledby={`homework-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function HomeworkDetailsPage() {
  const { homeworkId } = useParams<{ homeworkId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [homework, setHomework] = useState<HomeworkDTO | null>(null);
  const [classroom, setClassroom] = useState<ClassroomDTO | null>(null);
  const [studentsStatus, setStudentsStatus] = useState<HomeworkStatusDTO[]>([]);
  const [studentStatus, setStudentStatus] = useState<HomeworkStatusDTO | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDTO | null>(null);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] =
    useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isStudentSubmissionsDialogOpen, setIsStudentSubmissionsDialogOpen] =
    useState<boolean>(false);

  // Check if user is teacher or admin
  const isTeacherOrAdmin =
    user && (user.type === "teacher" || user.type === "admin");

  // Check if user is a student
  const isStudent = user && user.type === "student";

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "null") {
      setUser(JSON.parse(storedUser));
    }

    if (!homeworkId) {
      navigate("/classrooms");
      return;
    }

    fetchHomeworkDetails();
  }, [homeworkId, navigate]);

  const fetchHomeworkDetails = async () => {
    if (!homeworkId) return;

    setIsLoading(true);
    setError("");

    try {
      // Since there's no direct endpoint to get homework by ID,
      // we'll get homework details from the classroom that contains it
      // assuming you have such an endpoint or structure in the backend

      // For demonstration purposes, let's assume we have a way to get the homework by ID
      // This might need to be adjusted based on your actual API structure
      const homeworkResponse = await api.get(`/homework/${homeworkId}`);
      setHomework(homeworkResponse.data);

      // Also fetch the classroom this homework belongs to
      if (homeworkResponse.data.classroomId) {
        const classroomResponse = await api.get(
          `/classroom/${homeworkResponse.data.classroomId}`
        );
        setClassroom(classroomResponse.data);
      }

      // If user is a teacher or admin, fetch students' status for this homework
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "null") {
        const user = JSON.parse(storedUser);
        if (user.type === "teacher" || user.type === "admin") {
          const statusResponse = await api.get(
            `/homework/status/teacher/${homeworkId}`
          );
          setStudentsStatus(statusResponse.data);
        } else if (user.type === "student") {
          // Fetch current student's status for this homework
          const studentStatusResponse = await api.get(
            `/homework/status/student/${user.id}/homework/${homeworkId}`
          );
          setStudentStatus(studentStatusResponse.data);
        }
      }
    } catch (error) {
      console.error("Error fetching homework details:", error);
      setError("Failed to load homework details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    if (classroom && classroom.id) {
      navigate(`/classroom/${classroom.id}`);
    } else {
      navigate("/classrooms");
    }
  };

  const handleViewStudentSubmissions = (student: any) => {
    setSelectedStudent(student);
    setIsStudentSubmissionsDialogOpen(true);
  };

  const handleCloseStudentSubmissionsDialog = () => {
    setSelectedStudent(null);
    setIsStudentSubmissionsDialogOpen(false);
  };

  const handleViewSubmission = (submission: SubmissionDTO) => {
    setSelectedSubmission(submission);
    setIsSubmissionDialogOpen(true);
  };

  const handleCloseSubmissionDialog = () => {
    setSelectedSubmission(null);
    setIsSubmissionDialogOpen(false);
  };

  const handleViewProblem = (problemId: number | null) => {
    if (problemId) {
      navigate(`/problems/${problemId}`);
    }
  };

  const handleViewUserProfile = (userId: number | null) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    if (!homework || !homework.deadline) return false;
    const now = new Date();
    const deadline = new Date(homework.deadline);
    return now > deadline;
  };

  // Calculate time remaining until deadline
  const getTimeRemaining = () => {
    if (!homework || !homework.deadline) return "N/A";

    const now = new Date();
    const deadline = new Date(homework.deadline);

    if (now > deadline) return "Deadline passed";

    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m remaining`;
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
            px: { xs: 3, sm: 4, md: 5 },
          }}
        >
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (error || !homework) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavigationBar />
        <Container sx={{ mt: 4, px: { xs: 3, sm: 4, md: 5 } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 3 }}
          >
            Back
          </Button>
          <Alert severity="error" sx={{ px: 3, py: 2 }}>
            {error || "Homework not found"}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavigationBar />

      <Container
        component="main"
        sx={{ mt: 4, mb: 4, flexGrow: 1, px: { xs: 3, sm: 4, md: 5 } }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Classroom
        </Button>

        {/* Assignment Header */}
        <Paper
          elevation={2}
          sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                {homework.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {homework.description}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={`${homework.problems?.length || 0} Problems`}
                  color="primary"
                  icon={<CodeIcon />}
                />
                <Chip
                  label={`Deadline: ${formatDate(homework.deadline)}`}
                  color={isDeadlinePassed() ? "error" : "default"}
                  variant="outlined"
                />
                {!isDeadlinePassed() && (
                  <Chip
                    label={getTimeRemaining()}
                    color="secondary"
                    variant="outlined"
                  />
                )}

                {isStudent && studentStatus && (
                  <Chip
                    icon={
                      studentStatus.submissions.length ===
                      (homework.problems?.length || 0) ? (
                        <CheckCircleIcon />
                      ) : (
                        <AssignmentIcon />
                      )
                    }
                    label={
                      studentStatus.submissions.length === 0
                        ? "Not Started"
                        : studentStatus.submissions.length ===
                          (homework.problems?.length || 0)
                        ? "Completed"
                        : `${studentStatus.submissions.length}/${
                            homework.problems?.length || 0
                          } Completed`
                    }
                    color={
                      studentStatus.submissions.length === 0
                        ? "default"
                        : studentStatus.submissions.length ===
                          (homework.problems?.length || 0)
                        ? "success"
                        : "warning"
                    }
                    sx={{ fontWeight: "bold" }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Tabs Section */}
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="homework tabs"
              variant="fullWidth"
            >
              <Tab
                label="Problems"
                id="homework-tab-0"
                aria-controls="homework-tabpanel-0"
                icon={<CodeIcon fontSize="small" />}
                iconPosition="start"
              />
              {isTeacherOrAdmin && (
                <Tab
                  label="Students Progress"
                  id="homework-tab-1"
                  aria-controls="homework-tabpanel-1"
                  icon={<PersonIcon fontSize="small" />}
                  iconPosition="start"
                />
              )}
              {isStudent && (
                <Tab
                  label="My Progress"
                  id="homework-tab-1"
                  aria-controls="homework-tabpanel-1"
                  icon={<PersonIcon fontSize="small" />}
                  iconPosition="start"
                />
              )}
            </Tabs>
          </Box>

          {/* Problems Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="bold"
              sx={{ px: { xs: 1, sm: 2 } }}
            >
              Assignment Problems
            </Typography>

            {!homework.problems || homework.problems.length === 0 ? (
              <Alert severity="info" sx={{ mx: { xs: 1, sm: 2 } }}>
                No problems in this assignment.
              </Alert>
            ) : (
              <Grid container spacing={3} sx={{ px: { xs: 1, sm: 2 } }}>
                {homework.problems.map((problem) => (
                  <Grid item xs={12} md={6} key={problem.id}>
                    <Card
                      elevation={1}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="h2"
                            fontWeight="bold"
                          >
                            {problem.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={problem.difficulty}
                            color={getDifficultyColor(problem.difficulty)}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {problem.description.substring(0, 150)}
                          {problem.description.length > 150 ? "..." : ""}
                        </Typography>

                        <Box sx={{ mb: 1 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="div"
                          >
                            Topics:
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            {problem.topics?.map((topic) => (
                              <Chip
                                key={topic.title}
                                label={topic.title}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>

                        {/* Show status badge for student if they have submitted this problem */}
                        {isStudent && studentStatus && (
                          <Box sx={{ mt: 2 }}>
                            {studentStatus.submissions.some(
                              (submission) =>
                                submission.problem.id === problem.id
                            ) ? (
                              <Chip
                                icon={<CheckCircleIcon />}
                                label={
                                  studentStatus.submissions.find(
                                    (submission) =>
                                      submission.problem.id === problem.id
                                  )?.score === 100
                                    ? "Completed"
                                    : "Attempted"
                                }
                                color={
                                  studentStatus.submissions.find(
                                    (submission) =>
                                      submission.problem.id === problem.id
                                  )?.score === 100
                                    ? "success"
                                    : "warning"
                                }
                                size="small"
                              />
                            ) : (
                              <Chip
                                icon={<ErrorIcon />}
                                label="Not Attempted"
                                color="default"
                                size="small"
                              />
                            )}
                          </Box>
                        )}
                      </CardContent>

                      <Divider />

                      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CodeIcon />}
                          onClick={() => handleViewProblem(problem.id)}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: "none",
                          }}
                        >
                          Solve Problem
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>

          {/* Students Progress Tab (Teachers/Admins only) */}
          {isTeacherOrAdmin && (
            <TabPanel value={tabValue} index={1}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ px: { xs: 1, sm: 2 } }}
              >
                Students Progress
              </Typography>

              {studentsStatus.length === 0 ? (
                <Alert severity="info" sx={{ mx: { xs: 1, sm: 2 } }}>
                  No student submissions for this assignment yet.
                </Alert>
              ) : (
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ mx: { xs: 1, sm: 2 } }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student</TableCell>
                        <TableCell align="center">Completed Problems</TableCell>
                        <TableCell align="center">Average Score</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentsStatus.map((status) => {
                        const completedProblems = status.submissions.length;
                        const totalProblems = homework.problems?.length || 0;
                        const averageScore =
                          status.totalScore / (totalProblems || 1);

                        return (
                          <TableRow key={status.user.id} hover>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Avatar
                                  src={status.user.profilePicture}
                                  sx={{ width: 32, height: 32 }}
                                >
                                  {status.user.firstName
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                  >
                                    {status.user.firstName}{" "}
                                    {status.user.lastName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    @{status.user.username}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={`${completedProblems}/${totalProblems}`}
                                color={
                                  completedProblems === totalProblems
                                    ? "success"
                                    : completedProblems > 0
                                    ? "warning"
                                    : "default"
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={`${Math.round(averageScore)}%`}
                                color={getScoreColor(averageScore)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              {completedProblems === 0 ? (
                                <Chip
                                  label="Not Started"
                                  color="default"
                                  size="small"
                                />
                              ) : completedProblems < totalProblems ? (
                                <Chip
                                  label="In Progress"
                                  color="warning"
                                  size="small"
                                />
                              ) : (
                                <Chip
                                  label="Completed"
                                  color="success"
                                  size="small"
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="center"
                              >
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() =>
                                    handleViewStudentSubmissions(status.user)
                                  }
                                >
                                  Submissions
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<PersonIcon />}
                                  onClick={() =>
                                    handleViewUserProfile(status.user.id)
                                  }
                                  color="secondary"
                                >
                                  Profile
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
          )}

          {/* Student's own progress tab */}
          {isStudent && (
            <TabPanel value={tabValue} index={1}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ px: { xs: 1, sm: 2 } }}
              >
                My Progress
              </Typography>

              {!studentStatus ? (
                <Alert severity="info" sx={{ mx: { xs: 1, sm: 2 } }}>
                  You haven't submitted any solutions for this assignment yet.
                </Alert>
              ) : (
                <Box sx={{ px: { xs: 1, sm: 2 } }}>
                  {/* Progress Overview Card */}
                  <Card
                    sx={{
                      mb: 4,
                      borderRadius: 2,
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                    }}
                    elevation={1}
                  >
                    <CardContent sx={{ py: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: "center", p: 2 }}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Completed Problems
                            </Typography>
                            <Typography
                              variant="h3"
                              color="primary"
                              fontWeight="bold"
                            >
                              {studentStatus.submissions.length} /{" "}
                              {homework.problems?.length || 0}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (studentStatus.submissions.length /
                                  (homework.problems?.length || 1)) *
                                100
                              }
                              sx={{ mt: 1, height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: "center", p: 2 }}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Average Score
                            </Typography>
                            <Typography
                              variant="h3"
                              fontWeight="bold"
                              color={getScoreColor(
                                studentStatus.totalScore /
                                  (homework.problems?.length || 1)
                              )}
                            >
                              {Math.round(
                                studentStatus.totalScore /
                                  (homework.problems?.length || 1)
                              )}
                              %
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <Chip
                                label={
                                  studentStatus.totalScore /
                                    (homework.problems?.length || 1) >=
                                  80
                                    ? "Excellent!"
                                    : studentStatus.totalScore /
                                        (homework.problems?.length || 1) >=
                                      50
                                    ? "Good progress"
                                    : "Keep practicing"
                                }
                                color={getScoreColor(
                                  studentStatus.totalScore /
                                    (homework.problems?.length || 1)
                                )}
                              />
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: "center", p: 2 }}>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Status
                            </Typography>
                            {studentStatus.submissions.length === 0 ? (
                              <Chip
                                label="Not Started"
                                color="default"
                                size="large"
                                sx={{ mt: 2 }}
                              />
                            ) : studentStatus.submissions.length <
                              (homework.problems?.length || 0) ? (
                              <Chip
                                label="In Progress"
                                color="warning"
                                size="large"
                                sx={{ mt: 2 }}
                              />
                            ) : (
                              <Chip
                                label="Completed"
                                color="success"
                                size="large"
                                sx={{ mt: 2 }}
                              />
                            )}
                            <Box sx={{ mt: 2 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {isDeadlinePassed()
                                  ? "Deadline has passed"
                                  : getTimeRemaining()}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Problems Status Table */}
                  <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                    Problem Status
                  </Typography>
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ mb: 3 }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Problem</TableCell>
                          <TableCell>Difficulty</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell align="center">Score</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {homework.problems?.map((problem) => {
                          const submission = studentStatus.submissions.find(
                            (sub) => sub.problem.id === problem.id
                          );
                          return (
                            <TableRow key={problem.id} hover>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {problem.title}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  label={problem.difficulty}
                                  color={getDifficultyColor(problem.difficulty)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                {submission ? (
                                  submission.score === 100 ? (
                                    <Chip
                                      label="Completed"
                                      color="success"
                                      size="small"
                                    />
                                  ) : (
                                    <Chip
                                      label="Attempted"
                                      color="warning"
                                      size="small"
                                    />
                                  )
                                ) : (
                                  <Chip
                                    label="Not Started"
                                    color="default"
                                    size="small"
                                  />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                {submission ? (
                                  <Chip
                                    label={`${submission.score}%`}
                                    size="small"
                                    color={getScoreColor(submission.score)}
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<CodeIcon />}
                                    onClick={() =>
                                      handleViewProblem(problem.id)
                                    }
                                    color={submission ? "secondary" : "primary"}
                                    sx={{
                                      borderRadius: 1.5,
                                      textTransform: "none",
                                    }}
                                  >
                                    {submission ? "Try Again" : "Solve Problem"}
                                  </Button>

                                  {submission && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<VisibilityIcon />}
                                      onClick={() =>
                                        handleViewSubmission(submission)
                                      }
                                      sx={{
                                        borderRadius: 1.5,
                                        textTransform: "none",
                                      }}
                                    >
                                      View Solution
                                    </Button>
                                  )}
                                </Box>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </TabPanel>
          )}
        </Paper>
      </Container>

      {/* Submission Details Dialog */}
      <SubmissionDetailsDialog
        open={isSubmissionDialogOpen}
        onClose={handleCloseSubmissionDialog}
        submission={selectedSubmission}
        showUserInfo={false}
      />

      {/* Student Submissions Dialog */}
      <StudentSubmissionsDialog
        open={isStudentSubmissionsDialogOpen}
        onClose={handleCloseStudentSubmissionsDialog}
        student={selectedStudent}
        homeworkId={homeworkId}
      />
    </Box>
  );
}

export default HomeworkDetailsPage;
