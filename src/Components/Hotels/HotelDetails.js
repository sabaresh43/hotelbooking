import { CircularProgress, Container } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import SearchContext from "../SearchHotelContext/SearchContext";
import HotelDisplayContext from "./HotelDisplayContext";
import React from 'react';
import HotelOverview from './HotelOverview';
import RoomDetailsList from "./RoomDetailsList";
import BookRooms from "../Booking/BookRooms";
import BookingContext, { BookingContextProvider } from "../Booking/BookingContext";
import dayjs from "dayjs";

function HotelDetails() {
    let { id } = useParams();
    const [hotelData, setHotelData] = useState(null);
    const { hotelList } = useContext(HotelDisplayContext);
    const { searchOption } = useContext(SearchContext);
    const { bookingData, dispatch } = useContext(BookingContext);

    useEffect(() => {
        const hotel = hotelList.itemList.find(hotel => hotel._id === id);
        if (!hotel) {
            // Handle case where hotel is not found
            console.error(`Hotel with id ${id} not found`);
            return;
        }

        const { Rooms, ...pureHotelData } = hotel;
        const from = dayjs(searchOption.from);
        const to = dayjs(searchOption.to);
        const duration = to.diff(from, 'day');
        dispatch({
            type: "initialize", payload: {
                data: {
                    hotel: pureHotelData,
                    from: from,
                    to: to,
                    duration: duration,
                    numberOfGuest: searchOption.numberOfGuest
                }
            }
        });
        setHotelData(hotel);
    }, []);

    if (!hotelData) return <CircularProgress />;
    else {
        //console.log(hotelData);
        return (
            <Routes>
                <Route index element={
                    <Container sx={{ minWidth: '70%' }}>
                        <HotelOverview hotel={hotelData} />
                        {hotelData.Rooms && <RoomDetailsList rooms={hotelData.Rooms} />}
                    </Container>}>
                </Route>
                <Route path="booking/*" element={
                    <BookRooms />}>
                </Route>
            </Routes>
        );
    };

}

export default HotelDetails;