import { Button } from "@mui/material";
import { useState } from "react";
import twoFactorAuthService from "../services/twoFactorAuth";

export default function TwoFactorAuth() {
  const [image, setImage] = useState("data:image/png;base64,");

  const generateQrCode = () => {
    twoFactorAuthService.generateQrCode().then((qrCode) => {
      setImage("data:image/png;base64," + Buffer.from(qrCode, "base64"));
      let image = new Image();
      image.crossOrigin = 'Anonymous';
      image.onload = function () {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let dataURL;
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        ctx?.drawImage(image, 0, 0);
        dataURL = canvas.toDataURL();
      };
      image.src =
        "data:image/gif;base64, R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      const div = document.getElementById("id");
      div?.appendChild(image);
    });
  };

  return (
    <>
      <Button onClick={generateQrCode}>generate qr code</Button>
      <div id="id"></div>
    </>
  );
}
