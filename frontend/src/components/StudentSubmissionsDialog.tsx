import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CodeIcon from "@mui/icons-material/Code";
import { SubmissionDTO } from "../types/SubmissionDTO";
import { ProblemDTO } from "../types/ProblemDTO";
import { HomeworkStatusDTO } from "../types/HomeworkStatusDTO";
import api from "../api";
import SubmissionDetailsDialog from "./SubmissionDetailsDialog";

interface StudentSubmissionsDialogProps {
  open: boolean;
  onClose: () => void;
  student: any; // You could use UserDTO type for better typing
  homeworkId: string | undefined;
  problems?: ProblemDTO[]; // Make this optional
  onViewProblem?: (problemId: number | null) => void;
  onViewUserProfile?: (userId: number | null) => void;
}

function StudentSubmissionsDialog({
  open,
  onClose,
  student,
  homeworkId,
  problems = [], // Default to empty array if not provided
  onViewProblem,
}: StudentSubmissionsDialogProps) {
  const [submissions, setSubmissions] = useState<SubmissionDTO[]>([]);
  const [status, setStatus] = useState<HomeworkStatusDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDTO | null>(null);
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (open && student && homeworkId) {
      fetchStudentSubmissions();
    }
  }, [open, student, homeworkId]);

  const fetchStudentSubmissions = async () => {
    if (!student || !homeworkId) return;

    setIsLoading(true);
    setError("");

    try {
      // Use the correct endpoint from your backend
      const response = await api.get(
        `/homework/status/student/${student.id}/homework/${homeworkId}`
      );

      // Check the structure of the response and adapt accordingly
      if (response.data) {
        setStatus(response.data);

        // If submissions are in a submissions property
        if (response.data.submissions) {
          setSubmissions(response.data.submissions);
        } else {
          setSubmissions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching student submissions:", error);
      setError("Failed to load submissions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSubmission = (submission: SubmissionDTO) => {
    setSelectedSubmission(submission);
    setIsSubmissionDialogOpen(true);
  };

  const handleCloseSubmissionDialog = () => {
    setSelectedSubmission(null);
    setIsSubmissionDialogOpen(false);
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

  // Find missing problems (problems that the student hasn't submitted solutions for)
  const getMissingProblems = () => {
    if (!problems || problems.length === 0) return [];

    const submittedProblemIds = submissions.map((sub) => sub.problem.id);
    return problems.filter(
      (problem) => !submittedProblemIds.includes(problem.id)
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="student-submissions-dialog"
    >
      <DialogTitle id="student-submissions-dialog">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 40, height: 40 }}>
              {student && student.firstName
                ? student.firstName.charAt(0).toUpperCase()
                : "?"}
            </Avatar>
            <Typography variant="h6" component="span">
              {student
                ? `${student.firstName} ${student.lastName}'s Submissions`
                : "Student Submissions"}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : submissions.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            No submissions found for this student.
          </Alert>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Problem</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {submission.problem.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {submission.problem.difficulty} Difficulty
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          submission.score === 100 ? "Completed" : "Attempted"
                        }
                        color={submission.score === 100 ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${submission.score}%`}
                        color={getScoreColor(submission.score)}
                        size="small"
                      />
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
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewSubmission(submission)}
                        >
                          View
                        </Button>
                        {onViewProblem && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<CodeIcon />}
                            onClick={() => onViewProblem(submission.problem.id)}
                            color="secondary"
                          >
                            Problem
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Missing Problems Section - only show if problems prop is provided */}
        {!isLoading && !error && problems && problems.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Missing Problems ({getMissingProblems().length})
            </Typography>
            {getMissingProblems().length === 0 ? (
              <Alert severity="success" sx={{ mt: 1 }}>
                Student has submitted solutions for all problems!
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Problem</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getMissingProblems().map((problem) => (
                      <TableRow key={problem.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {problem.title}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label="Not Attempted"
                            color="default"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {onViewProblem && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<CodeIcon />}
                              onClick={() => onViewProblem(problem.id)}
                              color="secondary"
                            >
                              View Problem
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>

      {/* Nested Submission Details Dialog */}
      <SubmissionDetailsDialog
        open={isSubmissionDialogOpen}
        onClose={handleCloseSubmissionDialog}
        submission={selectedSubmission}
        showUserInfo={false}
      />
    </Dialog>
  );
}

export default StudentSubmissionsDialog;
