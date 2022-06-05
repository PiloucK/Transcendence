import { Button, TextField } from "@mui/material";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useErrorContext } from "../context/ErrorContext";
import { useLoginContext } from "../context/LoginContext";
import { errorHandler } from "../errors/errorHandler";
import twoFactorAuthService from "../services/twoFactorAuth";

export default function TwoFactorAuth() {
  const loginContext = useLoginContext();
  const errorContext = useErrorContext();

  const [image, setImage] = useState("");
  const [code, setCode] = useState("");

  const generateQrCode = () => {
    twoFactorAuthService.generateQrCode().then((qrCode) => {
      setImage(qrCode);
    });
  };

  const sendValidationCode: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    twoFactorAuthService
      .turnOn(code)
      .then(() => {
        setCode("");
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
      });
  };

  const handleCodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCode(event.target.value);
  };

  return (
    <>
      <Button onClick={generateQrCode}>generate qr code</Button>
      <img src={image} />
      <form onSubmit={sendValidationCode}>
        <TextField value={code} onChange={handleCodeChange} />
        <Button type="submit">send validation code</Button>
      </form>
    </>
  );
}
