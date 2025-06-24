import { Container, Typography, Box, TextField, Button } from "@mui/material";
import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const LoginAndRegisterFormContext = createContext();

export const LoginAndRegisterFormProvider = ({ children }) => {
    const [registrationData, setRegistrationData] = useState({
        email: '',
        role: 'user',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    return (<LoginAndRegisterFormContext.Provider value={{ registrationData, setRegistrationData, errors, setErrors }}>
        {children}
    </LoginAndRegisterFormContext.Provider>);
}

export default LoginAndRegisterFormContext;