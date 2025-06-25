import { Avatar, Box, Button, CardMedia, Checkbox, Container, Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper, Rating, Slider, Stack, Switch, Typography, Chip, Card, CardContent } from "@mui/material";
import SearchBar from "../SearchHotelContext/SearchBar";
import HotelDisplayContext from "./HotelDisplayContext";
import { useContext, useEffect, useReducer, useState } from "react";
import { Image } from "@mui/icons-material";
import { Link } from "react-router-dom";
import SearchContext from "../SearchHotelContext/SearchContext";
import WifiIcon from '@mui/icons-material/Wifi';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import PoolIcon from '@mui/icons-material/Pool';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import TuneIcon from '@mui/icons-material/Tune';
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useDebounce } from "../../hooks/hooks";
import { Grid } from "@mui/material";
import { Skeleton } from "@mui/material";

const facilityIcons = {
    wifi: <WifiIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
    parking: <LocalParkingIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
    laundry: <LocalLaundryServiceIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
    bar: <LocalBarIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
    restaurant: <RestaurantIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
    pool: <PoolIcon sx={{ fontSize: 20, color: 'primary.main' }} />,
    breakfast: <FreeBreakfastIcon sx={{ fontSize: 20, color: 'primary.main' }} />
};

const facilityLabels = {
    wifi: 'Wi-Fi',
    parking: 'Parking',
    laundry: 'Laundry',
    bar: 'Bar',
    restaurant: 'Restaurant',
    pool: 'Pool',
    breakfast: 'Breakfast'
};

const initialDisplayData = {
    itemList: [],
    isLoaded: false,
};

const displayDataReducer = (state, action) => {
    switch (action.type) {
        case 'filterData': {
            // get the data and the filters
            const data = action.payload.data;
            console.log('Filtering data with:', data);

            const searchTags = action.payload.searchTags;
            const minRating = action.payload.minRating;
            const location = action.payload.location;
            const priceRange = action.payload.priceRange;
            const numberOfGuest = action.payload.numberOfGuest;

            const filteredList = data.itemList.filter(hotel => {
                // Filter by location
                if (hotel.address.city.toLowerCase() !== location.toLowerCase()) {
                    console.log(`Hotel ${hotel.HotelName} does not match location filter: ${location}`);

                    return false;
                }

                // Filter by minimum rating
                if (hotel.Rating < minRating) {
                    console.log(`Hotel ${hotel.HotelName} does not meet minimum rating: ${minRating}`);

                    return false;
                }

                // only filter active rooms and rooms can serve enough guests
                const activeRooms = hotel.rooms.filter(room => room.isActive && room.sleepsCount >= numberOfGuest);
                if (activeRooms.length === 0) {
                    console.log(`Hotel ${hotel.HotelName} has no active rooms or not enough capacity for ${numberOfGuest} guests`);
                    return false; // No active rooms, skip this hotel
                }
                // if no room is in the price range, skip the hotel 
                const baseRates = activeRooms.map(room => room.baseRate);
                const hasValidPrice = baseRates.some(rate => (rate >= priceRange[0] && rate <= priceRange[1]));
                //console.log(hasValidPrice);
                if (!hasValidPrice) {
                    console.log(`Hotel ${hotel.HotelName} has no rooms in the price range: $${priceRange[0]} - $${priceRange[1]}`);

                    return false;
                }

                // Filter by tags
                if (searchTags.length > 0) {
                    // first get hotel tags
                    const hotelTags = new Set(hotel.Tags.map(tag => tag.toLowerCase()));
                    // get rooms' tag
                    hotel.Rooms.forEach(room => {
                        room.Tags.forEach(tag => hotelTags.add(tag.toLowerCase()));
                    });
                    // convert tags to lower case
                    const lowercaseHotelTags = Array.from(hotelTags);
                    // check every search tag is included in the hotel's tags
                    return searchTags.every(tag => lowercaseHotelTags.some(hotelTag => hotelTag.includes(tag.toLowerCase())));
                }

                return true; // If no tags provided, return true for all hotels
            });

            // finally return the filtered Hotel List
            console.log('Filtered Hotel List:', filteredList);

            return {
                ...state,
                itemList: filteredList,
                isLoaded: true
            };
        };
        case 'setIsLoading': // Add this case
            return {
                ...state,
                isLoaded: false
            };
        case 'setIsLoaded':
            return {
                ...state,
                isLoaded: true
            };
        default: return state;
    }
};

