import { Container } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import CreateOrUpdateUser from "./CreateOrUpdateUser";
import UserDataTable from "./UserDataTable";
import { ManageUsersProvider } from "./ManageUsersContext";

function ManagerUsers() {
    return (<Container maxWidth={false} sx={{ justifyContent: "center" }}>
        <ManageUsersProvider>
            <CreateOrUpdateUser />
            <UserDataTable />
        </ManageUsersProvider>
    </Container >);
}

export default ManagerUsers;