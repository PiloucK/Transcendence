import { Button, Dialog, TextField } from "@mui/material";
import Router from "next/router";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useErrorContext } from "../../context/ErrorContext";
import { useLoginContext } from "../../context/LoginContext";
import { errorHandler } from "../../errors/errorHandler";
import twoFactorAuthService from "../../services/twoFactorAuth";

export const SecondFactorLogin = () => {
  const loginContext = useLoginContext();
  const errorContext = useErrorContext();
  const [code, setCode] = useState("");

  const sendValidationCode: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    twoFactorAuthService
      .authenticate(code)
      .then(() => {
        loginContext.setShowSecondFactorLogin?.(false);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
      });
  };

  const handleCodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCode(event.target.value);
  };

  return (
    <Dialog open={loginContext.showSecondFactorLogin}>
      <form onSubmit={sendValidationCode}>
        <TextField value={code} onChange={handleCodeChange} />
        <Button type="submit">send validation code</Button>
      </form>
    </Dialog>
  );
};
