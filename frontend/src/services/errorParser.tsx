import axios, { AxiosError } from "axios";
import { HttpStatusCodes } from "../constants/httpStatusCodes";
import { defaultErrorData, IErrorData } from "../interfaces/IErrorData";

export function errorParser(error: Error | AxiosError): IErrorData {
  let errorData: IErrorData = defaultErrorData;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      console.error("HTTP response status code:", error.response.status);
      errorData = error.response.data as IErrorData;
    } else if (error.request) {
      // Request made but no response received
      console.error("Error in HTTP request:", error.request);
      errorData.error = 'HTTP request failure';
      errorData.message = 'Request made but no response received.';
      errorData.statusCode = HttpStatusCodes.UNKNOWN_ERROR;
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up the request. Message:", error.message);
    errorData.error = 'Error setting up the HTTP request';
    errorData.message = error.message;
    errorData.statusCode = HttpStatusCodes.UNKNOWN_ERROR;
  }

  return (errorData);
}
