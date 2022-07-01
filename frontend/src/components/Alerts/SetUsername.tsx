import { Button, Dialog, DialogTitle } from "@mui/material";
import { AxiosError } from "axios";
import { FormEventHandler, useState } from "react";
import { HttpStatusCodes } from "../../constants/httpStatusCodes";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import userService from "../../services/user";
import { TextField } from "../Inputs/TextField";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";

export const SetUsernameDialog = () => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const [username, setUsername] = useState("");
  const [textFieldError, setTextFieldError] = useState("");

  const [newImage, setNewImage] = useState<Blob>();
  const [preview, setPreview] = useState("");

  const updateNewImage = (event) => {
    setNewImage(event.target.files[0]);
    setPreview(URL.createObjectURL(event.target.files[0]));
  };

  const Input = styled("input")({
    display: "none",
  });

  const updateUsername: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (username === "") {
      setTextFieldError("Username cannot be empty.");
    } else {
      userService
        .updateUserUsername(sessionContext.userSelf.login42, username)
        .then(() => {
          if (newImage !== undefined) {
            const formData = new FormData();
            formData.append("file", newImage);
            userService
              .updateUserImage(sessionContext.userSelf.login42, formData)
              .then(() => {
                setNewImage(undefined);
                setPreview("");
              })
              .catch((error) => {
                errorContext.newError?.(errorHandler(error, sessionContext));
              });
          }
          sessionContext.updateUserSelf?.();
        })
        .catch((caughtError: Error | AxiosError) => {
          const parsedError = errorHandler(caughtError, sessionContext);
          if (
            parsedError.statusCode === HttpStatusCodes.CONFLICT &&
            parsedError.message.startsWith(
              "duplicate key value violates unique constraint"
            )
          ) {
            setTextFieldError("Username already taken.");
          } else {
            errorContext.newError?.(parsedError);
          }
        });
    }
  };

  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: "#163F5B",
          minWidth: "350px",
          minHeight: "350px",
          display: "grid",
          justifyContent: "center",
        },
      }}
      open={!sessionContext.userSelf.username}
    >
      <DialogTitle>Set your profile</DialogTitle>
      <form onSubmit={updateUsername}>
        <TextField
          value={username}
          setValue={setUsername}
          error={textFieldError}
        />
        <Button type="submit">ok</Button>
      </form>
      <label htmlFor="icon-button-file">
        <Input
          accept="image/*"
          id="icon-button-file"
          type="file"
          onChange={updateNewImage}
        />
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
            src={sessionContext.userSelf.image}
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
              src={sessionContext.userSelf.photo42}
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
      </label>
    </Dialog>
  );
};
