import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar(snack , handleCloseSnack , message , type) {

    return (
        <Snackbar
            open={snack}
            autoHideDuration={4000}
            onClose={handleCloseSnack}
            message={message}
        >
            <Alert severity={type}>{message}</Alert>

        </Snackbar>
    )
}