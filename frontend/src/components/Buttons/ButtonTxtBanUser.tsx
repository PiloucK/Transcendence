import React from "react";

import styles from "../../styles/Home.module.css";
import { Channel } from "../../interfaces/Chat.interfaces";

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

import { useSessionContext } from "../../context/SessionContext";
import channelService from "../../services/channel";
import { useSocketContext } from "../../context/SocketContext";

export function ButtonTxtBanUser({
  login,
  channel,
}: {
  login: string;
  channel: Channel;
}) {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState<number | string>(300);

  const handleChange = (event: SelectChangeEvent<typeof time>) => {
    setTime(Number(event.target.value) || "");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleBanUser = () => {
    setOpen(false);
    channelService
      .banAChannelUser(sessionContext.userSelf.login42, channel.id, login, time)
      .then(() => {
        socketContext.socket.emit("user:update-public-channels");
        socketContext.socket.emit("user:update-joined-channel");
        socketContext.socket.emit("user:update-channel-content");
      })
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
        Ban
      </div>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Ban duration</DialogTitle>
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
                <option value={300}>5min</option>
                <option value={1800}>30min</option>
                <option value={3600}>1h</option>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleBanUser}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
