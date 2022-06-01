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
    hideError?: () => void;
    showError: boolean;
}

const defaultErrorData: IErrorData = {
    error: 'no error',
    message: 'no error',
    statusCode: 0,
};

const defaultErrorState: IErrorContext = {
    errorData: defaultErrorData,
    showError: false,
};

const ErrorContext = createContext<IErrorContext>(defaultErrorState)

export const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [errorData, setErrorData] = useState(defaultErrorState.errorData);
    const [showError, setShowError] = useState(defaultErrorState.showError);

    const newError = (errorData: IErrorData) => {
        setErrorData(errorData);
        setShowError(true);
    }

    const hideError = () => {
        setShowError(false);
    }

    return (
        <ErrorContext.Provider
            value={{
                errorData,
                newError,
                hideError,
                showError,
            }}
        >
            {children}
        </ErrorContext.Provider>
    )
}

export function useErrorContext() {
    return useContext(ErrorContext)
}
