import React, { useState } from "react";
import styles from "./ProfileSettingsDialog.module.css";

import { TextField } from "../Inputs/TextField";

// import { ButtonUpdateChannel } from "../Buttons/ButtonUpdateChannel";

import userService from "../../services/user";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
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

	const updateNewImage = (event) => {
		setNewImage(event.target.files[0]);
		setPreview(URL.createObjectURL(event.target.files[0]));
	};

	const Input = styled("input")({
		display: "none",
	});

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
						<label className={styles.image} htmlFor="icon-button-file">
							<Avatar
								src={preview}
								alt="avatar"
								sx={{
									left: "50%",
									transform: "translateX(-50%)",
									width: 151,
									height: 151,
									cursor: "pointer",
								}}
							>
								<Avatar
									src={user.image}
									alt="avatar"
									sx={{
										left: "50%",
										transform: "translateX(-50%)",
										width: 151,
										height: 151,
										cursor: "pointer",
									}}
								>
									<Avatar
										src={user.image}
										alt="avatar"
										sx={{
											left: "50%",
											transform: "translateX(-50%)",
											width: 151,
											height: 151,
											cursor: "pointer",
										}}
									/>
								</Avatar>
							</Avatar>
							<Input
								accept="image/*"
								id="icon-button-file"
								type="file"
								onChange={updateNewImage}
							/>
						</label>
						<TwoFactorAuth alreadySet={alreadySet}
										setAlreadySet={setAlreadySet}/>
						<DialogActions>
							<ButtonUpdateChannel updateChannel={updateUser} />
						</DialogActions>
					</Box>
				</DialogContent>
			</Dialog>
	</>
)}