import { useState, useRef, useEffect } from "react";
import api from "../api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface GeminiAIDialogProps {
  open: boolean;
  onClose: () => void;
}

function GeminiAIDialog({ open, onClose }: GeminiAIDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hi! I'm GeminiAI. How can I help you with your coding questions today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      sender: "user" as const,
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call the API to get response from GeminiAI
      const response = await api.get("/ask", {
        params: { prompt: inputMessage },
      });

      const aiMessage = {
        sender: "ai" as const,
        text: response.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error asking GeminiAI:", error);
      const errorMessage = {
        sender: "ai" as const,
        text: "Sorry, I had trouble processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: { xs: "90vh", md: "70vh" },
          maxHeight: { xs: "90vh", md: "70vh" },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <SmartToyIcon />
            </Avatar>
            <Typography variant="h6" fontWeight="bold">
              GeminiAI Assistant
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

      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 3,
            bgcolor: "grey.50",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", maxWidth: "70%" }}>
                {message.sender === "ai" && (
                  <Avatar sx={{ mt: 1, mr: 1, bgcolor: "primary.main" }}>
                    <SmartToyIcon />
                  </Avatar>
                )}
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor:
                      message.sender === "user" ? "primary.main" : "white",
                    color: message.sender === "user" ? "white" : "text.primary",
                    borderRadius: 2,
                    borderTopRightRadius: message.sender === "user" ? 0 : 2,
                    borderTopLeftRadius: message.sender === "ai" ? 0 : 2,
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {message.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{
                      mt: 1,
                      textAlign: "right",
                      opacity: 0.7,
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Paper>
                {message.sender === "user" && (
                  <Avatar sx={{ mt: 1, ml: 1, bgcolor: "secondary.main" }}>
                    {localStorage.getItem("user") &&
                    JSON.parse(localStorage.getItem("user")!).firstName
                      ? JSON.parse(localStorage.getItem("user")!)
                          .firstName.charAt(0)
                          .toUpperCase()
                      : "U"}
                  </Avatar>
                )}
              </Box>
            </Box>
          ))}
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", maxWidth: "70%" }}>
                <Avatar sx={{ mt: 1, mr: 1, bgcolor: "primary.main" }}>
                  <SmartToyIcon />
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                    borderTopLeftRadius: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 100,
                    minHeight: 50,
                  }}
                >
                  <CircularProgress size={24} />
                </Paper>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask GeminiAI anything..."
          value={inputMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogActions>
    </Dialog>
  );
}

export default GeminiAIDialog;
