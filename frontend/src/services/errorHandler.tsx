import axios, { AxiosError } from "axios";

const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const CONFLICT = 409;

export function errorHandler(error: Error | AxiosError, loginContext: any) {
  interface ErrorData {
    error: string;
    message: string;
    statusCode: number;
  }
  function displayErrorMsg(errorData: ErrorData) {
    alert(errorData.message); // snackbar
  }
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      console.error("HTTP response status code:", error.response.status);
      if (error.response.status === UNAUTHORIZED) {
        // and for restrictToReqUser?
        loginContext.logout?.();
      } else if (error.response.status === NOT_FOUND) {
        displayErrorMsg(error.response.data as ErrorData);
      } else if (error.response.status === CONFLICT) {
        displayErrorMsg(error.response.data as ErrorData);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Error in HTTP request:", error.request);
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up the request. Message:", error.message);
  }
}
