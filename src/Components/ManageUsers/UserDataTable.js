import React, { useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import ManageUsersContext from './ManageUsersContext';
import { deleteUser } from '../../helpers/users'

// only for display, should have functionality from Context for delete and edit
function UserDataTable() {
    const { control, handleSubmit, reset, formState: { errors, isSubmitted, isSubmitSuccessful, isValid }, watch, setError, clearErrors, setValue, getValues }
        = useFormContext();
    const sessionKey = useSelector(state => state.auth.sessionKey);
    const { dispatch, userTable, reloadUserTable } = useContext(ManageUsersContext);

    const handleDelete = async (row) => {
        const userId = row._id;

        if (sessionKey === userId) {
            setError("email", { type: 'custom', message: 'You can\'t delete your own account' });
            return;
        } else {
            const isDeleted = await deleteUser(userId);
            if (isDeleted) {
                if (getValues("email").toLowerCase() === row.email.toLowerCase()) {
                    reset();
                }
                reloadUserTable();
            }
        }
    };

    const handleEdit = (row) => {
        reset(row);
    }

    const columns = [{ field: '_id', headerName: 'ID', width: 250 },
    {
        field: 'email',
        headerName: 'Email',
        width: 200,
        editable: false
    },
    {
        field: 'password',
        headerName: 'Password',
        width: 180,
        editable: false
    },
    {
        field: 'role',
        headerName: 'Role',
        width: 110,
        editable: false
    },
    {
        field: "action",
        headerName: "Action",
        sortable: false,
        width: 180,
        renderCell: ({ row }) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, my: 1 }}>
                    <Button variant="outlined" color="primary" size="small" onClick={() => (handleEdit(row))}>Edit</Button>
                    <Button variant="outlined" color="primary" size="small" onClick={() => (handleDelete(row))}>Delete</Button>
                </Box>
            );
        }
    }
    ];

    const rows = userTable.itemList;

    return (
        <Box sx={{ maxWidth: '90%', pt: 5 }}>
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
        </Box >
    );
};

export default UserDataTable;