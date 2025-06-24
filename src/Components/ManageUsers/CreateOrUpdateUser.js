import { Controller, useFormContext } from "react-hook-form";
import React, { useState, useContext, useEffect } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import ManageUsersContext from "./ManageUsersContext";
import { updateUser } from "../../helpers/users";
import { userRegister } from "../../helpers/authentication";

const CreateOrUpdateUser = () => {
    const { control, handleSubmit, reset, formState: { errors, isSubmitted, isSubmitSuccessful, isValid }, watch, setError, clearErrors, setValue, getValues }
        = useFormContext();
    const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{3,20}$');
    const { dispatch, userTable, reloadUserTable } = useContext(ManageUsersContext);

    const resetForm = () => {
        reset({
            _id: null,
            email: '',
            role: 'user',
            password: ''
        });
    };

    // only contains email logic
    const onSubmit = async (data, e) => {
        e.preventDefault();
        const userData = getValues();
        // if the input _id is null, we can create but not update 
        // if is not null, we can update but not create
        if (userData._id === null) {
            if (userTable.itemList.findIndex(item => item.email.toLowerCase() === userData.email.toLowerCase()) !== -1) {
                setError('email', { type: 'custom', message: 'This email has been used by others' });
                return;
            }
        } else if (userTable.itemList.findIndex(u => u.email.toLowerCase() === userData.email.toLowerCase() && u._id !== userData._id) !== -1) {
            setError('email', { type: 'custom', message: 'This email has been used by others' });
            return;
        }

        if (userData._id === null) {
            const response = await userRegister(userData.email, userData.password, userData.role);
            if (response) {
                reloadUserTable();
            }

        } else {
            // update
            const newUserData = { ...userData, isActive: true }; // Create a copy of errors object
            const isUpdated = await updateUser(userData._id, newUserData);

            if (isUpdated) {
                reloadUserTable();
            }
        }
        resetForm();
    };

    const watchId = watch("_id");
    const watchEmail = watch("email");

    const updateDisabled = () => {
        if (!watchId) return true; // If id is null, disable update button
        const existingUser = userTable.itemList.find(user => user.email.toLowerCase() === watchEmail.toLowerCase());
        // Disable update if email exists with different id
        return existingUser && existingUser._id !== watchId;
    };

    const createDisabled = () => {
        if (watchId) return true; // If id is not null, disable create button
        // Disable create if email already exists
        return userTable.itemList.some(user => user.email.toLowerCase() === watchEmail.toLowerCase());
    };

    useEffect(() => {
        if (!watchId) {
            const existingUser = userTable.itemList.find(user => user.email.toLowerCase() === watchEmail.toLowerCase());
            if (existingUser) {
                setError('email', { type: "custom", message: "This email has been used." });
            } else {
                clearErrors("email");
            }
        } else {
            const existingUser = userTable.itemList.find(user => user.email.toLowerCase() === watchEmail.toLowerCase() && user._id !== watchId);
            if (existingUser) {
                setError('email', { type: "custom", message: "This email has been used." });
            } else {
                clearErrors("email");
            }
        }
    }, [watchEmail, watchId, userTable.itemList]);

    const watchPassword = watch("password");
    useEffect(() => {
        if (watchPassword.trim() && !passwordRegex.test(watchPassword)) {
            setError('password', { type: 'format', message: "password format is wrong, please use a minimum of 3 characters, including uppercase letters, lowercase letters, and numbers." });
        } else {
            clearErrors("password");
        }
    }, [watchPassword]);

    return (
        <Grid container spacing={1} component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "30%" }} >
            <Grid size={{ xs: 12 }}>
                <Controller
                    control={control}
                    name="email"
                    defaultValue=""
                    rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: "Email format is incorrect" } }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="Email Address"
                            name={name}
                            autoComplete="email"
                            type="email"
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Controller
                    control={control}
                    name="password"
                    defaultValue=""
                    rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{3,20}$', message: "Password format is incorrect" } }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="Password"
                            name={name}
                            autoComplete="password"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Controller
                    control={control}
                    name="role"
                    defaultValue="user"
                    rules={{ required: { value: true, message: 'Invalid input' } }}
                    render={({ field: { name, value, defaultValue, onChange } }) => (
                        <FormControl fullWidth sx={{ my: 2 }}>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                id={name}
                                required
                                name={name}
                                defaultValue={defaultValue}
                                value={value}
                                label="Role"
                                onChange={onChange}
                            >
                                <MenuItem value={"admin"}>admin</MenuItem>
                                <MenuItem value={"user"}>user</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                />

            </Grid>

            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button id="updateData" variant="contained" type="submit"
                    disabled={!watchEmail.trim() || !watchPassword.trim() || errors.length > 0 || updateDisabled()} onClick={handleSubmit(onSubmit)}>Update</Button>

                <Button id="resetForm" variant="contained" onClick={resetForm}>Reset</Button>

                <Button id="createData" variant="contained" type="submit"
                    disabled={!watchEmail.trim() || !watchPassword.trim() || errors.length > 0 || createDisabled()} onClick={handleSubmit(onSubmit)}>Create</Button>
            </Grid>
        </Grid>);
}

export default CreateOrUpdateUser;