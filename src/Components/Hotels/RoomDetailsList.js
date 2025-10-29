import { useContext, useState } from 'react';
import {
    Card,
    Typography,
    Chip,
    Box,
    Button,
    Dialog,
    DialogContent,
    Alert,
    Stack,
    Fab,
    CardMedia,
} from '@mui/material';

import BookingContext from '../Booking/BookingContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



function RoomDetailsList({ rooms }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const role = useSelector(state => state.auth.role);
    const { bookingData, dispatch } = useContext(BookingContext);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);

    const handleSelect = (room) => {
        if (isAuthenticated && role === 'admin') {
            setOpenDialog(true);
            return;
        }
        let roomBasePrice = room.TotalPrice || 0; // Already for full duration
        let totalNonInclusiveTax = 0;

        // Add non-inclusive taxes to the total
        if (room.Tax && room.Tax.length > 0) {
            room.Tax.forEach(tax => {
                if (tax.Inclusive === "Not Inclusive") {
                    totalNonInclusiveTax += tax.Amount;
                }
            });
        }

        const finalTotalPrice = roomBasePrice + totalNonInclusiveTax;

        // ✅ Normalize room structure for BookingContext
        const normalizedRoom = {
            // GoGlobal fields
            HotelSearchCode: room.HotelSearchCode,
            RoomId: room.HotelSearchCode, // Use as unique ID
            roomId: room.HotelSearchCode,

            // Room details
            Description: room.Rooms?.[0] || 'Standard Room',
            RoomBasis: room.RoomBasis,

            // Pricing
            baseRate: room.TotalPrice || 0,
            TotalPrice: room.TotalPrice || 0,
            Currency: room.Currency || 'USD',

            // Tax information
            Tax: room.Tax || [],
            Fee: room.Fee || [],

            // Additional info
            NonRef: room.NonRef,
            CxlDeadLine: room.CxlDeadLine,
            Availability: room.Availability,
            Special: room.Special,
            Fee: room.Fee,

            // For display compatibility
            sleepsCount: bookingData.numberOfGuest || 2,
            tags: room.Special ? [room.Special] : [],

            // Cancellation
            CancellationPolicies: room.CancellationPolicies,
            Remark: room.Remark
        };


        dispatch({
            type: "setBookingDetails",
            payload: {
                data: {
                    rooms: [normalizedRoom],
                    totalPrice: finalTotalPrice
                }
            }
        });

        navigate("booking");
    };

    return (
        <>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Available Rooms
            </Typography>

            <Stack spacing={3} sx={{ mb: 5 }}>
                {rooms.map((room, index) => {
                    const roomName = room.Rooms?.[0] || 'Standard Room';
                    const totalPrice = room.TotalPrice || 0;
                    const currency = room.Currency || 'USD';
                    const roomBasis = room.RoomBasis || 'Room Only';
                    const basePrice = room.TotalPrice || 0;
                    const isRefundable = !room.NonRef;
                    const special = room.Special || '';

                    // ✅ Calculate taxes
                    const inclusiveTaxes = room.Tax?.filter(t => t.Inclusive === "Inclusive") || [];
                    const nonInclusiveTaxes = room.Tax?.filter(t => t.Inclusive === "Not Inclusive") || [];
                    const totalNonInclusiveTax = nonInclusiveTaxes.reduce((sum, tax) => sum + tax.Amount, 0);
                    const finalPrice = basePrice + totalNonInclusiveTax;

                    return (
                        <Card key={room.HotelSearchCode || index} sx={{ display: 'flex', borderRadius: 2, boxShadow: 3 }}>
                            <Box sx={{ position: 'relative', width: 220, height: 220, flexShrink: 0, borderRadius: '8px 0 0 8px', overflow: 'hidden' }}>
                                <CardMedia
                                    component="img"
                                    image="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg"
                                    alt={roomName}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />

                            </Box>

                            <Stack direction="row" justifyContent="space-between" alignItems="center" flex={1} p={2}>
                                <Stack spacing={1} flex={1}>
                                    <Typography variant="h6" fontWeight={600}>
                                        {roomName}
                                    </Typography>

                                    <Chip
                                        label={roomBasis}
                                        size="small"
                                        color="secondary"
                                        sx={{ width: 'fit-content' }}
                                    />

                                    {special && (
                                        <Typography variant="body2" color="primary" fontWeight={500}>
                                            {special}
                                        </Typography>
                                    )}

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Chip
                                            label={isRefundable ? "Eligable for Partial / Full Refund" : "Non-Refundable"}
                                            size="small"
                                            color={isRefundable ? "success" : "default"}
                                            variant="outlined"
                                        />
                                    </Stack>

                                    {room.CxlDeadLine && isRefundable && (
                                        <Typography variant="caption" color="text.secondary">
                                            Cancel before: {room.CxlDeadLine}
                                        </Typography>
                                    )}

                                    {room.Remark && (
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                            {room.Remark.substring(0, 150)}...
                                        </Typography>
                                    )}
                                </Stack>

                                <Stack spacing={1} alignItems="flex-end" sx={{ minWidth: 200 }}>
                                    <Typography variant="h5" color="primary" fontWeight={700}>
                                        {currency} {totalPrice.toFixed(2)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Total for {bookingData.duration} night{bookingData.duration > 1 ? 's' : ''}
                                    </Typography>

                                    {/* ✅ Show tax breakdown */}
                                    {inclusiveTaxes.length > 0 && (
                                        <Typography variant="caption" color="success.main">
                                            (Taxes included)
                                        </Typography>
                                    )}

                                    {nonInclusiveTaxes.length > 0 && (
                                        <Typography variant="caption" color="warning.main">
                                           Includes {currency} {totalNonInclusiveTax.toFixed(2)} taxes
                                        </Typography>
                                    )}

                                    <Button
                                        variant="contained"
                                        onClick={() => handleSelect(room)}
                                        sx={{ minWidth: 150, mt: 2 }}
                                        disabled={isAuthenticated && role === 'admin'}
                                    >
                                        Book Now
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                    );
                })}
            </Stack>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent>
                    <Stack spacing={2}>
                        <Alert severity="error">
                            You can't book rooms as an admin. Please sign out or login as a user.
                        </Alert>
                        <Button variant="outlined" onClick={() => setOpenDialog(false)}>Close</Button>
                    </Stack>
                </DialogContent>
            </Dialog>

            <Fab
                color="primary"
                aria-label="back"
                sx={{ position: 'fixed', bottom: 50, right: 50 }}
                onClick={() => navigate(-1)}
                variant="extended"
            >
                <ArrowBackIcon sx={{ mr: 1 }} /> Back
            </Fab>
        </>
    );
}

export default RoomDetailsList;
