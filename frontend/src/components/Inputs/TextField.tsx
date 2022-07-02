import React from "react";
import styles from "../styles/Home.module.css";
import TextFieldMUI from "@mui/material/TextField";

export function TextField(props: {
  label: string;
  value: string;
  setValue: (password: string) => void;
  error: string;
}) {
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < 20) {
      props.setValue(event.target.value);
    }
  };

  return (
    <TextFieldMUI
      label={props.label}
      variant="filled"
      sx={{
        m: 1,
        width: "20ch",
        backgroundColor: "#E5E5E5",
        borderRadius: "10px",
      }}
      error={props.error !== ""}
      helperText={props.error}
      onChange={handleValueChange}
      value={props.value}
      autoFocus
    />
  );
}
