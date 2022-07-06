import { Button, Fade, Grow, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { ChangeEventHandler, Dispatch, FormEventHandler, SetStateAction, useState } from "react";

import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import twoFactorAuthService from "../../services/twoFactorAuth";
import styles from "./TwoFactorAuth.module.scss"
import { HttpStatusCodes } from "../../constants/httpStatusCodes";

export function QrCodeDisplay({
	image,
	qrCode,
	checked,
	setQrcode,
	setHasBeenActivated,
	setFirstQrCode,
}: {
	image: string;
	checked: boolean;
	qrCode: any;
	setQrcode: Dispatch<SetStateAction<boolean>>;
	setHasBeenActivated: Dispatch<SetStateAction<boolean>>;
	setFirstQrCode: Dispatch<SetStateAction<boolean>>;
}) {
	const [code, setCode] = useState("");
	const [textFieldError, setTextFieldError] = useState("");

	const errorContext = useErrorContext();
	const sessionContext = useSessionContext();

	const handleCodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		setCode(event.target.value);
	};

	const sendValidationCode: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		let error = false;

		setTextFieldError("");
		if (code === "") {
			setTextFieldError("Code can't be empty.");
			error = true;
		}

		if (error === false) {
			twoFactorAuthService
				.turnOn(code)
				.then(() => {
					setCode("");
					sessionContext.updateUserSelf?.();
					setQrcode(false);
					setHasBeenActivated(true);
					setFirstQrCode(true);
				})
				.catch((caughtError: Error | AxiosError) => {
					const parsedError = errorHandler(caughtError, sessionContext);
					if (
						parsedError.statusCode === HttpStatusCodes.UNAUTHORIZED &&
						parsedError.message === "Wrong authentication code"
					) {
						setTextFieldError("Wrong code.");
					} else {
						errorContext.newError?.(parsedError);
					}
				});
		}
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
								error={textFieldError !== ""}
								helperText={textFieldError}
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