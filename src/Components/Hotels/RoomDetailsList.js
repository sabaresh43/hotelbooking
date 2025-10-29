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
   
    CardMedia,
    Divider
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
    
    // ✅ Get total rooms needed
    const totalRoomsNeeded = bookingData.occupancy?.reduce((sum, occ) => sum + occ.roomCount, 0) || 1;

    const handleSelect = (room) => {
        if (isAuthenticated && role === 'admin') {
            setOpenDialog(true);
            return;
        }

        // ✅ Calculate price with taxes
        let roomBasePrice = room.TotalPrice || 0;
        let totalNonInclusiveTax = 0;

        if (room.Tax && room.Tax.length > 0) {
            room.Tax.forEach(tax => {
                if (tax.Inclusive === "Not Inclusive") {
                    totalNonInclusiveTax += tax.Amount;
                }
            });
        }

        // ✅ Normalize room structure
        const normalizedRoom = {
            HotelSearchCode: room.HotelSearchCode,
            RoomId: room.HotelSearchCode,
            roomId: room.HotelSearchCode,
            
            Description: room.Rooms?.[0] || 'Standard Room',
            RoomBasis: room.RoomBasis,
            
            baseRate: roomBasePrice,
            TotalPrice: roomBasePrice,
            Currency: room.Currency || 'USD',
            
            Tax: room.Tax || [],
            Fee: room.Fee || [],
            
            NonRef: room.NonRef,
            CxlDeadLine: room.CxlDeadLine,
            Availability: room.Availability,
            Special: room.Special,
            
            sleepsCount: bookingData.numberOfGuest || 2,
            tags: room.Special ? [room.Special] : [],
            
            CancellationPolicies: room.CancellationPolicies,
            Remark: room.Remark
        };

        // ✅ Create array of same room repeated for number of rooms needed
        const roomsArray = Array(totalRoomsNeeded).fill(normalizedRoom);
        
        // ✅ Calculate total price (room price × number of rooms)
        const singleRoomPrice = roomBasePrice + totalNonInclusiveTax;
        const totalPrice = singleRoomPrice * totalRoomsNeeded;

        // ✅ Update context with repeated rooms
        dispatch({
            type: "setBookingDetails",
            payload: {
                data: {
                    rooms: roomsArray,
                    totalPrice: totalPrice
                }
            }
        });

        // ✅ Navigate immediately
        navigate("booking");
    };

    return (
        <>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Available Rooms {totalRoomsNeeded > 1 && `(Select 1 room type for ${totalRoomsNeeded} rooms)`}
            </Typography>

            {/* ✅ Info alert for multiple rooms */}
            {totalRoomsNeeded > 1 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    You are booking {totalRoomsNeeded} rooms. Select any room type and it will be booked {totalRoomsNeeded} times.
                </Alert>
            )}

            <Stack spacing={3} sx={{ mb: 5 }}>
                {rooms.map((room, index) => {
                    const roomName = room.Rooms?.[0] || 'Standard Room';
                    const basePrice = room.TotalPrice || 0;
                    const currency = room.Currency || 'USD';
                    const roomBasis = room.RoomBasis || 'Room Only';
                    const isRefundable = !room.NonRef;
                    const special = room.Special || '';

                    // ✅ Calculate taxes
                    const inclusiveTaxes = room.Tax?.filter(t => t.Inclusive === "Inclusive") || [];
                    const nonInclusiveTaxes = room.Tax?.filter(t => t.Inclusive === "Not Inclusive") || [];
                    const totalNonInclusiveTax = nonInclusiveTaxes.reduce((sum, tax) => sum + tax.Amount, 0);
                    const singleRoomPrice = basePrice + totalNonInclusiveTax;
                    
                    // ✅ Calculate total for all rooms
                    const totalPriceForAllRooms = singleRoomPrice * totalRoomsNeeded;

                    return (
                        <Card 
                            key={room.HotelSearchCode || index} 
                            sx={{ 
                                display: 'flex', 
                                borderRadius: 2, 
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6,
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.3s'
                                }
                            }}
                        >
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
                                            label={isRefundable ? "Eligible for Partial / Full Refund" : "Non-Refundable"}
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

                                <Stack spacing={1} alignItems="flex-end" sx={{ minWidth: 220 }}>
                                    {/* ✅ Show price per room */}
                                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                                        {currency} {singleRoomPrice.toFixed(2)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        per room for {bookingData.duration} night{bookingData.duration > 1 ? 's' : ''}
                                    </Typography>

                                    {/* ✅ Show total for all rooms if multiple */}
                                    {totalRoomsNeeded > 1 && (
                                        <>
                                            <Divider sx={{ width: '100%', my: 1 }} />
                                            <Typography variant="h5" color="primary" fontWeight={700}>
                                                {currency} {totalPriceForAllRooms.toFixed(2)}
                                            </Typography>
                                            <Typography variant="caption" color="primary" fontWeight={600}>
                                                Total for {totalRoomsNeeded} rooms
                                            </Typography>
                                        </>
                                    )}

                                    {/* ✅ Show tax info */}
                                    {inclusiveTaxes.length > 0 && (
                                        <Typography variant="caption" color="success.main">
                                            (Taxes included)
                                        </Typography>
                                    )}

                                    {nonInclusiveTaxes.length > 0 && (
                                        <Typography variant="caption" color="warning.main">
                                            + {currency} {(totalNonInclusiveTax * totalRoomsNeeded).toFixed(2)} taxes
                                        </Typography>
                                    )}

                                    <Button
                                        variant="contained"
                                        onClick={() => handleSelect(room)}
                                        sx={{ minWidth: 150, mt: 2 }}
                                        disabled={isAuthenticated && role === 'admin'}
                                    >
                                        Select {totalRoomsNeeded > 1 ? `${totalRoomsNeeded} Rooms` : 'Room'}
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

         
        </>
    );
}

export default RoomDetailsList;

