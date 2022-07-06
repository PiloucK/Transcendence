import { useEffect, useState, useRef, MutableRefObject } from "react";
import styles from "../Ball.module.css";
import { Socket } from "socket.io-client";
import { IBallInfo } from "../../../interfaces/IBallInfo";
import { useSessionContext } from "../../../context/SessionContext";

const Ball = ({
  gameSocket,
  gameID,
}: {
  gameSocket: Socket;
  gameID: string;
}) => {
  const [ballInfo, setBallInfo] = useState<IBallInfo>({
    position: { x: 50, y: 50 },
    direction: { x: 0, y: 0 },
  });
  const ballElem = useRef<HTMLElement | null>(null);
  const sessionContext = useSessionContext();

  // const ballCountered = (
  //   paddle: DOMRect,
  //   ball: DOMRect,
  //   ballUpdate: IBallInfo
  // ) => {
    // const widthFactor = 100 / window.innerWidth;
    // const heightFactor = 100 / window.innerHeight;
    // if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    //   ballUpdate.position.x = padVector.downPoint.x + t * substracts.pad.x;
    //   ballUpdate.position.y = padVector.downPoint.y + t * substracts.pad.y;
    //   setBallInfo(ballUpdate);
    //   return true;
    // }
    // setBallInfo(ballUpdate);
    // return false;
    // if (paddle.right >= ball.left &&
    // paddle.top <= ball.bottom &&
    // paddle.bottom >= ball.top) {
    //   setBallInfo(ballUpdate);
    //  return true;
    // }
  // };

  // const pointLost = (ballInfo: IBallInfo) => {
  //   if (ballInfo.position.x - 1 <= 0 && isPointLost.current === false) {
  //     isPointLost.current = true;
  //     gameSocket.emit(
  //       "game:point-lost",
  //       gameID,
  //       sessionContext.userSelf.login42
  //     );
  //   }
  // };

  // const paddleCollision = (ballUpdate: IBallInfo) => {
  //   const ball = document
  //     .getElementById("ball")
  //     ?.getBoundingClientRect() as DOMRect;
  //   const playerPaddle = document
  //     .getElementById("player-paddle")
  //     ?.getBoundingClientRect() as DOMRect;

    // if (ball === undefined || playerPaddle === undefined) return false;

    // if (ballCountered(playerPaddle, ball, ballUpdate)) {
    //   let collidePoint = ball.y - (playerPaddle.y + playerPaddle.height / 2);
    //   collidePoint /= playerPaddle.height / 2;

    //   const angleRad = (collidePoint * Math.PI) / 4;

  //     gameSocket.emit(
  //       "game:ballCountered",
  //       angleRad,
  //       gameID,
  //       sessionContext.userSelf.login42
  //     );
      // return true;
  //   }
    // return false;
  // };

  useEffect(() => {
    if (ballElem.current === null) {
      ballElem.current = document.getElementById("ball");
      gameSocket.on(
        "game:ball-update",
        (ballUpdate: IBallInfo, player2: string) => {
          if (player2 === sessionContext.userSelf.login42) {
            ballUpdate.position.x = 100 - ballUpdate.position.x;
            ballUpdate.direction.x *= -1;
          }
          setBallInfo(ballUpdate);
          // if (!paddleCollision(ballUpdate)) pointLost(ballUpdate);
        }
      );
    }
  }, []);

  useEffect(() => {
    ballElem.current?.style.setProperty("--x", ballInfo.position.x.toString());
    ballElem.current?.style.setProperty("--y", ballInfo.position.y.toString());
  });

  return <div className={styles.ball} id="ball"></div>;
};

export default Ball;
