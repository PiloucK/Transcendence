import { Button, Dialog, TextField } from "@mui/material";
import styles from "../styles/Home.module.css";
import Router from "next/router";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useErrorContext } from "../context/ErrorContext";
import { useSessionContext } from "../context/SessionContext";
import { errorHandler } from "../errors/errorHandler";
import twoFactorAuthService from "../services/twoFactorAuth";

export default function SecondFactorLoginPage() {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const [code, setCode] = useState("");

  const sendValidationCode: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    twoFactorAuthService
      .authenticate(code)
      .then(() => {
        Router.push("/");
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };

  const handleCodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCode(event.target.value);
  };

  return (
    <div className={styles.second_factor_login}>
      <h1>Enter second factor code</h1>
      <form onSubmit={sendValidationCode}>
        <TextField
          sx={{
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
          }}
          value={code}
          onChange={handleCodeChange}
        />
        <Button
          sx={{
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
          }}
          type="submit"
        >
          send
        </Button>
      </form>
    </div>
  );
}
