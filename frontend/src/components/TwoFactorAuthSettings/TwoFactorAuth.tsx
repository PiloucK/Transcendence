import { Box, Button, Fade, Grow } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

import twoFactorAuthService from "../../services/twoFactorAuth";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import { QrCodeDisplay } from "./qrCodeDisplay";
import styles from "./TwoFactorAuth.module.scss";

export function TwoFactorAuth({ }: {}) {
  const [checked, setChecked] = useState(false);
  const [image, setImage] = useState("");
  const [qrCode, setQrcode] = useState(false);
  const [hasBeenActivated, setHasBeenActivated] = useState(false);
  const [firstQrCode, setFirstQrCode] = useState(true);

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

  useEffect(() => {
    setChecked(sessionContext.userSelf.isTwoFactorAuthEnabled);
    twoFactorAuthService
      .has2FaBeenAlreadySetUp()
      .then((result: boolean) => {
        setHasBeenActivated(result);
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  }, []);

  return (
    <>
      {checked === true ? (
        <>
          {qrCode === true ? (
            <QrCodeDisplay
              image={image}
              qrCode={qrCode}
              setQrcode={setQrcode}
              checked={checked}
              setHasBeenActivated={setHasBeenActivated}
              setFirstQrCode={setFirstQrCode}
            />
          ) : (
            <>
              <Fade
                in={checked}
                style={{ transformOrigin: "0 0 0" }}
                {...(checked ? { timeout: 1000 } : {})}
              >
                <div className={styles.generateButtonDiv}>
                  Use this button to generate a new Qrcode
                  (to setup a new device for example)
                  <Button
                    variant="contained"
                    className={styles.generateButton}
                    onClick={generateQrCode}
                  >
                    Generate Qrcode
                  </Button>
                </div>
              </Fade>
              {hasBeenActivated === true ? <>Activated ✅</> : <></>}
            </>
          )}
        </>
      ) : (
        <></>
      )}
      <ToggleSwitch
        hasBeenActivated={hasBeenActivated}
        setQrcode={setQrcode}
        checked={checked}
        setChecked={setChecked}
        generateQrCode={generateQrCode}
        firstQrCode={firstQrCode}
        setFirstQrCode={setFirstQrCode}
      />
    </>
  );
}
