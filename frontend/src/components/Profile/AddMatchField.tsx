import { Button } from "@mui/material";
import { useErrorContext } from "../../context/ErrorContext";
import { useSessionContext } from "../../context/SessionContext";
import { errorHandler } from "../../errors/errorHandler";
import matchService from "../../services/match";

export const AddMatchField = () => {
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const addMatch = () => {
    matchService.createMatch("coucou", 3, 8).catch((error) => {
      errorContext.newError?.(errorHandler(error, sessionContext));
    });
  };

  return <Button variant="outlined" onClick={addMatch}>add match</Button>;
};
