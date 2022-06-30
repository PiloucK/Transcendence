import { Button, TextField } from "@mui/material";
import axios from "axios";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import twoFactorAuthService from "../../services/twoFactorAuth";

export function QrCodeDisplay({
	image,
	qrCode,
}: {
	image: string;
	qrCode: any;
}) {
	const [code, setCode] = useState("");
	const [enabled, setEnabled] = useState(false);

	const errorContext = useErrorContext();
	const sessionContext = useSessionContext();
	
	const handleCodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setCode(event.target.value);
	  };
	
	  const checkIfEnabled = () => {
		axios
		  .get("http://0.0.0.0:3001/two-factor-auth/enabled")
		  .then((response) => {
			setEnabled(response.data);
		  })
		  .catch((error) => {
			errorContext.newError?.(errorHandler(error, sessionContext));
		  });
	  };
	
	const sendValidationCode: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
	
		twoFactorAuthService
		  .turnOn(code)
		  .then(() => {
			setCode("");
			checkIfEnabled();
		  })
		  .catch((error) => {
			errorContext.newError?.(errorHandler(error, sessionContext));
		  });
	  };
	return (
		<>
			{qrCode === true ?
				<>
					<img src={image} />
					<form onSubmit={sendValidationCode}>
						<TextField value={code} onChange={handleCodeChange} />
						<Button type="submit">submit</Button>
					</form>
				</>
				:
				<></>
			}
		</>
	)
}