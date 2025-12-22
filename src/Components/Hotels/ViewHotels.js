import { Avatar, Box, Button, CardMedia, Checkbox, Container, Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper, Rating, Slider, Stack, Switch, Typography, Chip, Card, CardContent } from "@mui/material";
import SearchBar from "../SearchHotelContext/SearchBar";
import HotelDisplayContext from "./HotelDisplayContext";
import { useContext, useEffect, useReducer, useRef } from "react";
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
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlickSlider from "react-slick";
import { trackActivity } from "../../services/hotel.service";


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
            const data = action.payload.data;
            console.log('Filtering data with:', data);

            const searchTags = action.payload.searchTags;
            const minRating = action.payload.minRating;
            const priceRange = action.payload.priceRange;
            const numberOfGuest = action.payload.numberOfGuest;

            const filteredList = data.itemList.filter(hotel => {
                // ✅ GoGlobal structure: hotel.rooms is an object with price
                const roomPrice = hotel.rooms?.price || 0;

                // Filter by price range
                if (roomPrice < priceRange[0] || roomPrice > priceRange[1]) {
                    console.log(`Hotel ${hotel.name} price ${roomPrice} not in range €${priceRange[0]} - €${priceRange[1]}`);
                    return false;
                }

                // Filter by minimum rating (if available in API)
                if (hotel.rating && hotel.rating < minRating) {
                    console.log(`Hotel ${hotel.name} rating ${hotel.rating} below minimum ${minRating}`);
                    return false;
                }

                // Filter by tags/facilities (if available)
                if (searchTags.length > 0 && hotel.facilities) {
                    const hotelFacilities = hotel.facilities.map(f => f.toLowerCase());
                    const hasAllTags = searchTags.every(tag =>
                        hotelFacilities.some(facility => facility.includes(tag.toLowerCase()))
                    );
                    if (!hasAllTags) {
                        console.log(`Hotel ${hotel.name} missing required facilities`);
                        return false;
                    }
                }

                return true;
            });

            console.log('Filtered Hotel List:', filteredList);

            return {
                ...state,
                itemList: filteredList,
                isLoaded: true
            };
        }
        case 'setIsLoading':
            return {
                ...state,
                isLoaded: false
            };
        case 'setIsLoaded':
            return {
                ...state,
                isLoaded: true
            };
        default:
            return state;
    }
};

