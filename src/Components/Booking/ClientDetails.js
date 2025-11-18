import { Box, Button, Card, CardContent, Checkbox, Chip, MenuItem, Container, Divider, Grid, Rating, Stack, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import BookingContext from "./BookingContext";
import { Controller, useFormContext } from "react-hook-form";
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserInfoReuseContext } from "./BookRooms";
import { Skeleton } from "@mui/material";
import { trackActivity } from "../../services/hotel.service";
import paymentService from "../../services/paymentService";

function ClientDetails({ nextStep }) {
    const { bookingData, dispatch } = useContext(BookingContext);
    const [useExistingInfo, setUseExistingInfo] = useState(false);
    const { userInfoReuseData } = useContext(UserInfoReuseContext);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const { control, handleSubmit, reset, formState: { errors, isSubmitted, isSubmitSuccessful, isValid }, watch, setError, clearErrors, setValue, getValues }
        = useFormContext();
    const navigate = useNavigate();

    const onSubmit = (data, e) => {
        e.preventDefault();
                        const userData = getValues("clientInfo")

        if (useExistingInfo) {
            if (userInfoReuseData.clientInfo) {
                dispatch({
                    type: "setClientInfo",
                    payload: { data: userInfoReuseData.clientInfo }
                });
            } else {
                console.error("Loading existing client Info failed");
                return;
            }
        } else {
            const clientInfo = getValues("clientInfo");

            // ✅ Collect all guests info
            const guests = [];

            // Primary guest
            guests.push({
                title: clientInfo.title,
                firstName: clientInfo.firstName,
                lastName: clientInfo.lastName
            });

            // Additional guests
            for (let i = 1; i < bookingData.numberOfGuest; i++) {
                const guestData = getValues(`guest${i}`);
                if (guestData && guestData.firstName && guestData.lastName) {
                    guests.push({
                        title: guestData.title,
                        firstName: guestData.firstName,
                        lastName: guestData.lastName
                    });
                }
            }

            dispatch({
                type: "setClientInfo",
                payload: {
                    data: {
                        ...clientInfo,
                        guests: guests
                    }
                }
            });
        }

        // Track guest details entered
        trackActivity("guest_details_entered").catch((err) =>
            console.error("Activity tracking failed:", err)
        );
(async () => {
  const res = await paymentService.createPayment({
    amount: bookingData.totalPrice ||10,
    email: userData.email,
    name: userData.firstName + " " + userData.lastName,
    phone: userData.phone,
  });
console.log("Payment Service Response:", res);
  if (res?.message?.payment_url) {
    window.location.href = res.message.payment_url; // Redirect to HitPay checkout
  }
})();

        nextStep();
        // navigate("payment");
    }

    const handleCheck = (event) => {
        setUseExistingInfo(event.target.checked);
    }



    if (!userInfoReuseData.isLoaded) {
        return (
            <Stack direction="column" spacing={2}>
                <Card sx={{ boxShadow: 3, p: 1 }}>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Personal Details
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Skeleton variant="text" width="40%" height={30} />
                            <Skeleton variant="rectangular" width="100%" height={40} />
                            <Skeleton variant="text" width="40%" height={30} />
                            <Skeleton variant="rectangular" width="100%" height={40} />
                            <Skeleton variant="text" width="40%" height={30} />
                            <Skeleton variant="rectangular" width="100%" height={40} />
                            <Skeleton variant="text" width="40%" height={30} />
                            <Skeleton variant="rectangular" width="100%" height={40} />
                        </Box>
                    </CardContent>
                </Card>
                <Card sx={{ boxShadow: 3, p: 1 }}>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Room Details
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Skeleton variant="text" width="60%" height={30} />
                            <Skeleton variant="rectangular" width="100%" height={60} />
                            <Skeleton variant="text" width="60%" height={30} />
                            <Skeleton variant="rectangular" width="100%" height={60} />
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        );
    } else {
        return (

            <Stack direction="column" spacing={2}>
                <Card component="form" onSubmit={handleSubmit(onSubmit)} sx={{ boxShadow: 3, p: 1 }}>
                    <CardContent>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Personal Details
                        </Typography>
                        <Typography variant="h6">Enter your details</Typography>

                        {isAuthenticated && userInfoReuseData.hasOwnProperty("clientInfo") &&
                            <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ p: 2, border: 1, my: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid size={6}>
                                        <Typography>Title</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography>{userInfoReuseData.clientInfo.title}</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography>First Name</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography>{userInfoReuseData.clientInfo.firstName}</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography>Last Name</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography>{userInfoReuseData.clientInfo.lastName}</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography>Email</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography>{userInfoReuseData.clientInfo.email}</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography>Phone</Typography>
                                    </Grid>
                                    <Grid size={6}>
                                        <Typography>{userInfoReuseData.clientInfo.phone}</Typography>
                                    </Grid>
                                    <Grid size={12} display="flex" flexDirection="row" alignItems="center">
                                        <Typography color="primary" sx={{ mr: 2 }}>
                                            Reuse this information
                                        </Typography>
                                        <Checkbox
                                            value={useExistingInfo}
                                            onChange={handleCheck} />
                                    </Grid>
                                </Grid>
                            </Box>
                        }

                        {!useExistingInfo && <React.Fragment>
                            {/* ✅ Primary Guest Details */}
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                                Primary Guest Details
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 3 }}>
                                    <Controller
                                        control={control}
                                        name="clientInfo.title"
                                        defaultValue="MR."
                                        rules={{ required: { value: true, message: 'Title is required' } }}
                                        render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                select
                                                id={name}
                                                label="Title"
                                                name={name}
                                                error={!!error}
                                                helperText={error ? error.message : null}
                                                value={value}
                                                onChange={onChange}
                                            >
                                                <MenuItem value="MR.">Mr.</MenuItem>
                                                <MenuItem value="MS.">Ms.</MenuItem>
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4.5 }}>
                                    <Controller
                                        control={control}
                                        name="clientInfo.firstName"
                                        defaultValue=""
                                        rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^[a-zA-Z ,.'-]+$/i, message: "Name format is incorrect" } }}
                                        render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id={name}
                                                label="First Name"
                                                name={name}
                                                autoComplete="off"
                                                type="text"
                                                error={!!error}
                                                helperText={error ? error.message : null}
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4.5 }}>
                                    <Controller
                                        control={control}
                                        name="clientInfo.lastName"
                                        defaultValue=""
                                        rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^[a-zA-Z ,.'-]+$/i, message: "Name format is incorrect" } }}
                                        render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id={name}
                                                label="Last Name"
                                                name={name}
                                                autoComplete="off"
                                                type="text"
                                                error={!!error}
                                                helperText={error ? error.message : null}
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            <Controller
                                control={control}
                                name="clientInfo.email"
                                defaultValue=""
                                rules={{ required: { value: true, message: 'Invalid input' }, pattern: { value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: "Email format is incorrect" } }}
                                render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id={name}
                                        label="Email Address"
                                        name={name}
                                        autoComplete="off"
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
                                    pattern: { value: /^[0-9]+$/, message: "Phone number is invalid, it must be 10 digits without any space or other characters" }
                                }}
                                render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id={name}
                                        label="Phone Number"
                                        name={name}
                                        autoComplete="off"
                                        type="tel"
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        value={value}
                                        onChange={onChange}
                                    />
                                )}
                            />

                            {/* ✅ Additional Guests */}
                            {bookingData.numberOfGuest > 1 && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                        Additional Guest Details (Optional)
                                    </Typography>

                                    {Array.from({ length: bookingData.numberOfGuest - 1 }).map((_, index) => (
                                        <Box key={index} sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                            <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
                                                Guest {index + 2}
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 3 }}>
                                                    <Controller
                                                        control={control}
                                                        name={`guest${index + 1}.title`}
                                                        defaultValue="MR."
                                                        render={({ field: { name, value, onChange } }) => (
                                                            <TextField
                                                                fullWidth
                                                                select
                                                                id={name}
                                                                label="Title"
                                                                name={name}
                                                                value={value}
                                                                onChange={onChange}
                                                                autoComplete="off"  // ✅ Disable autofill
                                                            >
                                                                <MenuItem value="MR.">Mr.</MenuItem>
                                                                <MenuItem value="MS.">Ms.</MenuItem>
                                                            </TextField>
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4.5 }}>
                                                    <Controller
                                                        control={control}
                                                        name={`guest${index + 1}.firstName`}
                                                        defaultValue=""
                                                        render={({ field: { name, value, onChange } }) => (
                                                            <TextField
                                                                fullWidth
                                                                id={name}
                                                                label="First Name"
                                                                name={name}
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                                autoComplete="off"  // ✅ Disable autofill
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4.5 }}>
                                                    <Controller
                                                        control={control}
                                                        name={`guest${index + 1}.lastName`}
                                                        defaultValue=""
                                                        render={({ field: { name, value, onChange } }) => (
                                                            <TextField
                                                                fullWidth
                                                                id={name}
                                                                label="Last Name"
                                                                name={name}
                                                                type="text"
                                                                value={value}
                                                                onChange={onChange}
                                                                autoComplete="off"  // ✅ Disable autofill
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))}
                                </>
                            )}
                        </React.Fragment>}
                    </CardContent>
                </Card>

                {bookingData.rooms.map((room, index) => {
                    return (
                        <Card key={room.roomId || room.RoomId || room.HotelSearchCode || index} sx={{ boxShadow: 3, p: 1 }}>
                            <CardContent sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <Typography gutterBottom variant="h6" fontWeight="500">
                                    {room.Description || room.Rooms?.[0] || 'Standard Room'}
                                </Typography>

                                {room.RoomBasis && (
                                    <Chip
                                        label={room.RoomBasis}
                                        color="secondary"
                                        variant="outlined"
                                        sx={{ mb: 1 }}
                                    />
                                )}

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Max guests: {Array.from({ length: room.sleepsCount || bookingData.numberOfGuest }).map((_, k) => (
                                        <PersonIcon key={k} sx={{ verticalAlign: "bottom" }} />
                                    ))}
                                </Typography>

                                {room.tags && room.tags.length > 0 && room.tags.map((tag, i) => (
                                    <Chip
                                        sx={{ mr: 1, textTransform: 'capitalize' }}
                                        label={tag}
                                        key={i}
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}

                                {room.Special && (
                                    <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                                        ✓ {room.Special}
                                    </Typography>
                                )}

                                {!room.NonRef && (
                                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                                        ✓ Free Cancellation until {room.CxlDeadLine}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained" size="large"
                        onClick={handleSubmit(onSubmit)}
                        color="primary"
                        sx={{ my: 1.5, alignSelf: 'flex-end' }}
                    >
                        Next
                    </Button>
                </Box>
            </Stack>
        );
    }
};


export default ClientDetails;