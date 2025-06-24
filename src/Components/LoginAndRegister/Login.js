import { Container, Typography, Box, TextField, Button } from "@mui/material";
import React, { useState, useEffect, useContext } from 'react';
import Alert from '@mui/material/Alert';
import LoginAndRegisterFormContext from "./LoginAndRegisterFormContext";
import { useDispatch } from 'react-redux';
import { login } from '../../features/authSlice';
import { userLogin } from "../../helpers/authentication";

function Login({ handleNavigate }) {
    const dispatch = useDispatch();

    const { registrationData, setRegistrationData, errors, setErrors } = useContext(LoginAndRegisterFormContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // find the user and compare password, have to use findAll as we can't directly find user by email
        try {
            const loginResponse = await userLogin(registrationData.email, registrationData.password);
            const user = loginResponse.user;
            // if password matched, log in
            if (user) {
                setErrors({});
                dispatch(login({ username: user.email, sessionKey: user._id, role: user.role, token: loginResponse.token }));
                handleNavigate("LoginSuccess");
            } else {
                setErrors({ PasswordIncorrect: "The password you entered is incorrect, please try again" });
                return;
            }
        } catch (error) {
            console.error('Error during fetching all users:', error);
            setErrors({ ...errors, errorDuringRegister: 'An error occurred during login' });
            return;
        }

        setErrors({});
        setRegistrationData({
            email: '',
            role: 'user',
            password: '',
            confirmPassword: ''
        });
    };

    const handleChange = (event) => {
        setRegistrationData({ ...registrationData, [event.target.name]: event.target.value });
    };

    return (<Box sx={{ justifyContent: 'flex-start', p: 2, margin: 'auto' }}>
        <Typography component="h1" variant="h5" gutterBottom>
            Enter your password
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
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
            <Button type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2 }} disabled={!registrationData.password.trim()}>Login</Button>
            {<Alert severity="error" sx={{ visibility: Object.keys(errors).length > 0 ? 'visible' : 'hidden' }}>{Object.keys(errors).map((key) => (
                <label key={key} sx={{ my: 1 }}>
                    {errors[key]}
                </label>
            ))}</Alert>}
        </Box>
    </Box>);
}

export default Login;