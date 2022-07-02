import { Button, Fade, Grow, TextField } from "@mui/material";
import axios from "axios";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import twoFactorAuthService from "../../services/twoFactorAuth";
import styles from "./TwoFactorAuth.module.css"

export function QrCodeDisplay({
	image,
	qrCode,
	checked
}: {
	image: string;
	checked: boolean;
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
					<Fade in={checked}
						style={{ transformOrigin: '0 0 0' }}
						{...(checked ? { timeout: 1000 } : {})}>
						<img className={styles.qrCode} src={image} />
					</Fade>
					<Grow in={checked}
						style={{ transformOrigin: '0 0 0' }}
						{...(checked ? { timeout: 1000 } : {})}>
						<form onSubmit={sendValidationCode}
							className={styles.formStyle}>
							<TextField
								size="small"
								label="Enter code here"
								variant="filled"
								className={styles.textField}
								value={code}
								onChange={handleCodeChange} />
							<Button className={styles.validationButton}
								variant="contained"
								size="small"
								type="submit"
								>send code</Button>
						</form>
					</Grow>
				</>
				:
				<></>
			}
		</>
	)
}