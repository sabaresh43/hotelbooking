import { CircularProgress, Container } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import SearchContext from "../SearchHotelContext/SearchContext";
import HotelDisplayContext from "./HotelDisplayContext";
import HotelOverview from './HotelOverview';
import RoomDetailsList from "./RoomDetailsList";
import BookRooms from "../Booking/BookRooms";
import BookingContext, { BookingContextProvider } from "../Booking/BookingContext";
import dayjs from "dayjs";
import { Alert, Box } from "@mui/material";
import hotelService from "../../services/hotel.service";


function HotelDetails() {
    let { id } = useParams();
    const [hotelData, setHotelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { hotelList, searchParams } = useContext(HotelDisplayContext);
    const { searchOption } = useContext(SearchContext);
    const { bookingData, dispatch } = useContext(BookingContext);

    useEffect(() => {
        const loadHotelDetails = async () => {
            setLoading(true);
            
            try {
                // ✅ Use searchParams from context, fallback to SearchContext
                const searchOpts = searchParams?.from && searchParams?.to 
                    ? searchParams 
                    : {
                        ...searchOption,
                        from: searchOption.from?.format?.('YYYY-MM-DD') || searchOption.from,
                        to: searchOption.to?.format?.('YYYY-MM-DD') || searchOption.to
                    };

                console.log('Loading hotel details with options:', searchOpts);
                
                const detailsResponse = await hotelService.getHotelDetails(id, searchOpts);
                
                console.log('Hotel details from API:', detailsResponse);
                
                if (detailsResponse) {
                    const normalizedHotel = {
                        id: detailsResponse.id,
                        name: detailsResponse.name,
                        description: detailsResponse.description,
                        thumbnails: detailsResponse.thumbnails || [],
                        HotelFacilities: detailsResponse.HotelFacilities,
                        RoomFacilities: detailsResponse.RoomFacilities,
                        currency: detailsResponse.currency,
                        rooms: detailsResponse.rooms || [],
                        supplier: detailsResponse.supplier
                    };
                    
                    setHotelData(normalizedHotel);
                }
            } catch (error) {
                console.error('Error loading hotel details:', error);
            } finally {
                setLoading(false);
            }
        };

        loadHotelDetails();
    }, [id]);

    useEffect(() => {
        if (!hotelData) return;

        const { rooms, ...pureHotelData } = hotelData;
        
        // ✅ Get dates from searchParams or SearchContext
        const opts = searchParams?.from ? searchParams : searchOption;
        const from = dayjs(opts.from);
        const to = dayjs(opts.to);
        const duration = to.diff(from, 'day') || 1;

        dispatch({
            type: "initialize", 
            payload: {
                data: {
                    hotel: pureHotelData,
                    from: from,
                    to: to,
                    duration: duration,
                    numberOfGuest: opts.numberOfGuest || 2
                }
            }
        });
    }, [hotelData, searchParams, searchOption]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!hotelData) {
        return (
            <Container>
                <Alert severity="error">Hotel not found</Alert>
            </Container>
        );
    }

    return (
        <Routes>
            <Route index element={
                <Container sx={{ minWidth: '70%' }}>
                    <HotelOverview hotel={hotelData} />
                    {hotelData.rooms && hotelData.rooms.length > 0 && (
                        <RoomDetailsList rooms={hotelData.rooms} />
                    )}
                </Container>
            } />
            <Route path="booking/*" element={<BookRooms />} />
        </Routes>
    );
}

export default HotelDetails;
