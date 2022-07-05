import { Avatar, Input } from "@mui/material";
import styles from "./ProfileSettingsDialog.module.css";
import { styled } from "@mui/material/styles";
import { IUserSelf } from "../../interfaces/IUser";
import { ChangeEventHandler } from "react";

export function SettingsAvatar({
  preview,
  setNewImage,
  setPreview,
  user,
}: {
  preview: string;
  setNewImage: React.Dispatch<React.SetStateAction<Blob | undefined>>;
  setPreview: React.Dispatch<React.SetStateAction<string>>;
  user: IUserSelf;
}) {
  const Input = styled("input")({
    display: "none",
  });

  const updateNewImage: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files) {
      setNewImage(event.target.files[0]);
      setPreview(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <label className={styles.image} htmlFor="icon-button-file">
      <Input
        accept="image/*"
        id="icon-button-file"
        type="file"
        onChange={updateNewImage}
      />
      <Avatar
        src={preview}
        alt="avatar"
        sx={{
          left: "50%",
          transform: "translateX(-50%)",
          width: 151,
          height: 151,
          cursor: "pointer",
        }}
      >
        <Avatar
          src={user.image}
          alt="avatar"
          sx={{
            left: "50%",
            transform: "translateX(-50%)",
            width: 151,
            height: 151,
            cursor: "pointer",
          }}
        >
          <Avatar
            src={user.photo42}
            alt="avatar"
            sx={{
              left: "50%",
              transform: "translateX(-50%)",
              width: 151,
              height: 151,
              cursor: "pointer",
            }}
          />
        </Avatar>
      </Avatar>
    </label>
  );
}
