import React, { useContext, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Box,
    Button,
    Checkbox,
    TableCell,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    Dialog,
    DialogContent,
    Alert,
    Stack,
    Fab
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
    const [selectedRooms, setSelectedRooms] = useState([]);
    const { bookingData, dispatch } = useContext(BookingContext);
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    const handleCheck = (room) => (event) => {
        if (event.target.checked) {
            // if the array doesn't contain it already, ad it
            if (!selectedRooms.find(existingRoom => existingRoom.RoomId === room.RoomId)) {
                setSelectedRooms([...selectedRooms, room]);
            }
        } else {
            // if the array contains it, delete it
            if (selectedRooms.find(existingRoom => existingRoom.RoomId === room.RoomId)) {
                setSelectedRooms(selectedRooms.filter(existingRoom => existingRoom.RoomId !== room.RoomId));
            }
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // prevent admin to book rooms
        if (isAuthenticated && role === 'admin') {
            handleDialogOpen();
            return;
        }

        // calculate the price
        let totalPrice = 0;
        for (let i = 0; i < selectedRooms.length; i++) {
            totalPrice += selectedRooms[i].BaseRate * bookingData.duration;
        }
        dispatch({
            type: "setBookingDetails",
            payload: {
                data: {
                    rooms: selectedRooms,
                    totalPrice: totalPrice
                }
            }
        });
        navigate("booking");
    }

    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    return (<React.Fragment>
        <TableContainer component={Paper} square={false} elevation={4} sx={{ mb: 3 }}>
            <Table aria-label="simple table">
                <TableHead >
                    <TableRow>
                        <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', backgroundColor: theme => theme.palette.primary.main }}>Room Description</TableCell>
                        <TableCell align="left" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', backgroundColor: theme => theme.palette.primary.main }}>Bed Options</TableCell>
                        <TableCell align="left" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', backgroundColor: theme => theme.palette.primary.main }}>Number of Guests</TableCell>
                        <TableCell align="left" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', backgroundColor: theme => theme.palette.primary.main }}>Price for {bookingData.duration} {bookingData.duration > 1 ? "nights" : "night"}</TableCell>
                        <TableCell align="left" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', backgroundColor: theme => theme.palette.primary.main }}>Select</TableCell>
                        <TableCell align="left" sx={{ fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: theme => theme.palette.primary.main }} >
                            <form onSubmit={handleSubmit}>
                                <Button type="submit" disabled={selectedRooms.length === 0}
                                    variant="contained"
                                    sx={{
                                        bgcolor: 'grey.100', color: theme => theme.palette.primary.main,
                                        '&:disabled': { cursor: 'not-allowed', pointerEvents: 'auto', backgroundColor: 'grey.400' },
                                    }}>
                                    Reserve
                                </Button>
                            </form>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rooms.map((room) => {
                        return (<TableRow
                            key={room.RoomId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Typography gutterBottom variant="h6" fontWeight="500" component="div">
                                    {room.Description}
                                </Typography>
                                {room.Tags && room.Tags.map((tag, tagIndex) => (
                                    <Chip label={tag} key={tagIndex} color="primary" variant="outlined" sx={{ mr: 1, textTransform: 'capitalize' }} />
                                ))}
                            </TableCell>
                            <TableCell align="left">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {room.BedOptions}
                                    </Typography>
                                    <BedIcon sx={{ verticalAlign: "bottom" }} />
                                </div>

                            </TableCell>
                            <TableCell align="left">
                                {Array.from({ length: room.SleepsCount }).map((_, k) => (
                                    <PersonIcon key={k} sx={{ verticalAlign: "bottom" }} />
                                ))}
                            </TableCell>
                            <TableCell align="left">
                                <Typography variant="h6" sx={{ fontWeight: '500' }}>
                                    ${(room.BaseRate * bookingData.duration).toFixed(2)}
                                </Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Checkbox
                                    value={selectedRooms.some(r => r.RoomId === room.RoomId)}
                                    onChange={handleCheck(room)}
                                />
                            </TableCell>
                        </TableRow>);
                    })}
                </TableBody>
            </Table>
        </TableContainer>
        {
            isAuthenticated && role === 'admin' && <Dialog
                open={openDialog}
                onClose={handleDialogClose} >
                <DialogContent>
                    <Stack>
                        <Alert variant="filled" severity="error">
                            You can't create booking as an admin, please sign out or login as user
                        </Alert>
                        <Button color="inherit" variant="outlined" onClick={handleDialogClose}>Close</Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        }
        <div style={{ position: 'fixed', bottom: 50, right: 50 }}>
            <Fab color="primary" aria-label="add" size="large" onClick={goBack} variant="extended">
                <ArrowBackIcon />
                Back
            </Fab>
        </div>
    </React.Fragment >
    );
}

export default RoomDetailsList;
