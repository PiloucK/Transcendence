import { Button } from "@mui/material";
import { useState } from "react";
import twoFactorAuthService from "../services/twoFactorAuth";

export default function TwoFactorAuth() {
  const [image, setImage] = useState("");

  const generateQrCode = () => {
    twoFactorAuthService.generateQrCode().then((qrCode) => {
      setImage(qrCode);
    });
  };

  return (
    <>
      <Button onClick={generateQrCode}>generate qr code</Button>
      <img src={image} />
    </>
  );
}
