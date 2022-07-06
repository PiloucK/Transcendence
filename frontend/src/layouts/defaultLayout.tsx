import React, { useEffect } from "react";
import { useSessionContext } from "../context/SessionContext";
import { useErrorContext } from "../context/ErrorContext";
import { useSocketContext } from "../context/SocketContext";
import { authenticate } from "../events/authenticate";
import { GameInvitation } from "../components/Cards/GameInvitation";
import { goToIndexOnEscape } from "../events/goToIndexOnEscape";

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
	const sessionContext = useSessionContext();
	const errorContext = useErrorContext();
	const socketContext = useSocketContext();

	useEffect(() => {
		window.addEventListener('keydown', goToIndexOnEscape, true);
		authenticate(errorContext, socketContext, sessionContext);
	}, []);

	return (
		<>
			<GameInvitation />
			{children}
		</>
	);
};
