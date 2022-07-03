import React, { useState } from "react";
import styles from "./ProfileSettingsDialog.module.css";

import { TextField } from "../Inputs/TextField";

// import { ButtonUpdateChannel } from "../Buttons/ButtonUpdateChannel";

import userService from "../../services/user";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";

import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useSocketContext } from "../../context/SocketContext";
import { IUserSelf } from "../../interfaces/IUser";
import { useSessionContext } from "../../context/SessionContext";
import { TwoFactorAuth } from "../TwoFactorAuthSettings/TwoFactorAuth";
import { maxWidth, style } from "@mui/system";
import { Box, Paper, Stack } from "@mui/material";
import TextFieldMUI from "@mui/material/TextField";
import { AvatarSettings, SettingsAvatar } from "./SettingsAvatarDialog";

export function ProfileSettingsDialog({
	user,
	open,
	setOpen,
}: {
	user: IUserSelf;
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const errorContext = useErrorContext();
	const socketContext = useSocketContext();
	const sessionContext = useSessionContext();
	const [username, setUsername] = useState(user.username);

	const [textFieldError, setTextFieldError] = useState("");
	
	const [newImage, setNewImage] = useState<Blob>();
	const [preview, setPreview] = useState("");

	const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm');
	const [alreadySet, setAlreadySet] = useState(false);

	const handleClose = () => {
		setAlreadySet(false);
		setOpen(false);
	};

	const updateUser = () => {
		let error = false;
		setTextFieldError("");
		if (username === "") {
			setTextFieldError("Username cannot be empty.");
			error = true;
		}
		if (error === false) {
			setOpen(false);
			if (username !== user.username) {
				userService
					.updateUserUsername(user.login42, username)
					.then(() => {
						sessionContext.updateUserSelf?.(); //! Can be done only once
					})
					.catch((error) => {
						errorContext.newError?.(errorHandler(error, sessionContext));
					});
			}
			if (newImage !== undefined) {
				const formData = new FormData();
				formData.append("file", newImage);
				userService
					.updateUserImage(user.login42, formData)
					.then(() => {
						setNewImage(undefined);
						setPreview("");
						sessionContext.updateUserSelf?.(); //! Can be done only once
					})
					.catch((error) => {
						errorContext.newError?.(errorHandler(error, sessionContext));
					});
			}
		}
	};

	function ButtonUpdateChannel({
		updateChannel,
	}: {
		updateChannel: () => void;
	}) {
		return (
			<div
				className={styles.channel_settings_update}
				onClick={updateChannel}
			>
				Update
			</div>
		);
	}

	return (
		<>
			<IconButton size="large" onClick={() => setOpen(true)}>
				<SettingsIcon
					style={{
						color: "#ffffff",
					}}
					fontSize="large"
				/>
			</IconButton>
			<Dialog
				PaperProps={{ style: { backgroundColor: "#163F5B" } }}
				open={open}
				onClose={handleClose}
				maxWidth={maxWidth}>
				<DialogTitle>
					User settings
				</DialogTitle>
				<DialogContent>
					<Box className={styles.globalSettings}>
						<div className={styles.chat_create_channel_form_input}>
							Username
						</div>
						<TextField
							value={username}
							setValue={setUsername}
							error={textFieldError}
						/>
						<SettingsAvatar	preview={preview}
										setNewImage={setNewImage}
										setPreview={setPreview}
										user={user}/>
						<TwoFactorAuth />
						<DialogActions>
							<ButtonUpdateChannel updateChannel={updateUser} />
						</DialogActions>
					</Box>
				</DialogContent>
			</Dialog>
	</>
)}