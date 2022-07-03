import React from "react";
import styles from "../../styles/Home.module.css";
import { inputPFState } from "../../interfaces/inputPasswordField";

import FormControl from "@mui/material/FormControl";
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export function PasswordField(props: {
  password: inputPFState;
  setPassword: (password: inputPFState) => void;
  id: string;
  error: string;
}) {
  const handlePasswordChange =
    (prop: keyof inputPFState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setPassword({
        ...props.password,
        [prop]: event.target.value,
      });
    };

  const handleClickShowPassword = () => {
    props.setPassword({
      ...props.password,
      showPassword: !props.password.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  if (props.error !== "") {
    return (
      <FormControl
        sx={{
          m: 1,
          width: "20ch",
          backgroundColor: "#E5E5E5",
          borderRadius: "10px",
        }}
        variant="filled"
        error={true}
      >
        <InputLabel htmlFor="filled-adornment-password">
          Empty for no password
        </InputLabel>
        <FilledInput
          disableUnderline={true}
          id={props.id}
          type={props.password.showPassword ? "text" : "password"}
          value={props.password.password}
          onChange={handlePasswordChange("password")}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {props.password.showPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
				<FormHelperText>{props.error}</FormHelperText>
      </FormControl>
    );
  } else {
    return (
      <FormControl
        sx={{
          m: 1,
          width: "20ch",
          backgroundColor: "#E5E5E5",
          borderRadius: "10px",
        }}
        variant="filled"
      >
        <InputLabel htmlFor="filled-adornment-password">
          Empty for no password
        </InputLabel>
        <FilledInput
          disableUnderline={true}
          id={props.id}
          type={props.password.showPassword ? "text" : "password"}
          value={props.password.password}
          onChange={handlePasswordChange("password")}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {props.password.showPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    );
  }
}
