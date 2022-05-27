import { createContext, useContext, useState } from 'react'
import React from 'react'
import Router from "next/router";

interface ILoginContext {
	userLogin: string | null;
	userSecret: string | null;
	chatMenu: string;
	setChatMenu: (menu: string) => void;
	chatDM: string;
	setChatDM: (dm: string) => void;
	login?: (userLogin: string, userSecret: string) => void;
	logout?: () => void;
}

const defaultLoginState = {
	userLogin: null,
	userSecret: null,
	chatMenu: "direct_message",
	chatDM: "new_message",
};

const LoginContext = createContext<ILoginContext>(defaultLoginState)

export const LoginProvider: React.FC = ( {children}: React.ReactNode ) => {
	const [userLogin, setUserLogin] = useState(defaultLoginState.userLogin)
	const [userSecret, setUserSecret] = useState(defaultLoginState.userSecret)
	const [chatMenu, setChatMenu] = useState(defaultLoginState.chatMenu)
	const [chatDM, setChatDM] = useState(defaultLoginState.chatDM)

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
				chatMenu,
				setChatMenu,
				chatDM,
				setChatDM,
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
