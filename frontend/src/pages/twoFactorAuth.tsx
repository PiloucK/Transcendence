import { Button } from "@mui/material";
import twoFactorAuthService from "../services/twoFactorAuth";

export default function TwoFactorAuth() {
  const generateQrCode = () => {
    twoFactorAuthService.generateQrCode().then((qrCode) => {
      console.log(qrCode);
    });
  };

  return (
    <>
      <Button onClick={generateQrCode}>generate qr code</Button>
      <img src={qrCode} />
    </>
  );
}
