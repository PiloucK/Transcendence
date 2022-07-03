import styles from "../../styles/Home.module.css";
import { IUserSelf, IUserSlim } from "../../interfaces/IUser";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { useSessionContext } from "../../context/SessionContext";
import { defaultSessionState } from "../../constants/defaultSessionState";
import { errorHandler } from "../../errors/errorHandler";
import { useErrorContext } from "../../context/ErrorContext";
import { AxiosError } from "axios";
import { useSocketContext } from "../../context/SocketContext";
import { ReactElement, useEffect, useState } from "react";
import invitationService from "../../services/invitation";
import { Invitation } from "../../interfaces/invitation";

function CardInviteInGame({ userInfo }: { userInfo: IUserSelf }) {
  const acceptInvitation = () => {};

  const declineInvitation = () => {};

  return (
    <div className={styles.invite_card}>
      <div className={styles.avatar}>
        <Link href={`/profile?login=${userInfo.login42}`}>
          <Avatar
            src={userInfo.image}
            alt="avatar"
            sx={{
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 80,
              cursor: "pointer",
            }}
          >
            <Avatar
              src={userInfo.photo42}
              alt="avatar"
              sx={{
                left: "50%",
                transform: "translateX(-50%)",
                width: 80,
                height: 80,
                cursor: "pointer",
              }}
            />
          </Avatar>
        </Link>
      </div>
      <div className={styles.text}>{userInfo.username}</div>
      <div className={styles.confirm} onClick={acceptInvitation}>
        Confirm
      </div>
      <div className={styles.decline} onClick={declineInvitation}>
        Decline
      </div>
    </div>
  );
}

export function GameInvitation() {
  const sessionContext = useSessionContext();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();

  useEffect(() => {
    const fetchInvitations = () => {
      if (
        sessionContext.userSelf.login42 !== defaultSessionState.userSelf.login42
      )
        invitationService
          .getForOneUser(sessionContext.userSelf.login42)
          .then((invitations) => {
            setInvitations(invitations);
          })
          .catch((error: Error | AxiosError<unknown, any>) => {
            errorContext.newError?.(errorHandler(error, sessionContext));
          });
    };
    fetchInvitations();
    socketContext.socket.on("fetch-invitations", fetchInvitations);
    return () => {
      socketContext.socket.removeListener(
        "fetch-invitations",
        fetchInvitations
      );
    };
  }, [sessionContext, socketContext, errorContext]);

  if (invitations && invitations.length !== 0) {
    return (
      <div className={styles.invite_card_box}>
        {invitations.map((invitation) => (
          <CardInviteInGame
            key={invitation.id}
            userInfo={invitation.inviter}
          />
        ))}
      </div>
    );
  } else {
    return null;
  }
}
