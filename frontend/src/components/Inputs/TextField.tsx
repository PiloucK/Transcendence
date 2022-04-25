import React from "react";
import styles from "../styles/Home.module.css";
import TextFieldMUI from "@mui/material/TextField";

export function TextField(props: {
  value: string;
  setValue: (password: string) => void;
}) {
  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.setValue(event.target.value);
  };

  return (
    <TextFieldMUI
      sx={{
        m: 1,
        width: "20ch",
        backgroundColor: "#E5E5E5",
        borderRadius: "10px",
      }}
      value={props.value}
      onChange={handleValueChange}
      label=""
    />
  );
}
