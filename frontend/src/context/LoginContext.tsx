import { createContext, useContext, useState } from 'react'
import React from 'react'

interface ILoginContext {
	userName: string;
	userSecret: string;
}

const defaultLoginState = {
	userName: '',
	userSecret: '',
};

export const LoginContext = React.createContext<ILoginContext>(defaultLoginState)

export function LoginProvider( children: React.ReactNode ) {
	const [userName, setUserName] = useState(defaultLoginState.userName)
	const [userSecret, setUserSecret] = useState(defaultLoginState.userSecret)

	return (
		<LoginContext.Provider
			value={{
				userName,
				userSecret,
			}}
		>
			{children}
		</LoginContext.Provider>
	)
}

// export function useLogin() {
// 	const context = useContext(LoginContext)

// 	if (!context)
// 		throw new Error('useLogin must be used inside a `LoginProvider`')

// 	return context
// }
