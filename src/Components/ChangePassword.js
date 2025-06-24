import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { findUserById, updateUser } from '../helpers/users';

function ChangePassword() {
    const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{3,20}$');
    const sessionKey = useSelector(state => state.auth.sessionKey);

    const [userData, setUserData] = useState({});
    const [passwordChanged, setPasswordChanged] = useState(false);

    const [newPassword, setNewPassword] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        setNewPassword({ ...newPassword, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        setErrors({});
        event.preventDefault();

        //verify old password is correct
        try {
            const user = await findUserById(sessionKey);

            //set error message if password is wrong
            if (user.password !== newPassword.oldPassword) {
                setErrors({ ...errors, PasswordIncorrect: "The old password you entered is incorrect, please try again" });
                return;
            } else {
                setUserData(user);
            }
        } catch (error) {
            console.error('Error during changing password:', error);
            setErrors({ ...errors, errorDuringRegister: 'An error occurred during changing password' });
            return;
        }

        // update new password
        try {

            const newData = {
                ...userData,
                isActive: true,
                password: newPassword.password
            };

            const isUpdated = await updateUser(sessionKey, newData);

            if (isUpdated) {
                setPasswordChanged(true);
                setErrors({});
                setNewPassword({
                    oldPassword: '',
                    password: '',
                    confirmPassword: ''
                });
                setUserData({});
            } else {
                console.error('Error during changing password:');
                setErrors({ ...errors, errorDuringUpdate: 'An error occurred during updating password' });
            }
        } catch (error) {
            console.error('Error during changing password:', error);
            setErrors({ ...errors, errorDuringUpdate: 'An error occurred during updating password' });
        }

    };

    useEffect(() => {
        const errorsObject = {};
        const { password, confirmPassword } = newPassword;

        if (password.trim() && confirmPassword.trim()) {
            //new password format wrong
            if (!passwordRegex.test(password)) {
                errorsObject.passwordFormat = "password format is wrong, please use a minimum of 3 characters, including uppercase letters, lowercase letters and numbers.";
            } else if (password.trim() !== confirmPassword.trim()) { //passwords not matching
                errorsObject.passwordNotMatch = "Passwords are not matching";
            }
        }
        setErrors(errorsObject);
    }, [newPassword.password, newPassword.confirmPassword]);

    // when password changed, set the alert to disappear 5 seconds later
    // notice that only when the passwordChanged is set to true, the alert would show
    useEffect(() => {
        const timer = setTimeout(() => {
            setPasswordChanged(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [passwordChanged]);


    return (<Container maxWidth="sm">
        <Typography component="h1" variant="h5" gutterBottom sx={{ mt: 1 }}>
            Change password
        </Typography>
        <Typography variant="body" gutterBottom>
            Use a minimum of 3 characters, including uppercase letters, lowercase letters and numbers.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="oldPassword"
                label="Please enter your old password"
                name="oldPassword"
                autoComplete="oldPassword"
                type="password"
                value={newPassword.oldPassword}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="New Password"
                name="password"
                autoComplete="password"
                type="password"
                value={newPassword.password}
                onChange={handleChange}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Re-enter your new password"
                name="confirmPassword"
                autoComplete="confirmPassword"
                type="password"
                value={newPassword.confirmPassword}
                onChange={handleChange}
            />
            <Button type="submit"
                variant="contained"
                sx={{ my: 2, display: 'flex', justifySelf: 'center' }} disabled={Object.values(newPassword).some(value => !value.trim()) || Object.keys(errors).includes('passwordNotMatch') || Object.keys(errors).includes('passwordFormat')}
            >Change Password</Button>
            {Object.keys(errors).length > 0 &&
                <Alert severity="error" sx={{ display: 'flex', justifySelf: 'center' }}>
                    {Object.keys(errors).map((key) => (
                        <label key={key}>
                            {errors[key]}
                        </label>
                    ))}
                </Alert>}
            {passwordChanged && <Alert severity="success">New password saved!</Alert>}
        </Box>
    </Container>);
}

export default ChangePassword;