import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos, Channel } from "../../interfaces/users";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useLoginContext } from "../../context/LoginContext";
import userServices from "../../services/users";

import io from "socket.io-client";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

export function ButtonTxtMuteUser({
  login,
  channel,
}: {
  login: string;
  channel: Channel;
}) {
  const loginContext = useLoginContext();
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState<number | string>("");

  const handleChange = (event: SelectChangeEvent<typeof time>) => {
    setTime(Number(event.target.value) || "");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleMuteUser = () => {
    setOpen(false);
    userServices
      .muteAChannelUser(loginContext.userLogin, channel.id, login, time)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = (
    event: React.SyntheticEvent<unknown>,
    reason?: string
  ) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  return (
    <div>
      <div className={styles.buttons} onClick={handleClickOpen}>
        Mute
      </div>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Mute duration</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="input-time">Time</InputLabel>
              <Select
                native
                value={time}
                onChange={handleChange}
                input={<OutlinedInput label="Time" id="input-time" />}
              >
                <option value={5}>5min</option>
                <option value={30}>30min</option>
                <option value={60}>1h</option>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleMuteUser}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
