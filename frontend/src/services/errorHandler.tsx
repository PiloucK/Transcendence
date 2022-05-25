import axios, { AxiosError } from "axios";
import React from "react";
import { useLoginContext } from "../context/LoginContext";

const UNAUTHORIZED = 401;

export function errorHandler(error: Error | AxiosError, loginContext: any) {

  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      console.error("HTTP response status code:", error.response.status);
      if (error.response.status === UNAUTHORIZED) {
        loginContext.logout?.();
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