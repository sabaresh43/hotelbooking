import React, { useState, useReducer, createContext, useEffect } from 'react';
import { findAllHotels } from '../../helpers/hotels';

const ManageHotelsContext = createContext();

const initialHotelTable = {
    itemList: []
};

const hotelTableReducer = (state, action) => {
    switch (action.type) {
        case 'initialize':
            return {
                ...state,
                itemList: action.payload.data
            };
        default: return state;
    }
};

export const ManageHotelsProvider = ({ children }) => {
    const [hotelTable, dispatch] = useReducer(hotelTableReducer, initialHotelTable);

    const reloadHotelTable = async () => {
        const hotelList = await findAllHotels();
        if (hotelList) {
            dispatch({
                type: 'initialize',
                payload: {
                    'data': hotelList
                }
            })
        } else {
            console.error('Error fetching hotel data');
        }
    }

    useEffect(() => {
        reloadHotelTable();
    }, []);

    return (
        <ManageHotelsContext.Provider value={{ dispatch, hotelTable, reloadHotelTable }} >
            {children}
        </ManageHotelsContext.Provider>
    );
};

export default ManageHotelsContext;