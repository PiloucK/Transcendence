import { Button } from "@mui/material";
import { useErrorContext } from "../../context/ErrorContext";
import { useSocketContext } from "../../context/SocketContext";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import matchService from "../../services/match";

export const AddMatchField = () => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  const addMatch = () => {
    matchService
      .createMatch(
        "coucou",
        Math.floor(Math.random() * 6),
        Math.floor(Math.random() * 6)
      )
      .then(() => {
        socketContext.socket.emit("user:update-elo");
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };

  return (
    <Button
      sx={{ left: "5%", background: "#ffff00" }}
      variant="outlined"
      onClick={addMatch}
    >
      add match
    </Button>
  );
};
