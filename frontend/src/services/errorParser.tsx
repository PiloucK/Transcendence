import axios, { AxiosError } from "axios";

const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const CONFLICT = 409;
const UNKNOWN_ERROR = 520;

interface IErrorData { // Move the interface definition in 'interfaces' folder
  error: string;
  message: string;
  statusCode: number;
}

const defaultErrorData: IErrorData = {
  error: 'no error',
  message: 'no error',
  statusCode: 0,
};

export function errorParser(error: Error | AxiosError, loginContext: any): IErrorData { // TODO: loginContext define the type
  let errorData: IErrorData = defaultErrorData;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      console.error("HTTP response status code:", error.response.status);
      errorData = error.response.data as IErrorData;
      console.log(errorData);
      if (error.response.status === UNAUTHORIZED) {
        // and for restrictToReqUser?
        loginContext.logout?.();
        // } else if (error.response.status === NOT_FOUND) {
        // } else if (error.response.status === CONFLICT) {
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Error in HTTP request:", error.request);
      errorData.error = 'HTTP request failure';
      errorData.message = 'Request made but no response received.';
      errorData.statusCode = UNKNOWN_ERROR;
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up the request. Message:", error.message);
    errorData.error = 'Error setting up the HTTP request';
    errorData.message = error.message;
    errorData.statusCode = UNKNOWN_ERROR;
  }

  return (errorData);
}
