import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    useMediaQuery,
    useTheme,
    Typography,
    MenuItem,
    Select,
    Popover,
    Alert,
    Snackbar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import SearchContext from "./SearchContext";
import Autocomplete from "@mui/material/Autocomplete";
import { getSupplier } from "../../utils/getSupplier";
import { createActivity } from "../../services/hotel.service";
import LoginAndRegisterForm from "../LoginAndRegister/LoginRegisterForm";
import { useSelector } from 'react-redux';


// Example supplier getter — replace with your real implementation
// import { getSupplier } from '../utils/supplier';

export default function SearchBar() {
    const navigate = useNavigate();
    const { searchOption, setSearchOption } = useContext(SearchContext);
    const [minDate, setMinDate] = useState(dayjs().add(1, "day"));
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const SUPPLIER = getSupplier();
    const [anchorEl, setAnchorEl] = useState(null);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showAuthAlert, setShowAuthAlert] = useState(false);

    const occupancy = searchOption.occupancy[0];

    console.log("SUPPLIER", SUPPLIER);

    useEffect(() => {
        if (searchOption.from) {
            setMinDate(dayjs(searchOption.from).add(1, "day"));
        }
    }, [searchOption.from]);

    // supplier-specific city lists
    const cityOptionsMap = {
        goglobal: [
            { label: "Amsterdam", code: "75" },
        ],
        dida: [
            { label: "Chennai", code: "553248633981715834" },
            { label: "Delhi", code: "180000" },
            { label: "Bengaluru", code: "553248633981715864" },
        ],
        default: [
            { label: "Amsterdam", code: "75" },

        ],
    };

    const cityOptions = cityOptionsMap[SUPPLIER] || cityOptionsMap.default;

    const handleCityChange = (event, newValue) => {
        // newValue is the label string when freeSolo is used
        const chosenLabel = typeof newValue === "string" ? newValue : newValue?.label || "";

        const selectedCity = cityOptions.find((c) => c.label === chosenLabel);

        setSearchOption({
            ...searchOption,
            location: chosenLabel || "", // Always set location even if no match
            cityCode: selectedCity?.code || null,
        });
    };

    const handleOccupancyChange = (key, delta) => {
        setSearchOption(prev => {
            const updated = { ...prev };
            const occ = { ...updated.occupancy[0] };

            if (key === "roomCount") {
                occ.roomCount = Math.max(1, occ.roomCount + delta);
                if (occ.adults < occ.roomCount) occ.adults = occ.roomCount; // basic rule
            }

            if (key === "adults") {
                occ.adults = Math.max(1, occ.adults + delta);
            }

            if (key === "childAges") {
                if (delta > 0) occ.childAges.push(null);
                else occ.childAges.pop();
            }

            updated.occupancy = [occ];
            return updated;
        });
    };

    const handleChildAgeChange = (index, age) => {
        setSearchOption(prev => {
            const updated = { ...prev };
            updated.occupancy[0].childAges[index] = age;
            return updated;
        });
    };


    const handleSearch = () => {
        if (!isAuthenticated) {
            setShowLoginDialog(true);
            setShowAuthAlert(true);
            return; // Stop here if not authenticated
        }

        if (!searchOption.location && !searchOption.cityCode) {
            alert("Please select a city");
            return;
        }
        if (!searchOption.from || !searchOption.to) {
            alert("Please select dates");
            return;
        }

        if (searchOption.to.isBefore(searchOption.from) || searchOption.to.isSame(searchOption.from)) {
            alert("Check-out date must be after check-in date");
            return;
        }

        const formattedSearchOption = {
            ...searchOption,
            from: searchOption.from.format("YYYY-MM-DD"),
            to: searchOption.to.format("YYYY-MM-DD"),
        };
        const occ = searchOption.occupancy[0];
        if (occ.adults < occ.roomCount) {
            alert("Each room must have at least one adult.");
            return;
        }
        if (occ.childAges.includes(null)) {
            alert("Please select ages for all children.");
            return;
        }

        // Track hotel search activity
        createActivity("hotel_search").catch((err) =>
            console.error("Activity tracking failed:", err)
        );

        navigate("/hotels", { state: { searchOption: formattedSearchOption } });
    };

    return (
        <Box
            sx={{
                width: "100%",
                mx: 'auto',

                backgroundColor: "#ffffffff",
                borderRadius: 3,
                boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
                p: { xs: 3, md: 3 },
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "stretch",
            }}
        >
            {/* Fields Row */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: { xs: "wrap", md: "nowrap" },
                    gap: 2,
                    justifyContent: "space-between",
                }}
            >
                {/* City */}
                <Box
                    sx={{
                        flex: { xs: "1 1 100%", md: "1 1 280px" },
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        px: 2,
                        backgroundColor: "#fff",
                        height: 64,
                        minWidth: "200px",
                    }}
                >
                    <Autocomplete
                        freeSolo
                        fullWidth
                        disableClearable={false}
                        options={cityOptions.map((c) => c.label)}
                        value={searchOption.location || ""}
                        onInputChange={handleCityChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Enter a destination or property"
                                variant="standard"
                                InputProps={{
                                    ...params.InputProps,
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiInputBase-input": {
                                        fontSize: "1rem",
                                        py: 1.5,
                                    },
                                }}
                            />
                        )}
                    />
                </Box>

                {/* From Date */}
                <Box
                    sx={{
                        flex: { xs: "1 1 42%", md: "0 1 160px" },
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        px: 2,
                        backgroundColor: "#fff",
                        height: 64,
                    }}
                >
                    <DatePicker
                        label=""
                        value={searchOption.from}
                        onChange={(newValue) => setSearchOption({ ...searchOption, from: newValue })}
                        minDate={dayjs()}
                        slotProps={{
                            textField: {
                                variant: "standard",
                                placeholder: "Check-in",
                                InputProps: { disableUnderline: true },
                                sx: {
                                    "& .MuiInputBase-input": { fontSize: "1rem", py: 1.25 },
                                    width: "100%",
                                },
                            },
                        }}
                    />
                </Box>

                {/* To Date */}
                <Box
                    sx={{
                        flex: { xs: "1 1 42%", md: "0 1 160px" },
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        px: 2,
                        backgroundColor: "#fff",
                        height: 64,
                    }}
                >
                    <DatePicker
                        label=""
                        value={searchOption.to}
                        onChange={(newValue) => setSearchOption({ ...searchOption, to: newValue })}
                        minDate={minDate}
                        slotProps={{
                            textField: {
                                variant: "standard",
                                placeholder: "Check-out",
                                InputProps: { disableUnderline: true },
                                sx: {
                                    "& .MuiInputBase-input": { fontSize: "1rem", py: 1.25 },
                                    width: "100%",
                                },
                            },
                        }}
                    />
                </Box>

                {/* Guests */}
                <Box
                    sx={{

                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        px: 2,
                        backgroundColor: "#fff",
                        height: 64,
                        cursor: "pointer"
                    }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <PersonIcon sx={{ mr: 1 }} color="primary" />
                    <Typography sx={{ flexGrow: 1, color: "#000" }}>
                        {occupancy.adults} adult{occupancy.adults > 1 ? "s" : ""}, {occupancy.childAges.length} child
                        <Typography
                            component="span"
                            sx={{
                                color: "grey.600",
                                fontSize: "0.875rem",
                                ml: 0.5
                            }}
                        >
                            · {occupancy.roomCount} room{occupancy.roomCount > 1 ? "s" : ""}
                        </Typography>
                    </Typography>

                </Box>

                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                >
                    <Box sx={{ p: 2, width: 250 }}>
                        {/* Room */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Typography>Room</Typography>
                            <Box>
                                <IconButton onClick={() => handleOccupancyChange("roomCount", -1)}>
                                    <RemoveIcon />
                                </IconButton>
                                {occupancy.roomCount}
                                <IconButton onClick={() => handleOccupancyChange("roomCount", 1)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Adults */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Typography>Adults</Typography>
                            <Box>
                                <IconButton onClick={() => handleOccupancyChange("adults", -1)}>
                                    <RemoveIcon />
                                </IconButton>
                                {occupancy.adults}
                                <IconButton onClick={() => handleOccupancyChange("adults", 1)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Children */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Typography>Children</Typography>
                            <Box>
                                <IconButton onClick={() => handleOccupancyChange("childAges", -1)}>
                                    <RemoveIcon />
                                </IconButton>
                                {occupancy.childAges.length}
                                <IconButton onClick={() => handleOccupancyChange("childAges", 1)}>
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Age Selectors */}
                        {occupancy.childAges.length > 0 && (
                            <Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Age of Children
                                </Typography>
                                {occupancy.childAges.map((age, i) => (
                                    <Select
                                        key={i}
                                        value={age || ""}
                                        onChange={(e) => handleChildAgeChange(i, parseInt(e.target.value))}
                                        displayEmpty
                                        size="small"
                                        fullWidth
                                        sx={{ mb: 1 }}
                                    >
                                        <MenuItem value="">Select Age</MenuItem>
                                        {Array.from({ length: 17 }, (_, idx) => (
                                            <MenuItem key={idx} value={idx + 1}>
                                                {idx + 1}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Popover>
            </Box>

            {/* Button Row */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{
                        backgroundColor: "#062a4eff",
                        color: "#fff",
                        borderRadius: 2,
                        px: 6,
                        py: 1.75,
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#062a4eff" },
                        width: { xs: "100%", sm: "60%", md: "auto" },
                    }}
                >
                    SEARCH
                </Button>
            </Box>
            <LoginAndRegisterForm
                open={showLoginDialog}
                onClose={() => setShowLoginDialog(false)}
                onLoginSuccess={() => {
                    setShowLoginDialog(false);
                    setShowAuthAlert(false);
                    // Retry search after login
                    handleSearch();
                }}
            />

            {/* ✅ Add Auth Alert */}
            <Snackbar
                open={showAuthAlert}
                autoHideDuration={4000}
                onClose={() => setShowAuthAlert(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="warning" onClose={() => setShowAuthAlert(false)}>
                    Please login to search for hotels
                </Alert>
            </Snackbar>
        </Box>

    );
}