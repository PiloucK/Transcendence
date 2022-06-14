import { Dialog } from "@mui/material"
import { useLoginContext } from "../../context/LoginContext";

export const SecondFactorLogin = () => {
  const loginContext = useLoginContext()

  return <Dialog open={loginContext.secondFactorLogin}></Dialog>
}