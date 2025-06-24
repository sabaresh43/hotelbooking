import { Alert, Box, Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import UserProfileContext from "./UserProfileContext";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import { updateUser } from "../../helpers/users";

function UserProfileCardInfo() {
    const sessionKey = useSelector(state => state.auth.sessionKey);
    const [infoChanged, setInfoChanged] = useState(false);
    const { userProfile, dispatch, loadUserProfile } = useContext(UserProfileContext);
    const { control, handleSubmit, reset, formState: { errors, isSubmitted, isSubmitSuccessful, isValid }, watch, setError, clearErrors, setValue, getValues }
        = useFormContext();

    const onSubmit = async (data, e) => {
        e.preventDefault();
        var cardInfoData = getValues("cardInfo");
        // card number trim
        const trimmedCardNumber = watchCardNumber.replace(/\s+/g, '');
        const cardNumberRegex = new RegExp('^[0-9]{16}$');
        if (trimmedCardNumber && !cardNumberRegex.test(trimmedCardNumber)) {
            setError("cardInfo.cardNumber", { type: "format", message: "The card number is invalid, it should be 16 digits." })
            return;
        } else {
            setValue("cardInfo.cardNumber", trimmedCardNumber);
            clearErrors("cardInfo.cardNumber");
        }

        // check exp date
        var today = new Date(); // gets the current date
        var today_mm = (today.getMonth() + 1); // extracts the month portion
        var today_yy = (today.getFullYear() % 100); // extracts the year portion and changes it from yyyy to yy format

        if (today_mm < 10) { // if today's month is less than 10
            today_mm = '0' + today_mm // prefix it with a '0' to make it 2 digits
        }

        var today_yymm = today_yy.toString().concat(today_mm.toString());

        var mm = cardInfoData.expDate.substring(0, 2); // get the mm portion of the expiryDate (first two characters)
        var yy = cardInfoData.expDate.substring(2); // get the yy portion of the expiryDate (from index 3 to end)
        var yymm = yy.concat(mm);

        if (Number(today_yymm) > Number(yymm)) {
            setError("cardInfo.expDate", { type: "custom", message: "The card has expried" });
            return;
        }

        //set address to upper cases
        setValue("cardInfo.address", {
            ...cardInfoData.address,
            street: cardInfoData.address.street.toUpperCase(),
            city: cardInfoData.address.city.toUpperCase(),
            province: cardInfoData.address.province.toUpperCase(),
            country: cardInfoData.address.country.toUpperCase()
        });

        cardInfoData = getValues("cardInfo");

        const newData = {
            ...userProfile,
            cardInfo: cardInfoData
        }

        const isUpdated = await updateUser(sessionKey, newData);
        if (isUpdated) {
            loadUserProfile();
            setInfoChanged(true);
        }

    }

    const watchCardNumber = watch("cardInfo.cardNumber");
    useEffect(() => {
        const trimmedCardNumber = watchCardNumber ? watchCardNumber.replace(/\s/g, '') : '';
        const cardNumberRegex = new RegExp('^[0-9]{16}$');
        if (trimmedCardNumber && !cardNumberRegex.test(trimmedCardNumber)) {
            setError("cardInfo.cardNumber", { type: "format", message: "The card number is invalid, it should be 16 digits." })
        } else {
            clearErrors("cardInfo.cardNumber")
        }
    }, [watchCardNumber, setError, clearErrors]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setInfoChanged(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [infoChanged]);

    useEffect(() => {
        if (userProfile.hasOwnProperty('cardInfo')) {
            setValue("cardInfo", userProfile.cardInfo);
        }
    }, [userProfile]);

    if (!userProfile) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    } else {
        return (<Grid container component="form" sx={{ mx: 2 }} onSubmit={handleSubmit(onSubmit)} rowSpacing={1} columnSpacing={3}>
            <Grid size={{ xs: 12 }}>
                <Typography component="h1" variant="h5" >
                    Card Info
                </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>Save time for your next booking by providing the information below</Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    control={control}
                    name="cardInfo.cardName"
                    defaultValue=""
                    rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^[a-zA-Z ,.'-]+$/i, message: "Name format is incorrect" } }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="Name on card"
                            name={name}
                            autoComplete="cc-name"
                            variant="standard"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    control={control}
                    name="cardInfo.cardNumber"
                    defaultValue=""
                    rules={{ required: { value: true, message: 'Invalid input' }, minLength: { value: 16, message: 'The length should be 16' } }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="Card number"
                            name={name}
                            autoComplete="cc-number"
                            variant="standard"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : "16 digits"}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    control={control}
                    name="cardInfo.expDate"
                    defaultValue=""
                    rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^([0-9]{4})$/, message: "Expiry date format is incorrect, it should be 4 digits (MMYY), like 1225 for 12, 2025" } }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="Expiry date"
                            name={name}
                            autoComplete="cc-exp"
                            variant="standard"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : "MMYY, e.g. \"1225\""}
                            value={value}

                            onChange={onChange}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    control={control}
                    name="cardInfo.cvv"
                    defaultValue=""
                    rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^[0-9]{3}$/, message: "CVV format is incorrect, it should be 3 digits" } }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="CVV"
                            name={name}
                            autoComplete="cc-csc"
                            variant="standard"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : "Last three digits on signature strip"}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Typography component="h1" variant="h5" sx={{ mt: 3 }}>
                    Billing Address
                </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    control={control}
                    name="cardInfo.address.street"
                    defaultValue=""
                    rules={{ required: { value: true, message: 'Invalid input' } }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="Street"
                            name={name}
                            autoComplete="billing address-Street"
                            variant="standard"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    control={control}
                    name="cardInfo.address.city"
                    defaultValue=""
                    rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/, message: "City format is incorrect" } }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="City"
                            name={name}
                            variant="standard"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    control={control}
                    name="cardInfo.address.province"
                    defaultValue=""
                    rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^(?:AB|BC|MB|N[BLTSU]|ON|PE|QC|SK|YT){1}$/, message: "Province format is wrong, it should be 2 upper case letters" } }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="State/Province/Region"
                            name={name}
                            variant="standard"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : "2 upper case letters, e.g. \"ON\""}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    control={control}
                    name="cardInfo.address.postalCode"
                    defaultValue=""
                    rules={{
                        required: { value: true, message: 'Invalid input' }, pattern: {
                            value: /^([ABCEGHJKLMNPRSTVXY][0-9][A-Z](?: [0-9][A-Z][0-9])?)$/
                            , message: "Postal code format is incorrect, it should be like \"M1A 1M1\" or \"M1A1M1\""
                        }
                    }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="Postal Code"
                            name={name}
                            variant="standard"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : "e.g. \"M1A 1M1\""}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                    control={control}
                    name="cardInfo.address.country"
                    defaultValue=""
                    rules={{
                        required: { value: true, message: 'Invalid input' }, pattern: {
                            value: /^[A-Za-z\s.-]+$/
                            , message: "Country format is incorrect"
                        }
                    }}
                    render={({ field: { name, value, onChange }, fieldState: { error }, formState }) => (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id={name}
                            label="Country"
                            name={name}
                            variant="standard"
                            type="text"
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained" size="large"
                    onClick={handleSubmit(onSubmit)}
                    color="primary"
                    sx={{ mt: 2, alignSelf: 'center', width: "20%" }}  // Align the button to the end of the flex container
                >
                    Save
                </Button>
            </Grid>
            {infoChanged && <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Alert severity="success">Information Saved!</Alert>
            </Grid>}
        </Grid >);
    }
}

export default UserProfileCardInfo;