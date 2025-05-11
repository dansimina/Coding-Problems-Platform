import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Divider,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { SubmissionDTO } from "../types/SubmissionDTO";

interface AllSubmissionsProps {
  problemId: number;
}

function AllSubmissionsComponent({ problemId }: AllSubmissionsProps) {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [complexity, setComplexity] = useState<string | null>(null);
  const [isAnalyzingComplexity, setIsAnalyzingComplexity] =
    useState<boolean>(false);

  useEffect(() => {
    fetchAllSubmissions();
  }, [problemId]);

  const fetchAllSubmissions = async () => {
    setIsLoading(true);
    setError("");

    // Check if user has permission to see all submissions
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      setError("Please log in to view submissions");
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);

    // Only allow teachers and admins to see all submissions
    if (user.type !== "teacher" && user.type !== "admin") {
      setError("You don't have permission to view all submissions");
      setIsLoading(false);
      return;
    }

    try {
      // This endpoint needs to be implemented in the backend
      const response = await api.get(`/admin/submissions/problem/${problemId}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching all submissions:", error);
      setError("Failed to load submissions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const handleViewSubmission = (submission: SubmissionDTO) => {
    setSelectedSubmission(submission);
    setComplexity(null);
    setIsDialogOpen(true);
  };

  const handleViewUserProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  const handleCloseDialog = () => {
    setSelectedSubmission(null);
    setComplexity(null);
    setIsDialogOpen(false);
  };

  const parseTestResults = (report: string) => {
    const lines = report.split("\n").filter((line) => line.trim());
    return lines.map((line, index) => {
      const isPassed = line.toLowerCase().includes("pass");
      const isFailed = line.toLowerCase().includes("fail");

      let color: "success" | "error" | "default" = "default";

      if (isPassed) {
        color = "success";
      } else if (isFailed) {
        color = "error";
      }

      return { text: line, color, key: index };
    });
  };

  const handleAnalyzeComplexity = async () => {
    if (!selectedSubmission) return;

    setIsAnalyzingComplexity(true);

    try {
      // TODO: Implement Gemini AI integration
      setTimeout(() => {
        setComplexity("Complexity analysis will be implemented here...");
        setIsAnalyzingComplexity(false);
      }, 1000);
    } catch (error) {
      console.error("Error analyzing complexity:", error);
      setIsAnalyzingComplexity(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          All Submissions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Total submissions: {submissions.length}
        </Typography>

        {submissions.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No submissions have been made for this problem yet.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {submission.user.profilePicture ? (
                            <img
                              src={submission.user.profilePicture}
                              alt=""
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            submission.user.firstName.charAt(0).toUpperCase()
                          )}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {submission.user.firstName}{" "}
                            {submission.user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{submission.user.username}
                          </Typography>
                        </Box>
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
                        <Chip label="Accepted" color="success" size="small" />
                      ) : (
                        <Chip label="Failed" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(submission.submittedAt)}</TableCell>
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
                          onClick={() => handleViewSubmission(submission)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PersonIcon />}
                          onClick={() =>
                            handleViewUserProfile(submission.user.id!)
                          }
                          color="secondary"
                        >
                          Profile
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Submission Details Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Submission Details</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* User Info */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Submitted By
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ width: 48, height: 48 }}>
                    {selectedSubmission.user.profilePicture ? (
                      <img
                        src={selectedSubmission.user.profilePicture}
                        alt=""
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      selectedSubmission.user.firstName.charAt(0).toUpperCase()
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedSubmission.user.firstName}{" "}
                      {selectedSubmission.user.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{selectedSubmission.user.username} •{" "}
                      {selectedSubmission.user.type}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PersonIcon />}
                    onClick={() =>
                      handleViewUserProfile(selectedSubmission.user.id!)
                    }
                    sx={{ ml: "auto" }}
                  >
                    View Profile
                  </Button>
                </Box>
              </Box>

              <Divider />

              {/* Score */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Score
                </Typography>
                <Chip
                  label={`${selectedSubmission.score}%`}
                  color={getScoreColor(selectedSubmission.score)}
                  size="medium"
                />
              </Box>

              {/* Code */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Code
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    overflow: "auto",
                    maxHeight: "400px",
                  }}
                >
                  {selectedSubmission.code}
                </Paper>
              </Box>

              {/* Complexity Analysis Section */}
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Complexity Analysis
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AutoFixHighIcon />}
                    onClick={handleAnalyzeComplexity}
                    disabled={isAnalyzingComplexity}
                    sx={{
                      background:
                        "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                      textTransform: "none",
                    }}
                  >
                    {isAnalyzingComplexity
                      ? "Analyzing..."
                      : "Analyze with Gemini AI"}
                  </Button>
                </Box>

                {complexity && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: "grey.50",
                      minHeight: "100px",
                    }}
                  >
                    <Typography variant="body2">{complexity}</Typography>
                  </Paper>
                )}
              </Box>

              <Divider />

              {/* Test Results */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Test Results
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {parseTestResults(selectedSubmission.report).map((result) => (
                    <Typography
                      key={result.key}
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        color:
                          result.color === "default"
                            ? "text.primary"
                            : `${result.color}.main`,
                      }}
                    >
                      {result.text}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AllSubmissionsComponent;
