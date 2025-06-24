import { Container, Typography, Box, TextField, Button } from "@mui/material";
import React, { useState, useEffect, useContext } from 'react';
import Alert from '@mui/material/Alert';
import LoginAndRegisterFormContext from "./LoginAndRegisterFormContext";
import { userRegister } from "../../helpers/authentication";

function Register({ handleNavigate }) {
    const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{3,20}$');
    const { registrationData, setRegistrationData, errors, setErrors } = useContext(LoginAndRegisterFormContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // check two passwords' matching and format
        if (registrationData.password.trim() !== registrationData.confirmPassword.trim()) {
            setErrors({ ...errors, passwordNotMatch: "Passwords are not matching" });
        } else if (!passwordRegex.test(registrationData.password.trim())) {
            setErrors({ ...errors, passwordFormat: "Password format is wrong" });
        }

        if (Object.keys(errors).length > 0) {
            return;
        }

        const updatedRegistrationData = { ...registrationData }; // Create a copy of errors object
        delete updatedRegistrationData.confirmPassword;

        const response = await userRegister(updatedRegistrationData.email, updatedRegistrationData.password, 'user');
        if (response) {
            handleNavigate("RegisterSuccess")
        } else {
            //console.log("RegisterFailed")
        }

        setErrors({});
        setRegistrationData({
            email: '',
            role: 'user',
            password: '',
            confirmPassword: ''
        });
    };

    useEffect(() => {
        const errorsObject = {};
        const { password, confirmPassword } = registrationData;

        if (password.trim() && confirmPassword.trim()) {
            if (!passwordRegex.test(password)) {
                errorsObject.passwordFormat = "password format is wrong, please use a minimum of 3 characters, including uppercase letters, lowercase letters, and numbers.";
            } else if (password !== confirmPassword.trim()) {
                errorsObject.passwordNotMatch = "Passwords are not matching";
            }
        }
        setErrors(errorsObject);
    }, [registrationData.password, registrationData.confirmPassword, passwordRegex]);



    const handleChange = (event) => {
        setRegistrationData({ ...registrationData, [event.target.name]: event.target.value });
    };

    return (<Container maxWidth="sm">
        <Typography component="h1" variant="h5" gutterBottom sx={{ mt: 1 }}>
            Create password
        </Typography>
        <Typography variant="body" gutterBottom>
            Use a minimum of 3 characters, including uppercase letters, lowercase letters and numbers.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                autoComplete="password"
                type="password"
                value={registrationData.password}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm your password"
                name="confirmPassword"
                autoComplete="confirmPassword"
                type="password"
                value={registrationData.confirmPassword}
                onChange={handleChange}
            />
            <Button type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }} disabled={Object.hasOwn(errors, 'passwordNotMatch') || Object.hasOwn(errors, 'passwordFormat') || Object.values(registrationData).some(value => !value.trim())}>Create Account</Button>
            {<Alert severity="error" sx={{ visibility: Object.keys(errors).length > 0 ? 'visible' : 'hidden' }}>{Object.keys(errors).map((key) => (
                <label key={key}>
                    {errors[key]}
                </label>
            ))}</Alert>}
        </Box>
    </Container>);
}

export default Register;