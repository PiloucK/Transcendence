import style from "./TwoFactorAuth.module.css";

import { FormControlLabel, Switch } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

export default function ToggleSwitch({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
}) {

  const onChange = () => {
    setChecked(!checked);
  };

  return (
    <FormControlLabel
      control={
        <Switch className={style.switch} checked={checked} onChange={onChange} />
      }
      label="Two Factor Authentification"
    />
  );
}
