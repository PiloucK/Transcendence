import { Box, Button, Grow } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

import twoFactorAuthService from "../../services/twoFactorAuth";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import { QrCodeDisplay } from "./qrCodeDisplay";
import styles from "./TwoFactorAuth.module.css"

export function TwoFactorAuth({
  alreadySet,
  setAlreadySet,
}: {
  alreadySet: boolean;
  setAlreadySet: Dispatch<SetStateAction<boolean>>;
}) {
  const [checked, setChecked] = useState(false);
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
        setAlreadySet(true);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };


  return (
    <>
      {checked === true ?
        <>
          {alreadySet === false ?
            <Grow in={checked}
              style={{ transformOrigin: '0 0 0' }}
              {...(checked ? { timeout: 1000 } : {})}>
              <Button variant="contained"
                className={styles.generateButton}
                onClick={generateQrCode}>Generate Qrcode</Button>
            </Grow>
            :
            <></>}
            <QrCodeDisplay image={image} qrCode={qrCode} checked={checked} />
        </>
        :
        <></>}
      <ToggleSwitch checked={checked}
        setChecked={setChecked}
      />
    </>
  );
}

