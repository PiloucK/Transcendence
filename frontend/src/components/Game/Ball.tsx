import { useEffect, useState, useRef } from "react";
import { ICoordinates } from "../../interfaces/ICoordinates";
import styles from "./Ball.module.css";
import { io, Socket } from "socket.io-client";
import { IBallStartInfo } from "../../interfaces/IBallStartInfo";

const INITIAL_VELOCITY = 0.035;

const Ball = ({
  ballStartPos,
  gameSocket,
  gameID,
  player1,
}: {
  ballStartPos: IBallStartInfo;
  gameSocket: Socket;
  gameID: string;
  player1: string;
}) => {
  const [ballPosition, setBallPosition] = useState<ICoordinates>({
    x: 50,
    y: ballStartPos.position?.y,
  });

  const firstRender = useRef(true);

  let ballDirection = useRef<ICoordinates>(ballStartPos.direction);
  let ballVelocity = INITIAL_VELOCITY;

  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  const paddleCollision = (paddle: DOMRect, ball: DOMRect) => {
    return (
      paddle.left <= ball.right &&
      paddle.right >= ball.left &&
      paddle.top <= ball.bottom &&
      paddle.bottom >= ball.top
    );
  };

  const handleCollision = () => {
    let ballRect = document
      .getElementById("ball")
      ?.getBoundingClientRect() as DOMRect;
    let playerPaddle = document
      .getElementById("player-paddle")
      ?.getBoundingClientRect() as DOMRect;

    let paddleBorderRatio = (playerPaddle.right / window.innerWidth) * 100;
    // console.log("borderRatio", paddleBorderRatio, playerPaddle.right, window.innerWidth, ballRect.left);
    

    const ballRadiusWidthRatio = window.innerHeight / window.innerWidth;
    // const ballRadiusHeightRatio = window.innerHeight / window.innerHeight;

    if (ballRect?.bottom > window.innerHeight) {
      ballDirection.current.y *= -1;
      setBallPosition((prevState) => ({
        x: prevState.x,
        y: 100 - 1,
      }));
    } else if (ballRect?.top < 0) {
      ballDirection.current.y *= -1;
      setBallPosition((prevState) => ({
        x: prevState.x,
        y: 1,
      }));
    } else if (paddleCollision(playerPaddle, ballRect)) {
      let collidePoint =
        ballRect.y - (playerPaddle.y + playerPaddle.height / 2);
      collidePoint /= playerPaddle.height / 2;

      let angleRad = (collidePoint * Math.PI) / 4;

      ballDirection.current.x = Math.cos(angleRad);
      ballDirection.current.y = Math.sin(angleRad);

      setBallPosition((prevState) => ({
        x: paddleBorderRatio + ballRadiusWidthRatio,
        y: prevState.y,
      }));

      gameSocket.emit(
        "game:ballCountered",
        angleRad,
        ballPosition.x,
        ballPosition.y,
        gameID,
        player1,
      );

    } else if (ballRect?.left <= 0) {
      // updateScore("opponent");
      gameSocket.emit("game:point-lost", gameID, player1);
      //   resetBall();
      //   ballDirection.current.x = Math.abs(ballDirection.current.x);
      //   ballDirection.current.x *= -1;
      // } else if (ballRect?.right >= window.innerWidth) {
      //   updateScore("player");
      //   resetBall();
      //   ballDirection.current.x = Math.abs(ballDirection.current.x);
    }
  };

  const animate: FrameRequestCallback = (time: number) => {
    if (previousTimeRef.current != 0) {
      const deltaTime = time - previousTimeRef.current;
      handleCollision();

      setBallPosition((prevState) => ({
        x: prevState.x + ballDirection.current.x * ballVelocity * deltaTime,
        y: prevState.y + ballDirection.current.y * ballVelocity * deltaTime,
      }));
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (firstRender.current === true) {
      document.body.style.overflow = "hidden";

      // console.log("player=", player, "player2= ", player2);
      firstRender.current = false;
    }
      requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once

  useEffect(() => {
    ballDirection.current = ballStartPos.direction;
    if (ballPosition.x !== 50) {
      setBallPosition((prevState) => ({
        x: prevState.x,
        y: ballStartPos.position?.y,
      }));
    }
  }, [ballStartPos]);

  useEffect(() => {
    const ballElem = document.getElementById("ball") as HTMLElement;
    ballElem.style.setProperty("--x", ballPosition.x.toString());
    ballElem.style.setProperty("--y", ballPosition.y?.toString());
  });

  return <div className={styles.ball} id="ball"></div>;
};

export default Ball;
