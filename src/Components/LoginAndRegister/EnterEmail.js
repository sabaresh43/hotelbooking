import { Typography, Box, TextField, Button } from "@mui/material";
import React, { useContext } from 'react';
import Alert from '@mui/material/Alert';
import LoginAndRegisterFormContext from "./LoginAndRegisterFormContext";
import { findUserByEmail } from "../../helpers/users";

function EnterEmail({ handleNavigate }) {
    const { registrationData, setRegistrationData, errors, setErrors } = useContext(LoginAndRegisterFormContext);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // match the format
        if (!registrationData.email.toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            setErrors({ ...errors, emailFormat: "Email format is incorrect" });
            return;
        }

        // check if the email has been registered
        try {
            const user = await findUserByEmail(registrationData.email);
            if (user) {
                handleNavigate("Login")
                //navigate('Login');
            } else {
                handleNavigate("Register")
                //navigate('Register');
            }
            setErrors({});
        } catch (error) {
            console.error('Error during fetching all users data:', error);
            setErrors({ ...errors, errorDuringRegister: 'An error occurred during findAll users' });
            return;
        }
    };

    const handleChange = (event) => {
        setRegistrationData({ ...registrationData, [event.target.name]: event.target.value });
    };

    return (<Box sx={{ justifyContent: 'flex-start', p: 2, margin: 'auto' }}>
        <Typography component="h1" variant="h5" gutterBottom>
            Sign in or create an account
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
            You can sign in using your account to access our services.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={registrationData.email}
                onChange={handleChange}
            />
            <Button type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, textTransform: 'none', fontSize: '1rem' }} disabled={!registrationData.email.trim()}>Continue with email</Button>
            {<Alert severity="error" sx={{ visibility: Object.keys(errors).length > 0 ? 'visible' : 'hidden' }}>{Object.keys(errors).map((key) => (
                <label key={key} sx={{ my: 1 }}>
                    {errors[key]}
                </label>
            ))}</Alert>}
        </Box>
    </Box>);
}

export default EnterEmail;