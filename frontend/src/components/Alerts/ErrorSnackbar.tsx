import { Snackbar } from "@mui/material";
import { HttpStatusCodes } from "../../constants/httpStatusCodes";
import { useErrorContext } from "../../context/ErrorContext";
import { useLoginContext } from "../../context/LoginContext";

export const ErrorSnackbar = () => {
  const errorContext = useErrorContext();
  const loginContext = useLoginContext();

  const handleOpen = () => {
    if (errorContext.errorData.statusCode === HttpStatusCodes.UNAUTHORIZED) {
      loginContext.logout?.();
      // } else if (error.response.status === NOT_FOUND) { ?????
      // } else if (error.response.status === CONFLICT) { ?????
    }
    return errorContext.showError;
  };

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    errorContext.hideError?.();
  };

  return (
    <Snackbar
      open={handleOpen()}
      autoHideDuration={6000}
      onClose={handleClose}
      message={`Error: ${errorContext.errorData.statusCode} ${errorContext.errorData.error}\n${errorContext.errorData.message}`}
      // action={action
    />
  );
};
