import React, { useState, useReducer, createContext, useEffect } from 'react';
import { findAllBookings } from '../../helpers/bookings';

const ViewBookingsContext = createContext();

const initialBookingTable = {
    isLoaded: false,
    itemList: []
};

const bookingTableReducer = (state, action) => {
    switch (action.type) {
        case 'initialize':
            return {
                ...state,
                itemList: action.payload.data,
                isLoaded: true
            };
        case 'setIsLoaded':
            return {
                ...state,
                isLoaded: true
            };
        default: return state;
    }
};

export const ViewBookingsProvider = ({ children }) => {
    const [bookingTable, dispatch] = useReducer(bookingTableReducer, initialBookingTable);

    async function reloadBookingTable() {
        if (bookingTable.isLoaded) return;
        const bookingList = await findAllBookings();
        if (bookingList) {
            dispatch({
                type: 'initialize',
                payload: {
                    'data': bookingList
                }
            });
        } else {
            console.error('Error fetching booking data');
        }
    }

    useEffect(() => {
        reloadBookingTable();
    }, []);

    return (
        <ViewBookingsContext.Provider value={{ dispatch, bookingTable, reloadBookingTable }} >
            {children}
        </ViewBookingsContext.Provider>
    );
};

export default ViewBookingsContext;