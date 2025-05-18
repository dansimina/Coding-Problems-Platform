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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SubmissionDTO } from "../types/SubmissionDTO";
import api from "../api";
import SubmissionDetailsDialog from "./SubmissionDetailsDialog";

interface StudentSubmissionsDialogProps {
  open: boolean;
  onClose: () => void;
  student: any; // Could be more specific with a UserDTO type
  homeworkId: string | undefined;
}

function StudentSubmissionsDialog({
  open,
  onClose,
  student,
  homeworkId,
}: StudentSubmissionsDialogProps) {
  const [submissions, setSubmissions] = useState<SubmissionDTO[]>([]);
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
      const response = await api.get(
        `/submissions/student/${student.id}/homework/${homeworkId}`
      );
      setSubmissions(response.data);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
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
          <Typography variant="h6" component="span">
            {student
              ? `${student.firstName} ${student.lastName}'s Submissions`
              : "Student Submissions"}
          </Typography>
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
                    <TableCell>
                      {submission.submissionDate
                        ? formatDate(submission.submissionDate)
                        : "N/A"}
                    </TableCell>
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
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewSubmission(submission)}
                      >
                        View Solution
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
