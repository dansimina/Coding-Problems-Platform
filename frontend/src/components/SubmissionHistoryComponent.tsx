import { useState, useEffect } from "react";
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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { SubmissionDTO } from "../types/SubmissionDTO";
import SubmissionDetailsDialog from "./SubmissionDetailsDialog";

interface SubmissionHistoryProps {
  problemId: number;
}

function SubmissionHistoryComponent({ problemId }: SubmissionHistoryProps) {
  const [submissions, setSubmissions] = useState<SubmissionDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDTO | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchSubmissions();
  }, [problemId]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError("");

    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "null") {
      setError("Please log in to view submissions");
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      const response = await api.get(
        `/user/submissions/${user.id}/${problemId}`
      );
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
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
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedSubmission(null);
    setIsDialogOpen(false);
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
          Your Submissions
        </Typography>

        {submissions.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You haven't submitted any solutions for this problem yet.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Submission #</TableCell>
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
                    <TableCell>{submissions.length - index}</TableCell>
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
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewSubmission(submission)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Using the new reusable SubmissionDetailsDialog component */}
      <SubmissionDetailsDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        submission={selectedSubmission}
        showUserInfo={false} // User info not needed in personal submission history
      />
    </>
  );
}

export default SubmissionHistoryComponent;
