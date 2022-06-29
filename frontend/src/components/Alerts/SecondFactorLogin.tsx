import { Button, Dialog, TextField } from "@mui/material";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import twoFactorAuthService from "../../services/twoFactorAuth";

export const SecondFactorLogin = () => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const [code, setCode] = useState("");

  const sendValidationCode: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    twoFactorAuthService
      .authenticate(code)
      .then(() => {
        sessionContext.setShowSecondFactorLogin?.(false);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };

  const handleCodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCode(event.target.value);
  };

  return (
    <Dialog open={sessionContext.showSecondFactorLogin}>
      <form onSubmit={sendValidationCode}>
        <TextField value={code} onChange={handleCodeChange} />
        <Button type="submit">send validation code</Button>
      </form>
    </Dialog>
  );
};
