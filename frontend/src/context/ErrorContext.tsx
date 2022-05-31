import { createContext, useContext, useState } from 'react'
import React from 'react'
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

interface IErrorData {
    error: string;
    message: string;
    statusCode: number;
}

interface IErrorContext {
    errorData: IErrorData;
    newError?: (errorData: IErrorData) => void;
    clearError?: () => void;
}

const defaultErrorData: IErrorData = {
    error: 'no error',
    message: 'no error',
    statusCode: 0,
};

const defaultErrorState: IErrorContext = {
    errorData: defaultErrorData,
};

const ErrorContext = createContext<IErrorContext>(defaultErrorState)

export const ErrorProvider = (children: React.ReactNode) => {
    const [errorData, setErrorData] = useState(defaultErrorState.errorData)

    const newError = (errorData: IErrorData) => {
        setErrorData(errorData)
    }

    const clearError = () => {
        setErrorData(defaultErrorData)
    }

    return (
        <ErrorContext.Provider
            value={{
                errorData,
                newError,
                clearError
            }}
        >
            {children}
        </ErrorContext.Provider>
    )
}

export function useErrorContext() {
    return useContext(ErrorContext)
}
