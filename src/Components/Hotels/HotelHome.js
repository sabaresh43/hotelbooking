import { Box, CircularProgress, Container, Typography } from "@mui/material"
import { Routes, Route, Link } from 'react-router-dom';
import ViewHotels from "./ViewHotels";
import React, { Suspense, useContext, useEffect, useState} from "react";
import { HotelDisplayProvider } from "./HotelDisplayContext";
import HotelDetails from "./HotelDetails";
import { BookingContextProvider } from "../Booking/BookingContext";
import { useLocation } from 'react-router-dom';
import SearchContext from "../SearchHotelContext/SearchContext";
import dayjs from "dayjs";

function HotelHome() {
    const location = useLocation();
    const { searchOption, setSearchOption } = useContext(SearchContext);
    
    // ✅ Store search options in state to persist across navigation
    const [persistedSearchOptions, setPersistedSearchOptions] = useState(() => {
        // Check location.state first, then SearchContext, then localStorage
        const stored = localStorage.getItem('hotelSearchParams');
        return location.state?.searchOption || 
               searchOption || 
               (stored ? JSON.parse(stored) : null);
    });

    // ✅ Update persisted options when location.state changes (from SearchBar)
    useEffect(() => {
        if (location.state?.searchOption) {
            setPersistedSearchOptions(location.state.searchOption);
            // Also update SearchContext with formatted dates
            setSearchOption({
                ...location.state.searchOption,
                from: dayjs(location.state.searchOption.from),
                to: dayjs(location.state.searchOption.to)
            });
        }
    }, [location.state?.searchOption]);

    console.log("HotelHome searchOptions:", persistedSearchOptions);

    return (
        <Container maxWidth={false} disableGutters>
            <HotelDisplayProvider searchOptions={persistedSearchOptions}>
                <Suspense fallback={
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                        <CircularProgress />
                    </Box>
                }>
                    <Routes>
                        <Route index element={<ViewHotels />} />
                        <Route path=":id/*" element={
                            <BookingContextProvider>
                                <HotelDetails />
                            </BookingContextProvider>
                        } />
                    </Routes>
                </Suspense>
            </HotelDisplayProvider>
        </Container>
    );
}

export default HotelHome;