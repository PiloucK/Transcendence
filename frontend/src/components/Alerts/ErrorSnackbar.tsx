import { Snackbar } from "@mui/material";
import { useErrorContext } from "../../context/ErrorContext";

export const ErrorSnackbar = () => {
    const errorContext = useErrorContext();

    return (
        <Snackbar
            open={!!errorContext.errorData.statusCode}
            autoHideDuration={6000}
            onClose={errorContext.clearError}
            message={`Error: ${errorContext.errorData.statusCode} ${errorContext.errorData.error}\n${errorContext.errorData.message}`}
            // action={action}
        />
    )
}
