import style from "./TwoFactorAuth.module.scss";
import twoFactorAuthService from "../../services/twoFactorAuth";

import { FormControlLabel, Switch } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";

export default function ToggleSwitch({
  checked,
  setChecked,
  setQrcode,
  hasBeenActivated,
}: {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  setQrcode: Dispatch<SetStateAction<boolean>>;
  hasBeenActivated: boolean;
}) {

  const errorContext = useErrorContext();
  const sessionContext = useSessionContext();

  const onChange = () => {

    if (checked === true) {
      twoFactorAuthService
        .turnOff()
        .then(() => {
          sessionContext.updateUserSelf?.();
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
    else if (hasBeenActivated === true) {
      twoFactorAuthService
        .turnOn()
        .then(() => {
          sessionContext.updateUserSelf?.();
        })
        .catch((error) => {
          errorContext.newError?.(errorHandler(error, sessionContext));
        });
    }
    setQrcode(false);
    setChecked(!checked);
  };

  return (
    <FormControlLabel
      control={
        <Switch
          className={style.switch}
          checked={checked}
          onChange={onChange} />
      }
      label="Two Factor Authentication"
    />
  );
}
