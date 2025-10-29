import { Box, Card, CardContent, CircularProgress, Container, Divider, Stack, Step, StepLabel,Alert, Stepper, Typography } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import BookingContext from "./BookingContext";
import dayjs from "dayjs";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { FormProvider, useForm } from "react-hook-form";
import ClientDetails from "./ClientDetails";
import BookingPayment from "./BookingPayment";
import BookingReview from "./BookingReview"
import BookingSuccess from "./BookingSuccess";
import AdminRestrictedRoute from "../../AdminRestrictedRoute";
import { useSelector } from "react-redux";
import { findUserById } from "../../helpers/users";
import { useMediaQuery, useTheme, Chip } from "@mui/material";

const steps = ['Booking details', 'Payment details', 'Review your booking'];

export const UserInfoReuseContext = createContext();

const userInfoReuseReducer = (state, action) => {
    switch (action.type) {
        case 'setClientInfo':
            return {
                ...state,
                clientInfo: action.payload.data
            }
        case 'setCardInfo':
            return {
                ...state,
                cardInfo: action.payload.data
            }
        case 'setIsLoaded':
            return {
                ...state,
                isLoaded: true
            }
        default: return state;
    }
};

function BookRooms() {
    const sessionKey = useSelector(state => state.auth.sessionKey);
    const [activeStep, setActiveStep] = useState(0);
    const { bookingData } = useContext(BookingContext);
    const [userInfoReuseData, userInfoReuseDispatch] = useReducer(userInfoReuseReducer, { isLoaded: false });
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

const methods = useForm({
    defaultValues: {
        clientInfo: {
            title: 'MR.',
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        },
        cardInfo: {
            cardName: '',
            cardNumber: '',
            expDate: '',
            cvv: '',
            address: {
                street: '',
                city: '',
                province: '',
                country: ''
            }
        }
    }
});

    useEffect(() => {
        const loadUserProfile = async () => {
            var userData;

            try {
                const responseData = await findUserById(sessionKey);
                userData = responseData;
            } catch (error) {
                console.error('Error during finding user:', error);
            }

            if (userData) {
                if (userData.clientInfo) {
                    userInfoReuseDispatch({
                        type: 'setClientInfo',
                        payload: {
                            data: userData.clientInfo
                        }
                    });
                }
                if (userData.cardInfo) {
                    userInfoReuseDispatch({
                        type: 'setCardInfo',
                        payload: {
                            data: userData.cardInfo
                        }
                    });
                }
            }
        }

        if (sessionKey) {
            loadUserProfile();
        }

        userInfoReuseDispatch({
            type: 'setIsLoaded'
        });
    }, [sessionKey]);

    const nextStep = () => {
        setActiveStep(activeStep + 1);
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };

    if (!bookingData.hasOwnProperty("hotel") || !bookingData.hasOwnProperty("rooms")) {
        return (<CircularProgress />);
    } else {
        // ✅ Handle both old and new hotel structures
        const hotelName = bookingData.hotel.name || bookingData.hotel.hotelName || 'Hotel';
        const hotelAddress = bookingData.hotel.address
            ? `${bookingData.hotel.address.street}, ${bookingData.hotel.address.city}, ${bookingData.hotel.address.province}, ${bookingData.hotel.address.postalCode}, ${bookingData.hotel.address.country}`
            : bookingData.hotel.location || 'Address not available';

        return (
            <FormProvider {...methods}>
                <AdminRestrictedRoute>
                    <Container sx={{ margin: 'auto', mb: 3 }}>
                        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Stack direction="row">
                            {!bookingData.isBookingSuccess &&
                                <Stack direction="column" spacing={2} sx={{ mr: 2, width: "35%" }}>
                                    <Card sx={{ boxShadow: 3, mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" color="text.secondary">
                                                Hotel Info
                                            </Typography>
                                            <Typography variant="h6" gutterBottom>
                                                {hotelName}
                                            </Typography>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <LocationOnIcon color="action" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {hotelAddress}
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{ boxShadow: 3, mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>Your booking details</Typography>
                                            <Stack direction={{ xs: 'column', lg: 'row' }} alignItems="flex-start" spacing={2} divider={<Divider orientation={isLgUp ? "vertical" : 'horizontal'} flexItem />}>
                                                <Box>
                                                    <Typography color="text.secondary">Check-in</Typography>
                                                    <Typography variant="subtitle1">{dayjs(bookingData.from).format('dddd, MMMM D, YYYY')}</Typography>
                                                    <Typography variant="body2">From 16:00</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography color="text.secondary">Check-out</Typography>
                                                    <Typography variant="subtitle1">{dayjs(bookingData.to).format('dddd, MMMM D, YYYY')}</Typography>
                                                    <Typography variant="body2">Until 12:00</Typography>
                                                </Box>
                                            </Stack>
                                            <Typography color="text.secondary" mt={1}>You selected</Typography>
<Typography variant="body1">
    {bookingData.rooms.length} × {bookingData.rooms[0]?.Description || 'Room'}
</Typography>
<Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
    <Typography variant="body2" fontWeight={600}>
        {bookingData.rooms.length} {bookingData.rooms.length > 1 ? "rooms" : "room"} of this type
    </Typography>
    <Typography variant="body2">
        {bookingData.rooms[0]?.Description || bookingData.rooms[0]?.Rooms?.[0] || 'Room'}
    </Typography>
    {bookingData.rooms[0]?.RoomBasis && (
        <Chip
            label={bookingData.rooms[0].RoomBasis}
            size="small"
            sx={{ mt: 0.5 }}
        />
    )}
</Box>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{ boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>Your price summary</Typography>
                                            {bookingData.rooms.map((room, index) => {
                                                // ✅ Calculate tax breakdown
                                                const allTaxes = room.Tax || [];
            const inclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Inclusive");
            const nonInclusiveTaxes = allTaxes.filter(t => t.Inclusive === "Not Inclusive");
            const totalNonInclusiveTax = nonInclusiveTaxes.reduce((sum, tax) => sum + tax.Amount, 0);
            const basePrice = room.TotalPrice || room.baseRate || 0;
            const currency = room.Currency || 'USD';
                                                return (
                                                    <Box key={index} sx={{ mb: 2 }}>
                                                        <Stack direction="row" justifyContent="space-between">
                                                            <Typography variant="body2">
                                                                Room price ({bookingData.duration} {bookingData.duration > 1 ? 'nights' : 'night'})
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {room.Currency || 'USD'} {basePrice.toFixed(2)}
                                                            </Typography>
                                                        </Stack>

                                                        {/* ✅ Show inclusive taxes */}
                                                        {inclusiveTaxes.length > 0 && (
                                                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                                                <Typography variant="caption" color="success.main">
                                                                    Taxes & fees 
                                                                </Typography>
                                                                <Typography variant="caption" color="success.main">
                                                                    Included
                                                                </Typography>
                                                            </Stack>
                                                        )}

                                                        {/* ✅ Show non-inclusive taxes */}
                                                        {nonInclusiveTaxes.length > 0 && (
                                                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                                                <Typography variant="caption" color="warning.main">
                                                                    Tax
                                                                </Typography>
                                                                <Typography variant="caption" color="warning.main">
                                                                    {room.Currency || 'USD'} {totalNonInclusiveTax.toFixed(2)}
                                                                </Typography>
                                                            </Stack>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                           
                                            <Divider sx={{ my: 1 }} />
                                            <Box sx={{ display: "flex", flexWrap: 'wrap', justifyContent: "space-between", bgcolor: "primary.main", color: "common.white", p: 2, borderRadius: 1 }}>
                                                <Typography variant="h5">Total Price</Typography>
                                                <Typography variant="h5">
                                                    {bookingData.rooms[0]?.Currency || 'USD'} {bookingData.totalPrice.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Stack>}
                            <UserInfoReuseContext.Provider value={{ userInfoReuseData, userInfoReuseDispatch }}>
                                <Routes>
                                    <Route path="/">
                                        <Route index element={<ClientDetails nextStep={nextStep} />} />
                                        <Route path="payment" element={<BookingPayment nextStep={nextStep} prevStep={prevStep} />} />
                                        <Route path="review" element={<BookingReview nextStep={nextStep} prevStep={prevStep} />} />
                                        <Route path="success" element={<BookingSuccess />} />
                                    </Route>
                                </Routes>
                            </UserInfoReuseContext.Provider>
                        </Stack>
                    </Container>
                </AdminRestrictedRoute>
            </FormProvider>
        );
    }
}

export default BookRooms;