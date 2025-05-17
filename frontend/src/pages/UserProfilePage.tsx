import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import NavigationBar from "../components/NavigationBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import BadgeIcon from "@mui/icons-material/Badge";
import { UserDTO } from "../types/UserDTO";
import { SubmissionDTO } from "../types/SubmissionDTO";
import SubmissionDetailsDialog from "../components/SubmissionDetailsDialog";

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<UserDTO | null>(null);
  const [profileUser, setProfileUser] = useState<UserDTO | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [tabValue, setTabValue] = useState(0);
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Check if viewing own profile
  const isOwnProfile =
    !id || (currentUser && profileUser && currentUser.id === profileUser.id);

  // Check if current user is admin or teacher (for permission checks)
  const isAdminOrTeacher =
    currentUser &&
    (currentUser.type === "admin" || currentUser.type === "teacher");

  // Determine if the current user can view submissions (own profile or admin/teacher)
  const canViewSubmissions = isOwnProfile || isAdminOrTeacher;

  // If no ID is provided and we have a current user, we're viewing our own profile
  useEffect(() => {
    if (!id && currentUser?.id) {
      navigate(`/profile/${currentUser.id}`);
    }
  }, [id, currentUser, navigate]);

  // Load current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(storedUser));
  }, [navigate]);

  // Fetch user profile and submissions
  useEffect(() => {
    if (!currentUser) return;

    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Determine which user's profile to fetch
        const userId = id || currentUser.id;

        // Fetch user profile
        const userResponse = await api.get(`/user/${userId}`);
        setProfileUser(userResponse.data);

        // Fetch user submissions
        const submissionsResponse = await api.get(
          `/submission/all/user/${userId}`
        );
        setSubmissions(submissionsResponse.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, currentUser, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewSubmission = (submission: SubmissionDTO) => {
    // Only allow viewing if user is looking at their own profile or if they're an admin/teacher
    if (canViewSubmissions) {
      setSelectedSubmission(submission);
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setSelectedSubmission(null);
    setIsDialogOpen(false);
  };

  const handleViewProblem = (problemId: number | null) => {
    if (problemId) {
      navigate(`/problems/${problemId}`);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
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

  // Group submissions by problem for Stats tab
  const getSubmissionStats = () => {
    const problemMap = new Map();

    submissions.forEach((submission) => {
      const problemId = submission.problem.id;
      if (!problemMap.has(problemId)) {
        problemMap.set(problemId, {
          problem: submission.problem,
          bestScore: submission.score,
          submissionCount: 1,
          solved: submission.score === 100,
        });
      } else {
        const current = problemMap.get(problemId);
        current.bestScore = Math.max(current.bestScore, submission.score);
        current.submissionCount += 1;
        current.solved = current.solved || submission.score === 100;
      }
    });

    return Array.from(problemMap.values());
  };

  // Calculate overall statistics
  const calculateStats = () => {
    const stats = getSubmissionStats();
    const totalProblems = stats.length;
    const solvedProblems = stats.filter((s) => s.solved).length;
    const easyProblems = stats.filter(
      (s) => s.problem.difficulty === "easy"
    ).length;
    const mediumProblems = stats.filter(
      (s) => s.problem.difficulty === "medium"
    ).length;
    const hardProblems = stats.filter(
      (s) => s.problem.difficulty === "hard"
    ).length;

    return {
      totalProblems,
      solvedProblems,
      easyProblems,
      mediumProblems,
      hardProblems,
      solveRate:
        totalProblems > 0
          ? Math.round((solvedProblems / totalProblems) * 100)
          : 0,
    };
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
          }}
        >
          <CircularProgress />
        </Container>
      </Box>
    );
  }

  if (error || !profileUser) {
    return (
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <NavigationBar />
        <Container sx={{ mt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          <Alert severity="error">{error || "User not found"}</Alert>
        </Container>
      </Box>
    );
  }

  const stats = calculateStats();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavigationBar />

      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        {/* User Profile Header */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              gap: 4,
            }}
          >
            {/* Avatar */}
            <Avatar
              src={profileUser.profilePicture || undefined}
              sx={{
                width: 120,
                height: 120,
                bgcolor: "primary.main",
                fontSize: "3rem",
                fontWeight: "bold",
              }}
            >
              {!profileUser.profilePicture &&
                profileUser.firstName?.charAt(0).toUpperCase()}
            </Avatar>

            {/* User Info */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                {profileUser.firstName} {profileUser.lastName}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BadgeIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Username:</strong> {profileUser.username}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Email:</strong> {profileUser.email}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon color="primary" fontSize="small" />
                    <Typography variant="body1">
                      <strong>Account Type:</strong>{" "}
                      <Chip
                        size="small"
                        label={
                          profileUser.type?.charAt(0).toUpperCase() +
                          profileUser.type?.slice(1)
                        }
                        color={
                          profileUser.type === "admin"
                            ? "error"
                            : profileUser.type === "teacher"
                            ? "primary"
                            : "success"
                        }
                      />
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Statistics Summary */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "grey.50",
                p: 2,
                borderRadius: 2,
                minWidth: 180,
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Problem Solving
              </Typography>

              <Typography
                variant="h4"
                color="primary"
                fontWeight="bold"
                gutterBottom
              >
                {stats.solvedProblems} / {stats.totalProblems}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Solved ({stats.solveRate}%)
              </Typography>

              <Divider sx={{ width: "100%", my: 1 }} />

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Chip
                  size="small"
                  label={`${stats.easyProblems} Easy`}
                  color="success"
                />
                <Chip
                  size="small"
                  label={`${stats.mediumProblems} Medium`}
                  color="warning"
                />
                <Chip
                  size="small"
                  label={`${stats.hardProblems} Hard`}
                  color="error"
                />
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
              aria-label="profile tabs"
              variant="fullWidth"
            >
              <Tab
                label="Submissions"
                id="profile-tab-0"
                aria-controls="profile-tabpanel-0"
                icon={<CodeIcon fontSize="small" />}
                iconPosition="start"
              />
              <Tab
                label="Statistics"
                id="profile-tab-1"
                aria-controls="profile-tabpanel-1"
                icon={<SchoolIcon fontSize="small" />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Submissions Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {isOwnProfile
                ? "My Submissions"
                : `${profileUser.firstName}'s Submissions`}
            </Typography>

            {submissions.length === 0 ? (
              <Alert severity="info">No submissions found.</Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Problem</TableCell>
                      <TableCell>Language</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Submitted At</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              component="span"
                              fontWeight="medium"
                            >
                              {submission.problem.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={submission.problem.difficulty}
                              color={getDifficultyColor(
                                submission.problem.difficulty
                              )}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>{submission.language}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${submission.score}%`}
                            size="small"
                            color={getScoreColor(submission.score)}
                          />
                        </TableCell>
                        <TableCell>
                          {submission.score === 100 ? (
                            <Chip
                              label="Accepted"
                              color="success"
                              size="small"
                            />
                          ) : (
                            <Chip label="Failed" color="error" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(submission.submittedAt)}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            {/* View Submission button - visible if viewing own profile or if admin/teacher */}
                            {canViewSubmissions && (
                              <Tooltip title="View Submission">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() =>
                                    handleViewSubmission(submission)
                                  }
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Go to Problem">
                              <IconButton
                                size="small"
                                color="secondary"
                                onClick={() =>
                                  handleViewProblem(submission.problem.id)
                                }
                              >
                                <CodeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          {/* Statistics Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Problem Solving Statistics
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      gutterBottom
                    >
                      Problems Solved
                    </Typography>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {stats.solvedProblems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      out of {stats.totalProblems} attempted
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      gutterBottom
                    >
                      Success Rate
                    </Typography>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {stats.solveRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      problems solved successfully
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      gutterBottom
                    >
                      Total Submissions
                    </Typography>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {submissions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      across {stats.totalProblems} problems
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Problems by Difficulty */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Problems by Difficulty
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Difficulty</TableCell>
                    <TableCell align="center">Attempted</TableCell>
                    <TableCell align="center">Solved</TableCell>
                    <TableCell align="center">Success Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Chip label="Easy" size="small" color="success" />
                    </TableCell>
                    <TableCell align="center">{stats.easyProblems}</TableCell>
                    <TableCell align="center">
                      {
                        getSubmissionStats().filter(
                          (s) => s.problem.difficulty === "easy" && s.solved
                        ).length
                      }
                    </TableCell>
                    <TableCell align="center">
                      {stats.easyProblems > 0
                        ? `${Math.round(
                            (getSubmissionStats().filter(
                              (s) => s.problem.difficulty === "easy" && s.solved
                            ).length /
                              stats.easyProblems) *
                              100
                          )}%`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Chip label="Medium" size="small" color="warning" />
                    </TableCell>
                    <TableCell align="center">{stats.mediumProblems}</TableCell>
                    <TableCell align="center">
                      {
                        getSubmissionStats().filter(
                          (s) => s.problem.difficulty === "medium" && s.solved
                        ).length
                      }
                    </TableCell>
                    <TableCell align="center">
                      {stats.mediumProblems > 0
                        ? `${Math.round(
                            (getSubmissionStats().filter(
                              (s) =>
                                s.problem.difficulty === "medium" && s.solved
                            ).length /
                              stats.mediumProblems) *
                              100
                          )}%`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Chip label="Hard" size="small" color="error" />
                    </TableCell>
                    <TableCell align="center">{stats.hardProblems}</TableCell>
                    <TableCell align="center">
                      {
                        getSubmissionStats().filter(
                          (s) => s.problem.difficulty === "hard" && s.solved
                        ).length
                      }
                    </TableCell>
                    <TableCell align="center">
                      {stats.hardProblems > 0
                        ? `${Math.round(
                            (getSubmissionStats().filter(
                              (s) => s.problem.difficulty === "hard" && s.solved
                            ).length /
                              stats.hardProblems) *
                              100
                          )}%`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Problem Solving History */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Problem Solving History
            </Typography>

            {getSubmissionStats().length === 0 ? (
              <Alert severity="info">No problems attempted yet.</Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Problem</TableCell>
                      <TableCell>Difficulty</TableCell>
                      <TableCell>Best Score</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Submissions</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getSubmissionStats().map((stat) => (
                      <TableRow key={stat.problem.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {stat.problem.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={stat.problem.difficulty}
                            color={getDifficultyColor(stat.problem.difficulty)}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${stat.bestScore}%`}
                            size="small"
                            color={getScoreColor(stat.bestScore)}
                          />
                        </TableCell>
                        <TableCell>
                          {stat.solved ? (
                            <Chip label="Solved" color="success" size="small" />
                          ) : (
                            <Chip
                              label="Unsolved"
                              color="default"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {stat.submissionCount}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<CodeIcon />}
                            onClick={() => handleViewProblem(stat.problem.id)}
                          >
                            View Problem
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </Paper>
      </Container>

      {/* Submission Details Dialog - only shown to authorized users */}
      {canViewSubmissions && (
        <SubmissionDetailsDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          submission={selectedSubmission}
          showUserInfo={false}
        />
      )}
    </Box>
  );
}

export default UserProfilePage;
