import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

export function TwoFactorAuth() {
  const [checked, setChecked] = useState(true);

  return (
    <>
      <ToggleSwitch checked={checked} setChecked={setChecked} />
      {checked === true ? <> </> : <></>}
    </>
  );
}
