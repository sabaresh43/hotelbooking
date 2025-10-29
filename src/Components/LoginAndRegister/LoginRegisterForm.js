import React, { useState, useEffect, createContext } from "react";
import { Dialog, DialogContent, TextField, Button, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/authSlice";

const LoginAndRegisterFormContext = createContext();

export const LoginAndRegisterFormProvider = ({ children }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  return (
    <LoginAndRegisterFormContext.Provider value={{ loginData, setLoginData, errors, setErrors }}>
      {children}
    </LoginAndRegisterFormContext.Provider>
  );
};

function LoginAndRegisterForm({ open, onClose }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (!isAuthenticated) {
      setEmail("");
      setPassword("");
    }
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      // Store locally
      localStorage.setItem("userEmail", email);

      // Trigger Redux login (your existing logic)
      await dispatch(login({ email, password }));

      setLoading(false);
      handleClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Reset fields when logged out
  useEffect(() => {
    if (!isAuthenticated) {
      setEmail("");
      setPassword("");
    }
  }, [isAuthenticated]);

  return (
    <LoginAndRegisterFormProvider>
      <Dialog maxWidth="xs" fullWidth open={open} onClose={handleClose}>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              align="center"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                mb: 1,
              }}
            >
              Sign In
            </Typography>

            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#062a4eff",
                color: "#fff",
                py: 1.25,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { backgroundColor: "#092847ff" },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </LoginAndRegisterFormProvider>
  );
}

export default LoginAndRegisterForm;
