import { Button, Stack, Typography } from "@mui/material";

function RegisterSuccess({ onClose }) {

    return (<Stack direction="column" spacing={2}>
        <Typography>Register Successfully!</Typography>
        <Button onClick={onClose} variant="contained">Continue</Button>
    </Stack>
    );
}

export default RegisterSuccess;