import { Alert, Snackbar } from "@mui/material";
import { useErrorContext } from "../../context/ErrorContext";

export const ErrorSnackbar = () => {
  const errorContext = useErrorContext();

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    errorContext.hideError?.();
  };

  const displayMessage = () => {
    if (errorContext.errorData.error) {
      return `Error: ${errorContext.errorData.statusCode} \
      ${errorContext.errorData.error}\n\
      ${errorContext.errorData.message}`;
    } else {
      return `Error: ${errorContext.errorData.statusCode} \
      ${errorContext.errorData.message}`;
    }
  };

  return (
    <Snackbar
      open={errorContext.showError}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert severity="error" variant="filled">
        {displayMessage()}
      </Alert>
    </Snackbar>
  );
};
