import styles from "../../styles/Home.module.css";
import { Button, CircularProgress } from "@mui/material";
import { useSessionContext } from "../../context/SessionContext";
import { useSocketContext } from "../../context/SocketContext";

export const Queue = () => {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();

  function leaveQueue() {
    socketContext.socket.emit(
      "user:leave-queue",
      sessionContext.userSelf.login42
    );
  }

  return (
    <>
      <div className={styles.queue_circular_progress}>
        <CircularProgress color="inherit" size="150px" />
      </div>
      <Button
        onClick={leaveQueue}
        variant="contained"
        className={styles.queue_cancel_button}
      >
        Cancel
      </Button>
    </>
  );
};