function ViewHotels() {
    const { dispatch, hotelList, reloadHotelList } = useContext(HotelDisplayContext);
    const [displayData, dispatchDisplay] = useReducer(displayDataReducer, initialDisplayData);
    const { searchOption, setSearchOption } = useContext(SearchContext);
    // debounce the filter data function to avoid too many re-renders
    const debouncedFilterData = useDebounce(dispatchDisplay, 1000);

    const handleChange = (event) => {
        setSearchOption({ ...searchOption, [event.target.name]: event.target.value });
    };

    // set if a tag filter is applied
    const handleCheck = (event) => {
        setSearchOption({
            ...searchOption,
            "tags":
            {
                ...searchOption.tags,
                [event.target.name]: event.target.checked
            }
        });
    };

    // filter data
    useEffect(() => {
        // If the source hotel list is empty, don't filter yet
        if (hotelList.length === 0) {
            // Optionally set isLoaded to true to show "no results" instead of loading
            dispatchDisplay({ type: 'setIsLoaded', payload: true });
            return;
        }

        // Set loading state before starting the debounced filter
        dispatchDisplay({ type: 'setIsLoading' });

        // only apply tag filter that is set to true
        const filteredTags = Object.keys(searchOption.tags).filter(key => searchOption.tags[key] === true);

        debouncedFilterData({
            type: "filterData",
            payload: { data: hotelList, minRating: searchOption.rating, location: searchOption.location, searchTags: filteredTags, priceRange: searchOption.price, numberOfGuest: searchOption.numberOfGuest }
        });
        // Make sure debouncedFilterData is stable (using useCallback in useDebounce)
    }, [hotelList, debouncedFilterData, searchOption.rating, searchOption.location, searchOption.tags, searchOption.price, searchOption.numberOfGuest]);

    return (
        <Box sx={{ backgroundColor: 'grey.50', minHeight: '100vh' }}>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box sx={{ my: 3, justifySelf: 'center' }} >
                    <SearchBar />
                </Box>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                        <Card
                            elevation={3}
                            sx={{
                                position: 'sticky',
                                top: 90,
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}
                        >
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    p: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <TuneIcon />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Filter by
                                    </Typography>
                                </Box>

                                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <AttachMoneyIcon color="primary" />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Price Range
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                        p: 2,
                                        bgcolor: 'grey.100',
                                        borderRadius: 1
                                    }}>
                                        <Typography variant="text">
                                            $ {searchOption.price[0]} - {searchOption.price[1]}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            per night
                                        </Typography>
                                    </Box>

                                    <Slider
                                        getAriaLabel={() => 'Price range'}
                                        name="price"
                                        min={0}
                                        step={1}
                                        max={500}
                                        value={searchOption.price}
                                        onChange={handleChange}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `$${value}`}
                                        sx={{ my: 1, mx: 'auto', justifyContent: 'center', width: '95%' }}
                                    />
                                </Box>

                                <Divider />
                                <Box sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        Facilities
                                    </Typography>
                                    <Grid container spacing={1}>
                                        {Object.keys(facilityLabels).map((facility) => (
                                            <Grid size={{ xs: 12, sm: 6 }} key={facility}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        p: 1.5,
                                                        borderRadius: 1,
                                                        border: '1px solid',
                                                        borderColor: searchOption.tags[facility] ? 'primary.main' : 'grey.300',
                                                        backgroundColor: searchOption.tags[facility] ? 'primary.50' : 'transparent',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease-in-out',
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                            backgroundColor: 'primary.50'
                                                        }
                                                    }}
                                                    onClick={() => handleCheck({ target: { name: facility, checked: !searchOption.tags[facility] } })}
                                                >
                                                    <Checkbox
                                                        checked={searchOption.tags[facility]}
                                                        onChange={handleCheck}
                                                        name={facility}
                                                        size="small"
                                                        sx={{ p: 0, mr: 1 }}
                                                    />
                                                    {facilityIcons[facility]}
                                                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
                                                        {facilityLabels[facility]}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                                <Divider />
                                <Box sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <StarIcon color="primary" />
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Minimum Rating
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        p: 2,
                                        bgcolor: 'grey.100',
                                        borderRadius: 1,
                                        textAlign: 'center'
                                    }}>
                                        <Rating
                                            value={searchOption.rating}
                                            precision={0.5}
                                            name="rating"
                                            onChange={handleChange}
                                            size="large"
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                            {searchOption.rating} stars and above
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {displayData.isLoaded ? `${displayData.itemList.length} hotels found` : 'Searching hotels...'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {searchOption.location && `in ${searchOption.location}`}
                            </Typography>
                        </Box>
                        {!displayData.isLoaded ? (
                            // Render Skeletons while loading
                            <Stack spacing={3}>
                                {[1, 2, 3].map((index) => (
                                    <Card key={index} elevation={2} sx={{ borderRadius: 2 }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 8 }}>
                                                    <Skeleton variant="text" height={40} width="60%" />
                                                    <Skeleton variant="text" height={20} width="80%" sx={{ my: 1 }} />
                                                    <Skeleton variant="text" height={20} width="40%" />
                                                    <Box sx={{ mt: 2 }}>
                                                        <Skeleton variant="rectangular" height={36} width={150} />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        ) : displayData.itemList.length === 0 ? (
                            // No Results Found
                            <Card elevation={2} sx={{ borderRadius: 2, textAlign: 'center', py: 6 }}>
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No hotels found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Try adjusting your search criteria or filters
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            <Stack spacing={3}>
                                {displayData.itemList.map((item) => (
                                    <Card
                                        key={item._id}
                                        elevation={2}
                                        sx={{
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Grid container spacing={3}>
                                                <Grid size={{ xs: 12, sm: 4 }}>
                                                    <Link to={`/Hotels/${item._id}`} style={{ textDecoration: 'none' }}>
                                                        <CardMedia
                                                            component="img"
                                                            height="200"
                                                            image={item.photo}
                                                            alt={item.hotelName}
                                                            sx={{
                                                                borderRadius: 1,
                                                                objectFit: 'cover',
                                                                transition: 'transform 0.3s ease-in-out',
                                                                '&:hover': {
                                                                    transform: 'scale(1.02)'
                                                                }
                                                            }}
                                                        />
                                                    </Link>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 8 }}>
                                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                            <Box>
                                                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                    <Link
                                                                        to={`/Hotels/${item._id}`}
                                                                        style={{
                                                                            textDecoration: 'none',
                                                                            color: 'inherit',
                                                                            '&:hover': { color: 'primary.main' }
                                                                        }}
                                                                    >
                                                                        {item.hotelName}
                                                                    </Link>
                                                                </Typography>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                                    <LocationOnIcon color="action" sx={{ fontSize: 20 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {item.address.street}, {item.address.city}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                                <Rating value={item.rating} precision={0.5} readOnly size="regular" sx={{
                                                                    color: 'secondary.main',
                                                                }} />
                                                                <Chip
                                                                    label={item.rating}
                                                                    color="primary"
                                                                    size="regular"
                                                                    sx={{ fontWeight: 'bold' }}
                                                                />
                                                            </Box>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Starting from
                                                                </Typography>
                                                                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                                                    ${Math.min(...item.rooms.filter(room => room.isActive).map(room => room.baseRate))}
                                                                    <Typography component="span" variant="caption" color="text.secondary">
                                                                        /night
                                                                    </Typography>
                                                                </Typography>
                                                            </Box>

                                                            <Button
                                                                variant="contained"
                                                                component={Link}
                                                                to={`/Hotels/${item._id}`}
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    px: 3,
                                                                    py: 1,
                                                                    fontWeight: 'bold',
                                                                    textTransform: 'none'
                                                                }}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>)
                                )}
                            </Stack>)}
                    </Grid >
                </Grid >
            </Container >
        </Box>);
};

export default ViewHotels;