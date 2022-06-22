import { useEffect, useState, useRef } from "react";
import { ICoordinates } from "../../interfaces/ICoordinates";
import styles from "./Ball.module.css";
import { io, Socket } from "socket.io-client";

const INITIAL_VELOCITY = 0.035;

const Ball = ({
  updateScore,
  gameSocket,
}: {
  updateScore: (winner: string) => void;
  gameSocket: Socket;
}) => {
  const [ballPosition, setBallPosition] = useState<ICoordinates>({
    x: 50,
    y: 50,
  });

  let ballDirection = useRef<ICoordinates>({ x: 0.75, y: 0.5 });
  let ballVelocity = INITIAL_VELOCITY;

  const ballRadiusWidthRatio = window.innerHeight / window.innerWidth;
  const ballRadiusHeightRatio = window.innerHeight / window.innerHeight;

  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  function randomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const resetBall = () => {
    setBallPosition({ x: 50, y: randomNumberBetween(10, 90) });
    ballDirection.current.x = 0;
    while (
      Math.abs(ballDirection.current.x) <= 0.2 ||
      Math.abs(ballDirection.current.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      ballDirection.current = { x: Math.cos(heading), y: Math.sin(heading) };
    }
  };

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
    let playerRect = document
      .getElementById("player-paddle")
      ?.getBoundingClientRect() as DOMRect;
    let opponentRect = document
      .getElementById("opponent-paddle")
      ?.getBoundingClientRect() as DOMRect;

    let paddleBorderRatio = (playerRect.right / window.innerWidth) * 100;

    let currentPaddle =
      ballRect.x < window.innerWidth / 2 ? playerRect : opponentRect;

    if (ballRect?.bottom > window.innerHeight) {
      ballDirection.current.y *= -1;
      setBallPosition((prevState) => ({
        x: prevState.x,
        y: 100 - ballRadiusHeightRatio,
      }));
    } else if (ballRect?.top < 0) {
      ballDirection.current.y *= -1;
      setBallPosition((prevState) => ({
        x: prevState.x,
        y: ballRadiusHeightRatio,
      }));
    } else if (paddleCollision(currentPaddle, ballRect)) {
      let direction = ballRect.x < window.innerWidth / 2 ? 1 : -1;

      let collidePoint =
        ballRect.y - (currentPaddle.y + currentPaddle.height / 2);
      collidePoint /= currentPaddle.height / 2;

      let angleRad = (collidePoint * Math.PI) / 4;

      ballDirection.current.x = direction * Math.cos(angleRad);
      ballDirection.current.y = Math.sin(angleRad);

      if (currentPaddle === playerRect)
        setBallPosition((prevState) => ({
          x: paddleBorderRatio + ballRadiusWidthRatio,
          y: prevState.y,
        }));
      else
        setBallPosition((prevState) => ({
          x: 100 - paddleBorderRatio - ballRadiusWidthRatio,
          y: prevState.y,
        }));
    } else if (ballRect?.left <= 0) {
      updateScore("opponent");
      resetBall();
      ballDirection.current.x = Math.abs(ballDirection.current.x);
      ballDirection.current.x *= -1;
    } else if (ballRect?.right >= window.innerWidth) {
      updateScore("player");
      resetBall();
      ballDirection.current.x = Math.abs(ballDirection.current.x);
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
    document.body.style.overflow = "hidden";
    resetBall();
    gameSocket.emit("game:ball", "test ball");
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once

  useEffect(() => {
    const ballElem = document.getElementById("ball") as HTMLElement;
    ballElem.style.setProperty("--x", ballPosition.x.toString());
    ballElem.style.setProperty("--y", ballPosition.y.toString());
  });

  return <div className={styles.ball} id="ball"></div>;
};

export default Ball;