function ViewHotels() {
    const { dispatch, hotelList, reloadHotelList } = useContext(HotelDisplayContext);
    const [displayData, dispatchDisplay] = useReducer(displayDataReducer, initialDisplayData);
    const { searchOption, setSearchOption, updatePriceRange } = useContext(SearchContext);
    const debouncedFilterData = useDebounce(dispatchDisplay, 1000);

    // ✅ Get dynamic min/max from hotelList
    const minPrice = hotelList.minPrice || 0;
    const maxPrice = hotelList.maxPrice || 3000;

    // ✅ Track if we've updated price range for this search
    const priceUpdatedRef = useRef(false);

    // ✅ Update price range when hotels load (only once per search)
    useEffect(() => {
        if (!hotelList.loading && hotelList.itemList.length > 0 && !priceUpdatedRef.current) {
            if (minPrice >= 0 && maxPrice > minPrice) {
                console.log('✅ Updating price range:', { minPrice, maxPrice });
                updatePriceRange(minPrice, maxPrice);
                priceUpdatedRef.current = true;
            }
        }

        // Reset when new search starts
        if (hotelList.loading) {
            priceUpdatedRef.current = false;
        }
    }, [hotelList.loading, hotelList.itemList.length, minPrice, maxPrice]);

    const handleChange = (event) => {
        setSearchOption({ ...searchOption, [event.target.name]: event.target.value });
    };


    const handleCheck = (event) => {
        setSearchOption({
            ...searchOption,
            "tags": {
                ...searchOption.tags,
                [event.target.name]: event.target.checked
            }
        });
    };

    useEffect(() => {

        if (hotelList.loading) {
            dispatchDisplay({ type: 'setIsLoading' });
            return;
        }
        if (hotelList.itemList.length === 0) {
            dispatchDisplay({ type: 'setIsLoaded' });
            return;
        }

        dispatchDisplay({ type: 'setIsLoading' });

        const filteredTags = Object.keys(searchOption.tags).filter(key => searchOption.tags[key] === true);

        debouncedFilterData({
            type: "filterData",
            payload: {
                data: hotelList,
                minRating: searchOption.rating,
                searchTags: filteredTags,
                priceRange: searchOption.price,
                numberOfGuest: searchOption.numberOfGuest
            }
        });
    }, [hotelList, debouncedFilterData, searchOption.rating, searchOption.tags, searchOption.price, searchOption.numberOfGuest]);

    const getCurrencySymbol = () => {
        const currency = hotelList.itemList[0]?.rooms?.currency || 'EUR';
        return currency === 'USD' ? '$' : currency === 'INR' ? '₹' : '€';
    };

    return (
        <Box sx={{ backgroundColor: 'grey.50', minHeight: '100vh' }}>
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Box sx={{ my: 3, justifySelf: 'center' }}>
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
                                            {getCurrencySymbol()} {searchOption.price[0]} - {searchOption.price[1]}
                                        </Typography>
                                        {/* <Typography variant="caption" color="text.secondary">
                                            per night
                                        </Typography> */}
                                    </Box>

                                    <Slider
                                        getAriaLabel={() => 'Price range'}
                                        name="price"
                                        min={minPrice}  // ✅ Dynamic min from results
                                        step={Math.max(1, Math.ceil((maxPrice - minPrice) / 100))}
                                        max={maxPrice}  // ✅ Dynamic max from results

                                        value={searchOption.price}
                                        onChange={handleChange}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => `€${value}`}
                                        sx={{ my: 1, mx: 'auto', justifyContent: 'center', width: '95%' }}
                                    />

                                    {/* ✅ Show min/max labels */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            Min: {getCurrencySymbol()}{minPrice}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            Max: {getCurrencySymbol()}{maxPrice}
                                        </Typography>
                                    </Box>
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
                                        key={item.id}
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
                                                    <Link to={`/Hotels/${item.id}`} style={{ textDecoration: 'none' }}>
                                                        <Box sx={{ position: 'relative', width: '100%', height: 200, borderRadius: 1, overflow: 'hidden' }}>
                                                            {Array.isArray(item.thumbnails) && item.thumbnails.length > 0 ? (
                                                                item.thumbnails.length > 1 ? (
                                                                    <SlickSlider
                                                                        dots={true}
                                                                        infinite={true}
                                                                        speed={1000}
                                                                        slidesToShow={1}
                                                                        slidesToScroll={1}
                                                                        arrows={true}
                                                                        autoplay={true}
                                                                        autoplaySpeed={3000}
                                                                    >
                                                                        {item.thumbnails.map((img, idx) => (
                                                                            <Box key={idx} sx={{ width: '100%', height: 200 }}>
                                                                                <CardMedia
                                                                                    component="img"
                                                                                    image={img}
                                                                                    alt={`${item.name} ${idx + 1}`}
                                                                                    sx={{
                                                                                        width: '100%',
                                                                                        height: '100%',
                                                                                        objectFit: 'cover',
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        ))}
                                                                    </SlickSlider>
                                                                ) : (
                                                                    <CardMedia
                                                                        component="img"
                                                                        height="200"
                                                                        image={item.thumbnails[0]}
                                                                        alt={item.name}
                                                                        sx={{
                                                                            borderRadius: 1,
                                                                            objectFit: 'cover',
                                                                            transition: 'transform 0.3s ease-in-out',
                                                                            '&:hover': {
                                                                                transform: 'scale(1.02)'
                                                                            }
                                                                        }}
                                                                    />
                                                                )
                                                            ) : (
                                                                <CardMedia
                                                                    component="img"
                                                                    height="200"
                                                                    image="/placeholder-hotel.jpg"
                                                                    alt={item.name}
                                                                    sx={{
                                                                        borderRadius: 1,
                                                                        objectFit: 'cover',
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Link>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 8 }}>
                                                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                            <Box>
                                                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                                    <Link
                                                                        to={`/Hotels/${item.id}`}
                                                                        style={{
                                                                            textDecoration: 'none',
                                                                            color: 'inherit',
                                                                        }}
                                                                    >
                                                                        {item.name}
                                                                    </Link>
                                                                </Typography>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                                    <LocationOnIcon color="action" sx={{ fontSize: 20 }} />
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {searchOption.location}
                                                                    </Typography>
                                                                </Box>

                                                                {item.rooms?.room_basis && (
                                                                    <Chip
                                                                        label={item.rooms.room_basis}
                                                                        size="small"
                                                                        color="secondary"
                                                                        sx={{ mr: 1, mb: 1 }}
                                                                    />
                                                                )}

                                                                {item.rooms?.CxlDeadLine && (
                                                                    <Chip
                                                                        label={`Cancel before: ${item.rooms.CxlDeadLine}`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        color="success"
                                                                        sx={{ mb: 1 }}
                                                                    />
                                                                )}

                                                                {item.rooms?.Remark && (
                                                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1, fontSize: '0.75rem' }}>
                                                                        {item.rooms.Remark.length > 100 ? item.rooms.Remark.substring(0, 100) + '...' : item.rooms.Remark}
                                                                    </Typography>
                                                                )}

                                                                {/* {item.rooms?.room_basis && (
                                                                    <Chip
                                                                        label={item.rooms.room_basis}
                                                                        size="small"
                                                                        color="secondary"
                                                                        sx={{ mr: 1 }}
                                                                    />
                                                                )} */}
                                                            </Box>

                                                            {item.rating && (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                                    <Rating value={item.rating} precision={0.5} readOnly size="small" />
                                                                    <Chip
                                                                        label={item.rating}
                                                                        color="primary"
                                                                        size="small"
                                                                        sx={{ fontWeight: 'bold' }}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Box>

                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                                            <Box>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Starting from
                                                                </Typography>
                                                                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                                                    {(() => {
                                                                        const currencySymbolMap = {
                                                                            USD: '$',
                                                                            INR: '₹',
                                                                            EUR: '€',
                                                                        };
                                                                        const symbol = currencySymbolMap[item.rooms.currency?.toUpperCase()] || item.rooms.currency;
                                                                        return `${symbol} ${item.rooms?.price || 0}`;
                                                                    })()}

                                                                </Typography>
                                                                {/* Tax Display */}
                                                                {/* Logic: if taxesFees > 0, show it. The user provided snippet has "taxesFees": 0, so check validity. */}
                                                                {(item.rooms?.taxesFees !== undefined && item.rooms?.taxesFees !== null) && (
                                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                                        {(() => {
                                                                            const currencySymbolMap = {
                                                                                USD: '$',
                                                                                INR: '₹',
                                                                                EUR: '€',
                                                                            };
                                                                            const symbol = currencySymbolMap[item.rooms.currency?.toUpperCase()] || item.rooms.currency;
                                                                            const taxVal = item.rooms.taxesFees;

                                                                            if (taxVal > 0) {
                                                                                return `+ ${symbol} ${taxVal} taxes & fees`;
                                                                            } else {
                                                                                return `(Includes taxes & fees)`;
                                                                            }
                                                                        })()}
                                                                    </Typography>
                                                                )}
                                                            </Box>

                                                            <Button
                                                                variant="contained"
                                                                component={Link}
                                                                to={`/Hotels/${item.id}`}
                                                                onClick={() => {
                                                                    trackActivity("view_hotel_details").catch((err) =>
                                                                        console.error("Activity tracking failed:", err)
                                                                    );
                                                                }}
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
                                    </Card>
                                ))}
                            </Stack>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ViewHotels;