import { Button } from "@mui/material";
import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

import twoFactorAuthService from "../../services/twoFactorAuth";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import { QrCodeDisplay } from "./qrCodeDisplay";

export function TwoFactorAuth() {
  const [checked, setChecked] = useState(false);
  const [alreadySet, setAlreadySet] = useState(false);
  const [image, setImage] = useState("");
  const [qrCode, setQrcode] = useState(false);

  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();

  const generateQrCode = () => {
    twoFactorAuthService
      .generateQrCode()
      .then((qrCode) => {
        setImage(qrCode);
        setQrcode(true);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };


  return (
    <>
      <ToggleSwitch checked={checked}
        setChecked={setChecked} />
      {checked === true ?
        <>
          <Button onClick={generateQrCode}>Generate Qrcode</Button>
          <QrCodeDisplay image={image} qrCode={qrCode}/>
        </>
        :
        <></>}
    </>
  );
}

