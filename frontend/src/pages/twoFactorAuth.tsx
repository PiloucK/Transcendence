import { Button, TextField } from "@mui/material";
import axios from "axios";
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { useErrorContext } from "../context/ErrorContext";
import { useSessionContext } from "../context/SessionContext";
import { errorHandler } from "../errors/errorHandler";
import twoFactorAuthService from "../services/twoFactorAuth";

export default function TwoFactorAuth() {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();

  const [image, setImage] = useState("");
  const [code, setCode] = useState("");
  const [enabled, setEnabled] = useState(false);

  const checkIfEnabled = () => {
    axios
      .get("http://10.19.242.109:3001/two-factor-auth/enabled")
      .then((response) => {
        setEnabled(response.data);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };
  useEffect(checkIfEnabled, []);

  const generateQrCode = () => {
    twoFactorAuthService
      .generateQrCode()
      .then((qrCode) => {
        setImage(qrCode);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
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
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };

  const handleCodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCode(event.target.value);
  };

  const turnOff = () => {
    twoFactorAuthService
      .turnOff()
      .then(() => {
        checkIfEnabled();
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
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
      <Button onClick={turnOff}>turn off</Button>
    </>
  );
}