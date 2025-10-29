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

// Example supplier getter — replace with your real implementation
// import { getSupplier } from '../utils/supplier';
const getSupplier = () => {
    // return 'goglobal' or 'dida' depending on runtime config
    // For demo default to 'goglobal'
    return window?.APP_SUPPLIER || "goglobal";
};

export default function SearchBar() {
    const navigate = useNavigate();
    const { searchOption, setSearchOption } = useContext(SearchContext);
    const [minDate, setMinDate] = useState(dayjs().add(1, "day"));
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const SUPPLIER = getSupplier();

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

    const handleIncrease = () =>
        setSearchOption((prev) => ({ ...prev, numberOfGuest: prev.numberOfGuest + 1 }));

    const handleDecrease = () => {
        if (searchOption.numberOfGuest > 1) {
            setSearchOption((prev) => ({ ...prev, numberOfGuest: prev.numberOfGuest - 1 }));
        }
    };

    const handleSearch = () => {
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
                         flex: { xs: "1 1 100%", md: "1 1 320px" },
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
                        flex: { xs: "1 1 48%", md: "0 1 180px" },
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
                       flex: { xs: "1 1 48%", md: "0 1 180px" },
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
                         flex: { xs: "1 1 100%", md: "0 1 160px" },
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        px: 2,
                        backgroundColor: "#fff",
                        height: 64,
                    }}
                >
                    <PersonIcon sx={{ color: "primary.main", mr: 1 }} />
                    
                    <Typography variant="body" sx={{ flexGrow: 1, fontSize: "1rem",color: "#555" }}>
                        {searchOption.numberOfGuest} adult{searchOption.numberOfGuest > 1 ? "s" : ""}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <IconButton size="small" onClick={handleDecrease} disabled={searchOption.numberOfGuest <= 1}>
                            <RemoveIcon />
                        </IconButton>
                        <IconButton size="small" onClick={handleIncrease}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>
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
        </Box>
    );
}