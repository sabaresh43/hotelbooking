import React, { useReducer, createContext, useEffect,useState } from 'react';
import hotelService from '../../services/hotel.service';
import { useRef } from 'react';


const HotelDisplayContext = createContext();

const initialHotelList = {
    itemList: [],
    cityList: [],
    loading: false,
};

const hotelListReducer = (state, action) => {
    switch (action.type) {
         case "setLoading":  // ✅ ADD this case
            return {
                ...state,
                loading: true
            };
        case "initialize": {
            const data = Array.isArray(action.payload?.data)
                ? action.payload.data
                : [];

            return {
                ...state,
                itemList: data,
                cityList: [],
                loading: false 
            };
        }
        default:
            return state;
    }
};

export const HotelDisplayProvider = ({ children, searchOptions }) => {
    const [hotelList, dispatch] = useReducer(hotelListReducer, initialHotelList);
    const [searchParams, setSearchParams] = useState(searchOptions || {}); // ✅ Initialize with empty object
    const [loading, setLoading] = useState(false);
    const previousSearchRef = useRef(null);

    useEffect(() => {
        if (searchOptions && (searchOptions.location || searchOptions.cityCode)) {
            // ✅ Only reload if search params actually changed
            const searchKey = JSON.stringify({
                location: searchOptions.location,
                cityCode: searchOptions.cityCode,
                from: searchOptions.from,
                to: searchOptions.to,
                numberOfGuest: searchOptions.numberOfGuest
            });

            if (previousSearchRef.current !== searchKey) {
                previousSearchRef.current = searchKey;
                setSearchParams(searchOptions);
                loadHotelList(searchOptions);
            }
        }
    }, [searchOptions]);

    const loadHotelList = async (options = {}) => {
        if (!options || (!options.location && !options.cityCode)) {
            return;
        }

        setLoading(true);
        dispatch({ type: 'setLoading' }); 
        let responseData = [];

        try {
             const occupancyPayload = options.occupancy?.map(occ => ({
            adults: occ.adults,
            roomCount: occ.roomCount,
            childAges: occ.childAges || []
        })) || [{ adults: options.numberOfGuest || 2, roomCount: 1, childAges: [] }];

            const payload = {
                ...options,
                fromDate: options.from,
                toDate: options.to,
                 occupancy: occupancyPayload 
            };

            console.log("Payload being sent:", payload);
            const response = await hotelService.searchHotels(payload);
            responseData = response?.data || [];
            console.log("Hotels loaded:", responseData.length);
        } catch (error) {
            console.error("Error loading hotels:", error);
        } finally {
            setLoading(false);
        }

        dispatch({
            type: 'initialize',
            payload: { data: responseData },
        });
    };

    return (
        <HotelDisplayContext.Provider value={{ 
            dispatch, 
            hotelList, 
            loadHotelList, 
            searchParams,
            loading 
        }}>
            {children}
        </HotelDisplayContext.Provider>
    );
};

export default HotelDisplayContext;
