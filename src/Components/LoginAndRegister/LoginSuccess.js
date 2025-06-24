import { Button, Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function LoginSuccess({ onClose }) {
    const role = useSelector(state => state.auth.role);

    return (<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', p: 2, margin: 'auto' }}>
        <Typography component="h1" variant="h5" >Login Successfully!</Typography>
        {role === 'admin' && <Button component={Link} variant="contained" to="/Dashboard">Go to dashboard</Button>}
        <Button onClick={onClose} variant="contained">Close</Button>
    </Box>
    );
}

export default LoginSuccess;