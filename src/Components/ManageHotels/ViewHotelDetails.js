import { Box, Button, Card, CardContent, CardMedia, Chip, CircularProgress, Divider, Fab, Paper, Rating, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ManageHotelsContext from "./ManageHotelsContext";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ViewHotelDetails() {
    let { id } = useParams();
    const [hotelData, setHotelData] = useState(null);
    const { hotelTable } = useContext(ManageHotelsContext);
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    // load the hotel of that id
    useEffect(() => {
        const hotel = hotelTable.itemList.find(hotel => hotel._id === id);
        setHotelData(hotel);
    }, []);

    if (!hotelData) {
        return (<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>);
    } else {
        return (<React.Fragment>
            <Card>
                <CardMedia
                    component="img"
                    height="300"
                    image={hotelData.Photo}
                    alt={hotelData.HotelName}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {hotelData.HotelName}
                    </Typography>
                    <Typography variant="body2" >
                        {hotelData.Description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                        <Rating value={parseFloat(hotelData.Rating)} precision={0.5} readOnly />
                        <Typography sx={{ ml: 1 }} variant="subtitle1" >
                            {hotelData.Rating}
                        </Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationOnIcon color="action" />
                        <Typography variant="body2" >
                            {hotelData.Address
                                ? `${hotelData.Address.StreetAddress}, ${hotelData.Address.City}, ${hotelData.Address.StateProvince}, ${hotelData.Address.PostalCode}, ${hotelData.Address.Country}`
                                : 'Address not available'}
                        </Typography>
                    </Stack>
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {hotelData.Tags && hotelData.Tags.map((tag, index) => (
                            <Chip label={tag} key={index} />
                        ))}
                    </Box>
                </CardContent>
                <Divider />
            </Card>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{
                    }}>
                        <TableRow  >
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 20 }}>Room Id</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 20 }}>Room Description</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 20 }}>isActive</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 20 }}>Bed Options</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 20 }}>Number of Guests</TableCell>
                            <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: 20 }}>Price per night</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hotelData.Rooms.map((room) => {
                            //const totalPrice = room.BaseRate * bookingData.duration;
                            return (<TableRow
                                key={room.RoomId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">
                                    <Typography variant="h6" >
                                        {room.RoomId}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography gutterBottom variant="h6" component="div">
                                        {room.Description}
                                    </Typography>
                                    {room.Tags && room.Tags.map((tag, tagIndex) => (
                                        <Chip label={tag} key={tagIndex} color="primary" variant="outlined" sx={{ mr: 1 }} />
                                    ))}
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="h6" >
                                        {room.isActive.toString()}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="h6" >
                                        {room.BedOptions}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="h6" >
                                        {room.SleepsCount}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="h6">
                                        ${room.BaseRate.toFixed(2)}
                                    </Typography>
                                </TableCell>
                            </TableRow>);
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ position: 'fixed', bottom: 100, right: 70 }}>
                <Fab color="primary" aria-label="add" size="large" onClick={goBack} variant="extended">
                    <ArrowBackIcon />
                    Back
                </Fab>
            </div>
        </React.Fragment>);
    }
}

export default ViewHotelDetails;