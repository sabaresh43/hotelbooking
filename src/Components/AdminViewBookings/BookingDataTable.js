import React, { useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, } from '@mui/material';
import ViewBookingsContext from './ViewBookingsContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { findHotelById } from '../../helpers/hotels';
import { findUserById } from '../../helpers/users';
import { Skeleton } from '@mui/material';

// only for display, should have functionality from Context for delete and edit
function BookingDataTable() {
    const { dispatch, bookingTable, reloadBookingTable } = useContext(ViewBookingsContext);
    const navigate = useNavigate();

    const checkBookingDetails = async (row) => {
        var hotelData;
        var userData;

        // console.log("Booking data: ", row.hotel);
        // get hotel data
        try {
            const hotelDataResponse = await findHotelById(row.hotel);
            hotelData = hotelDataResponse;
        } catch (error) {
            console.error('Error during fetching hotel data:', error);
            return;
        }

        //const roomsData = hotelData.Rooms.filter(room => row.rooms.includes(room.RoomId));
        if (hotelData) {
            // get the rooms' data 
            const roomsData = hotelData.Rooms.filter(room => row.rooms.includes(room.RoomId));
            const { Rooms, ...pureHotelData } = hotelData;

            //get user data
            try {
                const userDataResponse = await findUserById(row.userId);
                userData = userDataResponse;
            } catch (error) {
                console.error('Error during fetching user data:', error);
            }

            // send the booking's corresponding data through navigate
            navigate(`/Dashboard/ViewBookings/${row._id}`, {
                state: {
                    bookingDetails: {
                        ...row,
                        hotel: pureHotelData,
                        rooms: roomsData,
                        userEmail: userData ? userData.email : ''
                    }
                }
            });
        } else {
            console.error("No hotel data of this booking found");
        }
    }

    const columns = [{ field: '_id', headerName: 'ID', flex: 1 },
    {
        field: 'hotel',
        headerName: 'Hotel Id', flex: 1
    },
    {
        field: 'userId',
        headerName: 'User Id', flex: 1
    },
    {
        field: 'time',
        headerName: 'Booked at',
        width: 160,
        valueGetter: (value, row) => {
            return `${dayjs(row.time).format('MMM D, YYYY h:mm A')}`
        }, flex: 1
    },
    {
        field: 'from',
        headerName: 'From',
        width: 100,
        valueGetter: (value, row) => {
            return `${dayjs(row.from).format('MMM D, YYYY')}`
        },
        editable: false, flex: 1
    },
    {
        field: 'to',
        headerName: 'To',
        width: 100,
        valueGetter: (value, row) => {
            return `${dayjs(row.to).format('MMM D, YYYY')}`
        },
        editable: false, flex: 1
    },
    {
        field: 'totalPrice',
        headerName: 'Price',
        width: 110,
        valueGetter: (value, row) => {
            return `$${row.totalPrice.toFixed(2)}`
        },
        editable: false, flex: 1
    },
    {
        field: 'Client Name',
        headerName: 'Client Name',
        valueGetter: (value, row) => {
            return `${row.clientInfo.firstName} ${row.clientInfo.lastName}`;
        },
        width: 150,
        editable: false, flex: 1
    },
    {
        field: 'Client Email',
        headerName: 'Client Email',
        valueGetter: (value, row) => {
            return `${row.clientInfo.email}`;
        },
        width: 180,
        editable: false, flex: 1
    },
    {
        field: 'Client Phone',
        headerName: 'Client Phone',
        valueGetter: (value, row) => {
            return `${row.clientInfo.phone}`;
        },
        width: 110,
        editable: false, flex: 1
    },
    {
        field: 'Card Holder Name',
        headerName: 'Card Holder Name',
        valueGetter: (value, row) => {
            return `${row.cardInfo.cardName}`;
        },
        width: 150,
        editable: false, flex: 1
    },
    {
        field: 'Card Number',
        headerName: 'Card Number',
        valueGetter: (value, row) => {
            return `${row.cardInfo.cardNumber.substring(0, 4)}-xxxx-xxxx-${row.cardInfo.cardNumber.substring(row.cardInfo.cardNumber.length - 4)}`;
        },
        width: 200,
        editable: false, flex: 1
    },
    {
        field: "action",
        headerName: "Action",
        sortable: false,
        width: 100,
        renderCell: ({ row }) => {
            return (
                <Button variant="outlined" color="primary" size="small" onClick={() => { checkBookingDetails(row) }}>View</Button>
            );
        }
    }
    ];

    const rows = bookingTable.itemList;

    if (!bookingTable.isLoaded) {
        return (
            <Box sx={{ width: '100%', height: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Skeleton variant="rectangular" height={40} width="100%" />
                <Skeleton variant="rectangular" height={40} width="100%" />
                <Skeleton variant="rectangular" height={40} width="100%" />
                <Skeleton variant="rectangular" height={40} width="100%" />
                <Skeleton variant="rectangular" height={40} width="100%" />
            </Box>
        );
    } else {
        return (
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                autoHeight

                sx={{
                    boxShadow: 2,
                    border: 1,
                    borderColor: 'primary.light',
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main',
                    },
                    bgcolor: '#f8fafc'
                }}
                pageSizeOptions={[10]}
                getRowId={(row) => row._id}
                disableRowSelectionOnClick
            />
        );
    }
};

export default BookingDataTable;