import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { ToastContext } from "./App";
import { useContext } from "react";

export default function Toast() {
    const { toastState, setToastState } = useContext(ToastContext);

    const handleClose = () => {
        setToastState((prevState) => {
            return {
                show: false,
                type: prevState.type
            };
        });
    };

    const severity = {
        dimension: "info",
        complete: "success",
    };

    const toastMessages = {
        dimension: "Max screen dimension set",
        complete: "Maze generation complete!"
    };

    return (
        <Snackbar 
            open={toastState.show} 
            onClose={handleClose}
            autoHideDuration={3000} 
            TransitionComponent={Slide}
         >
        <Alert 
            severity={severity[toastState.type]} 
            sx={{ width: '100%' }}
        >
            {toastMessages[toastState.type]}
        </Alert>
        </Snackbar>
    );
};
