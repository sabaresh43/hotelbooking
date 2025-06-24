import React, { useReducer, createContext, useEffect } from 'react';
import { findAllHotels } from '../../helpers/hotels';

const HotelDisplayContext = createContext();

const initialHotelList = {
    itemList: []
};

const hotelListReducer = (state, action) => {
    switch (action.type) {
        case 'initialize':
            return {
                ...state,
                itemList: action.payload.data.filter(hotel => hotel.isActive) // only load active hotel
            };
        default: return state;
    }
};

export const HotelDisplayProvider = ({ children }) => {
    // store the data from backend
    const [hotelList, dispatch] = useReducer(hotelListReducer, initialHotelList);

    useEffect(() => {
        loadHotelList();
    }, []);


    const loadHotelList = async () => {
        const responseData = await findAllHotels();
        dispatch({
            type: 'initialize',
            payload: {
                'data': responseData || [],
            }
        });
    }

    return (
        <HotelDisplayContext.Provider value={{ dispatch, hotelList, loadHotelList }} >
            {children}
        </HotelDisplayContext.Provider>);
};

export default HotelDisplayContext;