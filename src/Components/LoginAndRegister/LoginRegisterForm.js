import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../features/authSlice';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    TextField,
    Button,
    Alert
} from '@mui/material';

function LoginAndRegisterForm({ open, onClose }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Hardcoded credentials
    const HARDCODED_EMAIL = "employee@company.com";
    const EMPLOYEE_ID = "HR-EMP-00001";
    const TOKEN = "92ff0ef8f5fb1b6:54436a5f1092d34";

    const handleClose = () => {
        if (!isAuthenticated) {
            setEmail("");
            setPassword("");
            setError("");
        }
        onClose();
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            // ✅ Simple hardcoded check
           
                // Login successful
                dispatch(login({
                    username: email,
                    sessionKey: EMPLOYEE_ID,
                    role: 'user',
                    token: TOKEN,
                    employeeId: EMPLOYEE_ID
                }));
                
                setEmail("");
                setPassword("");
                handleClose();
           

            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Login failed. Please try again.");
            setLoading(false);
        }
    };

    // Reset fields when logged out
    useEffect(() => {
        if (!isAuthenticated) {
            setEmail("");
            setPassword("");
            setError("");
        }
    }, [isAuthenticated]);

    return (
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
                        Destiin Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 1 }}>
                            {error}
                        </Alert>
                    )}

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

                    <Typography variant="caption" color="text.secondary" align="center">
                        Demo: employee@company.com / password123
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default LoginAndRegisterForm;
