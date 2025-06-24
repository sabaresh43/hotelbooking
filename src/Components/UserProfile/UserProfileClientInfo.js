import { Alert, Box, Button, CircularProgress, Grid, TextField, Typography, Container } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import UserProfileContext from "./UserProfileContext";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { updateUser } from "../../helpers/users";

function UserProfileClientInfo() {
    const sessionKey = useSelector(state => state.auth.sessionKey);
    const [infoChanged, setInfoChanged] = useState(false);
    const { userProfile, dispatch, loadUserProfile } = useContext(UserProfileContext);
    const { control, handleSubmit, reset, formState: { errors, isSubmitted, isSubmitSuccessful, isValid }, watch, setError, clearErrors, setValue, getValues }
        = useFormContext();

    // update client info
    const onSubmit = async (data, e) => {
        e.preventDefault();
        const clientInfoData = getValues("clientInfo");


        const newData = {
            ...userProfile,
            clientInfo: clientInfoData
        }
        const isUpdated = await updateUser(sessionKey, newData);

        if (isUpdated) {
            loadUserProfile();
            setInfoChanged(true);
        }
    }

    const watchPhone = watch("clientInfo.phone");
    useEffect(() => {
        const phoneNumberRegex = new RegExp('^[0-9]{10}$');
        if (watchPhone.trim() && !phoneNumberRegex.test(watchPhone.trim())) {
            setError("clientInfo.phone", { type: "format", message: "Phone number should be 10 digits" });
        } else {
            clearErrors("clientInfo.phone");
        }
    }, [watchPhone]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setInfoChanged(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [infoChanged]);

    // load client info  if exists
    useEffect(() => {
        if (userProfile.hasOwnProperty('clientInfo')) {
            setValue("clientInfo", userProfile.clientInfo);
        }
    }, [userProfile]);

    if (!userProfile) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    } else {
        return (<Box component="form" sx={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} onSubmit={handleSubmit(onSubmit)} rowSpacing={1} columnSpacing={2}>
            <Typography component="h1" variant="h5" gutterBottom>
                Client Info
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>Save time for your next booking by providing the information below</Typography>
            <Controller
                control={control}
                name="clientInfo.firstName"
                defaultValue=""
                rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^[a-zA-Z ,.'-]+$/i, message: "Name format is incorrect" } }}
                render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id={name}
                        label="First Name"
                        name={name}
                        autoComplete="firstName"
                        type="text"
                        error={!!error}
                        helperText={error ? error.message : null}
                        value={value}
                        onChange={onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="clientInfo.lastName"
                defaultValue=""
                rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^[a-zA-Z ,.'-]+$/i, message: "Name format is incorrect" } }}
                render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id={name}
                        label="Last Name"
                        name={name}
                        autoComplete="lastName"
                        type="text"
                        error={!!error}
                        helperText={error ? error.message : null}
                        value={value}
                        onChange={onChange}
                    />
                )}
            />
            <Controller
                control={control}
                name="clientInfo.email"
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
            <Controller
                control={control}
                name="clientInfo.phone"
                defaultValue=""
                rules={{
                    required: { value: true, message: 'Invalid input' },
                    pattern: { value: /^[0-9]{10}$/, message: "Phone number is invalid, it must be 10 digits without any space or other characters" }
                }}
                render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id={name}
                        label="Phone Number"
                        name={name}
                        autoComplete="phone"
                        type="tel"
                        error={!!error}
                        helperText={error ? error.message : null}
                        value={value}
                        onChange={onChange}
                    />
                )}
            />
            {infoChanged && <Alert severity="success" sx={{ alignSelf: 'end' }}>Information Saved!</Alert>
            }
            <Button
                variant="contained" size="large"
                onClick={handleSubmit(onSubmit)}
                color="primary"
                sx={{ mt: 1, alignSelf: 'end' }}  // Align the button to the end of the flex container
            >
                Save
            </Button>
        </Box >);
    }
}

export default UserProfileClientInfo;