import React from "react";
import styles from "../styles/Home.module.css";
import TextFieldMUI from "@mui/material/TextField";

export function TextField(props: {
  value: string;
  setValue: (password: string) => void;
  error: string;
}) {
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length < 20 || event.target.value === "delete") {
			props.setValue(event.target.value);
		}
  };

  if (props.error !== "") {
    return (
      <TextFieldMUI
				variant="filled"
        sx={{
          m: 1,
          width: "20ch",
          backgroundColor: "#E5E5E5",
          borderRadius: "10px",
        }}
        error={true}
        helperText={props.error}
        onChange={handleValueChange}
        value={props.value}
      />
    );
  } else {
    return (
      <TextFieldMUI
				variant="filled"
        sx={{
          m: 1,
          width: "20ch",
          backgroundColor: "#E5E5E5",
          borderRadius: "10px",
        }}
        value={props.value}
        onChange={handleValueChange}
      />
    );
  }
}
