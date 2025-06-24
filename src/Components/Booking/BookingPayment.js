import { Box, Button, Card, CardContent, Checkbox, CircularProgress, Divider, TextField, Typography } from "@mui/material";

import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BookingContext from "./BookingContext";
import Grid from '@mui/material/Grid'; // Grid version 1
import { UserInfoReuseContext } from "./BookRooms";
import { useSelector } from "react-redux";
import Skeleton from '@mui/material/Skeleton';

function BookingPayment({ nextStep, prevStep }) {
    const { bookingData, dispatch } = useContext(BookingContext);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [useExistingInfo, setUseExistingInfo] = useState(false);
    const { userInfoReuseData } = useContext(UserInfoReuseContext);
    const { control, handleSubmit, reset, formState: { errors, isSubmitted, isSubmitSuccessful, isValid }, watch, setError, clearErrors, setValue, getValues }
        = useFormContext();
    const navigate = useNavigate();

    const onSubmit = (data, event) => {
        event.preventDefault();

        if (useExistingInfo) {
            if (userInfoReuseData.cardInfo) {
                dispatch({
                    type: "setCardInfo",
                    payload: { data: userInfoReuseData.cardInfo }
                });
            } else {
                console.error("Loading existing card Info failed");
                return;
            }
        } else {
            const cardInfo = getValues("cardInfo");

            // card number trim, check if card number is valid
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

            var mm = cardInfo.expDate.substring(0, 2); // get the mm portion of the expiryDate (first two characters)
            if (Number(mm) <= 0 || Number(mm) > 12) {
                setError("cardInfo.expDate", { type: "format", message: "The expiry date is invalid" })
                return;
            }

            var yy = cardInfo.expDate.substring(2); // get the yy portion of the expiryDate (from index 2 to end)
            var yymm = yy.concat(mm);

            // check if the card is expired
            if (Number(today_yymm) > Number(yymm)) {
                setError("cardInfo.expDate", { type: "custom", message: "The card has expried" });
                return;
            }

            //set address values to upper cases
            setValue("cardInfo.address", {
                ...cardInfo.address,
                street: cardInfo.address.street.toUpperCase(),
                city: cardInfo.address.city.toUpperCase(),
                province: cardInfo.address.province.toUpperCase(),
                country: cardInfo.address.country.toUpperCase()
            });

            dispatch({
                type: "setCardInfo",
                payload: { data: cardInfo }
            });
        }

        nextStep();
        navigate("../review");
    }

    // check if card number is valid
    const watchCardNumber = watch("cardInfo.cardNumber");
    useEffect(() => {
        const trimmedCardNumber = watchCardNumber ? watchCardNumber.replace(/\s+/g, '') : '';
        const cardNumberRegex = new RegExp('^[0-9]{16}$');
        if (trimmedCardNumber && !cardNumberRegex.test(trimmedCardNumber)) {
            setError("cardInfo.cardNumber", { type: "format", message: "The card number is invalid, it should be 16 digits." })
        } else {
            clearErrors("cardInfo.cardNumber")
        }
    }, [watchCardNumber, setError, clearErrors]);


    const goBack = () => {
        prevStep();
        navigate(-1);
    }

    const handleCheck = (event) => {
        setUseExistingInfo(event.target.checked);
    }

    if (!userInfoReuseData.isLoaded) {
        return (
            <Card sx={{ boxShadow: 3, p: 1.5, mb: 3, maxHeight: '50%' }}>
                <CardContent>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Payment Details
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Skeleton variant="text" width="60%" height={30} />
                        <Skeleton variant="rectangular" width="100%" height={40} />
                        <Skeleton variant="text" width="60%" height={30} />
                        <Skeleton variant="rectangular" width="100%" height={40} />
                        <Skeleton variant="text" width="60%" height={30} />
                        <Skeleton variant="rectangular" width="100%" height={40} />
                        <Skeleton variant="text" width="60%" height={30} />
                        <Skeleton variant="rectangular" width="100%" height={40} />
                    </Box>
                </CardContent>
            </Card>
        );
    } else {
        return (<Card component="form" onSubmit={handleSubmit(onSubmit)} sx={{ boxShadow: 3, p: 1.5, mb: 3, maxHeight: '50%' }}>
            <CardContent>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>Payment Details</Typography>
                {isAuthenticated && userInfoReuseData.hasOwnProperty("cardInfo") &&
                    <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ p: 2, border: 1, my: 2 }}>
                        <Grid container rowSpacing={0} columnSpacing={2}>
                            <Grid size={6}>
                                <Typography>
                                    Card Holder Name
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography>
                                    {userInfoReuseData.cardInfo.cardName}
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography>
                                    Card Number
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography>
                                    {"xxxx-xxxx-xxxx-" + userInfoReuseData.cardInfo.cardNumber.slice(-4)}
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography>
                                    Expiry Date
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography>
                                    {`${userInfoReuseData.cardInfo.expDate.substring(0, 2)}/${userInfoReuseData.cardInfo.expDate.substring(2)}`}
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography>
                                    Billing Address
                                </Typography>
                            </Grid>
                            <Grid size={6}>
                                <Typography>
                                    {userInfoReuseData.cardInfo.address.street}
                                </Typography><Typography>
                                    {userInfoReuseData.cardInfo.address.city}, {userInfoReuseData.cardInfo.address.province}
                                    <Typography>
                                        {userInfoReuseData.cardInfo.address.postalCode}, {userInfoReuseData.cardInfo.address.country.toUpperCase()}
                                    </Typography>
                                </Typography>
                            </Grid>
                            <Grid size={12} display="flex" flexDirection="row" alignItems="center" justifyContent="left">
                                <Typography color="primary" sx={{ mr: 2 }}>
                                    Reuse this information
                                </Typography>
                                <Checkbox
                                    value={useExistingInfo}
                                    onChange={handleCheck} />
                            </Grid>
                        </Grid>
                    </Box>}

                {!useExistingInfo && <React.Fragment>
                    <Typography variant="h6" sx={{ mt: 1 }} >
                        Card Info
                    </Typography>
                    <Grid container rowSpacing={0} columnSpacing={2}>
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
                    </Grid>
                    <Typography variant="h6" sx={{ mt: 5 }} >
                        Billing Address
                    </Typography>
                    <Grid container rowSpacing={0} columnSpacing={2}>
                        <Grid size={12}>
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
                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                control={control}
                                name="cardInfo.address.country"
                                defaultValue=""
                                rules={{
                                    required: { value: true, message: 'Invalid input' },
                                    pattern: { value: /^[A-Za-z\s.-]+$/, message: "Country format is incorrect" }
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
                    </Grid></React.Fragment>}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}> {/* Use flexbox to align the button */}
                    <Button
                        size="large"
                        onClick={goBack}
                        color="primary"
                        sx={{ mt: 2, alignSelf: 'flex-end' }}  // Align the button to the end of the flex container
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained" size="large"
                        onClick={handleSubmit(onSubmit)}
                        color="primary"
                        sx={{ mt: 2, alignSelf: 'flex-end' }}  // Align the button to the end of the flex container
                    >
                        Next
                    </Button>
                </Box>
            </CardContent>
        </Card>);
    }
}

export default BookingPayment;