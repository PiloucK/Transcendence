import { createContext, useContext, useState } from 'react'
import React from 'react'
import Router from "next/router";

import Cookies from "js-cookie";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

interface ILoginContext {
	userLogin: string | null;
	chatMenu: string;
	setChatMenu: (menu: string) => void;
	chatDM: string;
	setChatDM: (dm: string) => void;
	login?: (userLogin: string) => void;
	logout?: () => void;
}

const defaultLoginState = {
	userLogin: null,
	chatMenu: "direct_message",
	chatDM: "new_message",
};

const LoginContext = createContext<ILoginContext>(defaultLoginState)

export const LoginProvider: React.FC = ({ children }: { children: React.ReactNode }) => {
	const [userLogin, setUserLogin] = useState(defaultLoginState.userLogin)
	const [chatMenu, setChatMenu] = useState(defaultLoginState.chatMenu)
	const [chatDM, setChatDM] = useState(defaultLoginState.chatDM)

	const login = (userLogin: string) => {
		setUserLogin(userLogin)
	}

	const logout = () => {
		setUserLogin(null)
		Router.push("/");
		Cookies.remove(publicRuntimeConfig.ACCESSTOKEN_COOKIE_NAME, {
			path: publicRuntimeConfig.ACCESSTOKEN_COOKIE_PATH,
		});
	}

	return (
		<LoginContext.Provider
			value={{
				userLogin,
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
