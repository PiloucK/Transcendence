import React from "react";

import styles from "../../styles/Home.module.css";
import { IUserPublicInfos, Channel } from "../../interfaces/IUser";

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
import channelService from "../../services/channel";

export function ButtonTxtMuteUser({
  login,
  channel,
}: {
  login: string;
  channel: Channel;
}) {
  const loginContext = useLoginContext();
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState<number | string>(300);

  const handleChange = (event: SelectChangeEvent<typeof time>) => {
    setTime(Number(event.target.value) || "");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleUnmuteUser = () => {
    channelService
      .muteAChannelUser(loginContext.userLogin, channel.id, login, 0)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMuteUser = () => {
    setOpen(false);
    channelService
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

  if (channel?.muted?.find((muted) => muted.login === login)) {
    return (
      <div className={styles.buttons} onClick={handleUnmuteUser}>
        Unmute
      </div>
    );
  }
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
                <option value={300}>5min</option>
                <option value={1800}>30min</option>
                <option value={3600}>1h</option>
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
