import { Button, Dialog, DialogTitle } from "@mui/material";
import { AxiosError } from "axios";
import { FormEventHandler, useState } from "react";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import userService from "../../services/user";
import { TextField } from "../Inputs/TextField";

export const SetUsernameDialog = () => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const [username, setUsername] = useState("");
  const [textFieldError, setTextFieldError] = useState("");

  const updateUsername: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (username === "") {
      setTextFieldError("Username cannot be empty.");
    } else {
      userService
        .updateUserUsername(sessionContext.userSelf.login42, username)
        .then(() => {
          sessionContext.updateUserSelf?.();
        })
        .catch((caughtError: Error | AxiosError) => {
          const parsedError = errorHandler(caughtError, sessionContext);
          if (
            parsedError.statusCode === 409 &&
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
    <Dialog open={!sessionContext.userSelf.username}>
      <DialogTitle>Choose a username</DialogTitle>
      <form onSubmit={updateUsername}>
        <TextField
          value={username}
          setValue={setUsername}
          error={textFieldError}
        />
        <Button type="submit">ok</Button>
      </form>
    </Dialog>
  );
};
