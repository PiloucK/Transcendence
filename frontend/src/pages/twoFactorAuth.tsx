import { Button, TextField } from "@mui/material";
import axios from "axios";
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { useErrorContext } from "../context/ErrorContext";
import { useLoginContext } from "../context/LoginContext";
import { errorHandler } from "../errors/errorHandler";
import twoFactorAuthService from "../services/twoFactorAuth";

export default function TwoFactorAuth() {
  const loginContext = useLoginContext();
  const errorContext = useErrorContext();

  const [image, setImage] = useState("");
  const [code, setCode] = useState("");
  const [enabled, setEnabled] = useState(false);

  const checkIfEnabled = () => {
    axios
      .get("http://0.0.0.0:3001/two-factor-auth/enabled")
      .then((response) => {
        setEnabled(response.data);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, loginContext));
      });
  };
  useEffect(checkIfEnabled, []);
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
        checkIfEnabled();
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
      <p>is 2FA enabled? {enabled ? <span>yes</span> : <span>no</span>}</p>
      <Button onClick={checkIfEnabled}>recheck</Button>
    </>
  );
}
