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
  Stack,
  Avatar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { SubmissionDTO } from "../types/SubmissionDTO";
import SubmissionDetailsDialog from "./SubmissionDetailsDialog";

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
      const response = await api.get(`/submission/all/problem/${problemId}`);
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
    setIsDialogOpen(true);
  };

  const handleViewUserProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
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

      {/* Using the new reusable SubmissionDetailsDialog component */}
      <SubmissionDetailsDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        submission={selectedSubmission}
        showUserInfo={true}
        onViewUserProfile={handleViewUserProfile}
      />
    </>
  );
}

export default AllSubmissionsComponent;
