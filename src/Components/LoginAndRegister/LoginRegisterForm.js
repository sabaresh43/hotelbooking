import { Container, Typography, Box, TextField, Button, Dialog, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EnterEmail from "./EnterEmail";
import Register from "./Register";
import Login from "./Login";
import { LoginAndRegisterFormProvider } from "./LoginAndRegisterFormContext";
import LoginSuccess from "./LoginSuccess";
import RegisterSuccess from "./RegisterSuccess";
import { useSelector } from "react-redux";

function LoginAndRegisterForm({ open, onClose }) {
    const [currentStep, setCurrentStep] = useState('EnterEmail');
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const handleNavigate = (step) => {
        setCurrentStep(step);
    };

    // if not login, when the dialog closed, return to the enter email page
    const handleClose = () => {
        if (!isAuthenticated) {
            setCurrentStep('EnterEmail');
        }
        onClose();
    }

    // when log out, return to the enter email page
    useEffect(() => {
        if (!isAuthenticated) {
            setCurrentStep('EnterEmail');
        }
    }, [isAuthenticated])

    return (
        <LoginAndRegisterFormProvider>
            <Dialog
                maxWidth="xs"
                fullWidth={true}
                open={open}
                onClose={handleClose} >
                <DialogContent>
                    {currentStep === 'EnterEmail' && <EnterEmail handleNavigate={handleNavigate} onClose={handleClose} />}
                    {currentStep === 'Register' && <Register handleNavigate={handleNavigate} onClose={handleClose} />}
                    {currentStep === 'Login' && <Login handleNavigate={handleNavigate} onClose={handleClose} />}
                    {currentStep === 'LoginSuccess' && <LoginSuccess handleNavigate={handleNavigate} onClose={handleClose} />}
                    {currentStep === 'RegisterSuccess' && <RegisterSuccess handleNavigate={handleNavigate} onClose={handleClose} />}
                </DialogContent>
            </Dialog>
        </LoginAndRegisterFormProvider>
    );

};

export default LoginAndRegisterForm;