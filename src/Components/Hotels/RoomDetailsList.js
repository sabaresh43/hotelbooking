import React, { useContext, useEffect, useState } from 'react';
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
import PersonIcon from '@mui/icons-material/Person';
import BedIcon from '@mui/icons-material/Bed';
import BookingContext from '../Booking/BookingContext';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function RoomDetailsList({ rooms }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const role = useSelector(state => state.auth.role);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const { bookingData, dispatch } = useContext(BookingContext);
    const navigate = useNavigate();

    const handleSelect = (room) => {
        if (isAuthenticated && role === 'admin') {
            setOpenDialog(true);
            return;
        }

        const totalPrice = room.baseRate * bookingData.duration;

        dispatch({
            type: "setBookingDetails",
            payload: {
                data: {
                    rooms: [room],
                    totalPrice
                }
            }
        });

        navigate("booking");
    };

    const [openDialog, setOpenDialog] = useState(false);

    return (
        <>
            <Stack spacing={3} sx={{ mb: 5 }}>
                {rooms.map(room => (
                    <Card key={room.roomId} sx={{ display: 'flex', borderRadius: 2, boxShadow: 3, }}>
                        {!room.imageUrl && (
                            <Box sx={{ position: 'relative', width: 220, width: 220, flexShrink: 0, borderRadius: '8px 0 0 8px', overflow: 'hidden', display: 'flex' }}>
                                <CardMedia
                                    component="img"
                                    image={room.imageUrl || 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg'}
                                    alt={room.description}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        )}


                        {/* Image Section */}

                        <Stack direction="row" justifyContent="space-between" alignItems="center" flex={1} p={2}>
                            <Stack spacing={1} flex={1}>
                                <Typography variant="h6" fontWeight={600}>
                                    {room.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {room.area || "Room Size: 350 sq.ft"} {/* Placeholder area */}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <BedIcon fontSize="small" />
                                    <Typography variant="body2">{room.bedOptions}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    {Array.from({ length: room.sleepsCount }).map((_, idx) => (
                                        <PersonIcon key={idx} fontSize="small" />
                                    ))}
                                </Stack>
                                {room.tags && (
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {room.tags.map((tag, i) => (
                                            <Chip
                                                key={i}
                                                label={tag}
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    borderRadius: '4px',
                                                    textTransform: 'capitalize',
                                                    borderColor: 'primary.main',
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                )}

                            </Stack>

                            <Stack spacing={2} alignItems="flex-end">
                                <Typography variant="h6" color="primary" fontWeight={600}>
                                    ₹ {(room.baseRate * bookingData.duration).toFixed(2)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => handleSelect(room)}
                                    sx={{ minWidth: 150 }}
                                    disabled={isAuthenticated && role === 'admin'}
                                >
                                    Book Room
                                </Button>
                            </Stack>
                        </Stack>
                    </Card>
                ))}
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
