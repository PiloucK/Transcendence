import { Button, TextField } from "@mui/material";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useLoginContext } from "../context/LoginContext";
import { errorHandler } from "../services/errorHandler";
import twoFactorAuthService from "../services/twoFactorAuth";

export default function TwoFactorAuth() {
  const loginContext = useLoginContext();

  const [image, setImage] = useState("");
  const [code, setCode] = useState("");

  const generateQrCode = () => {
    twoFactorAuthService.generateQrCode().then((qrCode) => {
      setImage(qrCode);
    });
  };

  const sendValidationCode: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log(code);

    twoFactorAuthService
      .turnOn(code)
      .then(() => {
        setCode("");
      })
      .catch((error) => {
        errorHandler(error, loginContext);
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
