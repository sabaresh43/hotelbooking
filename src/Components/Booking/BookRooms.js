import { Box, Card, CardContent, CircularProgress, Container, Divider, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
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
import { useMediaQuery, useTheme } from "@mui/material";

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
    const [activeStep, setActiveStep] = useState(0); //stepper value
    const { bookingData } = useContext(BookingContext);
    const [userInfoReuseData, userInfoReuseDispatch] = useReducer(userInfoReuseReducer, { isLoaded: false });
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

    const methods = useForm({
        defaultValues: {
            clientInfo: {
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

            // if userData found
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

        // load user profile data if logged in
        if (sessionKey) {
            loadUserProfile();
        }

        userInfoReuseDispatch({
            type: 'setIsLoaded'
        });
    }, [sessionKey]);

    // use to control the stepper status
    const nextStep = () => {
        setActiveStep(activeStep + 1);
    };

    const prevStep = () => {
        setActiveStep(activeStep - 1);
    };

    if (!bookingData.hasOwnProperty("hotel") || !bookingData.hasOwnProperty("rooms")) {
        return (<CircularProgress />);
    } else {
        return (<FormProvider {...methods}>
            <AdminRestrictedRoute>
                <Container sx={{ margin: 'auto', mb: 3 }} >
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
                                            {bookingData.hotel.HotelName}
                                        </Typography>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <LocationOnIcon color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {bookingData.hotel.Address
                                                    ? `${bookingData.hotel.Address.StreetAddress}, ${bookingData.hotel.Address.City}, ${bookingData.hotel.Address.StateProvince}, ${bookingData.hotel.Address.PostalCode}, ${bookingData.hotel.Address.Country}`
                                                    : 'Address not available'}
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
                                        <Typography color="text.secondary" mt={2}>Total length of stay:</Typography>
                                        <Typography variant="body1">{bookingData.duration} {bookingData.duration > 1 ? "nights" : "night"}</Typography>
                                        <Typography color="text.secondary" mt={1}>You selected</Typography>
                                        <Typography variant="body1">{bookingData.rooms.length} {bookingData.rooms.length > 1 ? "rooms" : "room"} for {bookingData.numberOfGuest} {bookingData.numberOfGuest > 1 ? "guests" : "guest"}</Typography>
                                        {bookingData.rooms.map((room) => (
                                            <Typography key={room.RoomId} variant="body2" mt={0.5}>{room.Description}</Typography>
                                        ))}
                                    </CardContent>
                                </Card>
                                <Card sx={{ boxShadow: 3 }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>Your price summary</Typography>
                                        <Box sx={{ display: "flex", flexWrap: 'wrap', justifyContent: { md: "space-between" }, bgcolor: "primary.main", color: "common.white", p: 2, borderRadius: 1 }}>
                                            <Typography variant="h5">Price</Typography>
                                            <Typography variant="h5">CAD {bookingData.totalPrice.toFixed(2)}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Stack>}
                        <UserInfoReuseContext.Provider value={{ userInfoReuseData, userInfoReuseDispatch }}>
                            <Routes>
                                <Route path="/" >
                                    <Route index element={<ClientDetails nextStep={nextStep} />}>
                                    </Route>
                                    <Route path="payment" element={<BookingPayment nextStep={nextStep} prevStep={prevStep}
                                    />}> </Route>
                                    <Route path="review" element={<BookingReview nextStep={nextStep} prevStep={prevStep}
                                    />}></Route>
                                    <Route path="success" element={<BookingSuccess />}></Route>
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