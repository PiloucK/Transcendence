import { createContext, useContext, useState } from 'react'
import React from 'react'
import Router from "next/router";

interface ILoginContext {
	userName: string | null;
	userSecret: string | null;
	login?: (userName: string, userSecret: string) => void;
	logout?: () => void;
}

const defaultLoginState = {
	userName: null,
	userSecret: null,
};

const LoginContext = React.createContext<ILoginContext>(defaultLoginState)

export const LoginProvider: React.FC = ( {children}: React.ReactNode ) => {
	const [userName, setUserName] = useState(defaultLoginState.userName)
	const [userSecret, setUserSecret] = useState(defaultLoginState.userSecret)

	const login = (userName: string, userSecret: string) => {
		setUserName(userName)
		setUserSecret(userSecret)
	}

	const logout = () => {
		setUserName(null)
		setUserSecret(null)
		Router.push("/");
	}

	return (
		<LoginContext.Provider
			value={{
				userName,
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
