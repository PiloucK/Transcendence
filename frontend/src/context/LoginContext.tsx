import { createContext, useContext, useState } from 'react'
import React from 'react'
import Router from "next/router";

interface ILoginContext {
	userLogin: string | null;
	userSecret: string | null;
	login?: (userLogin: string, userSecret: string) => void;
	logout?: () => void;
}

const defaultLoginState = {
	userLogin: null,
	userSecret: null,
};

const LoginContext = React.createContext<ILoginContext>(defaultLoginState)

export const LoginProvider: React.FC = ( {children}: React.ReactNode ) => {
	const [userLogin, setUserLogin] = useState(defaultLoginState.userLogin)
	const [userSecret, setUserSecret] = useState(defaultLoginState.userSecret)

	const login = (userLogin: string, userSecret: string) => {
		setUserLogin(userLogin)
		setUserSecret(userSecret)
	}

	const logout = () => {
		setUserLogin(null)
		setUserSecret(null)
		Router.push("/");
	}

	return (
		<LoginContext.Provider
			value={{
				userLogin,
				userSecret,
				login,
				logout,
			}}
		>
			{children}
		</LoginContext.Provider>
	)
}

export function useLoginContext() {
	return useContext(LoginContext)
}
