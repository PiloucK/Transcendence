import { useEffect, useState, useRef } from "react";
import styles from "./Ball.module.css";
import { Socket } from "socket.io-client";
import { IBallInfo } from "../../interfaces/IBallInfo";
import { useSessionContext } from "../../context/SessionContext";

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
  
	const paddleCollision = (paddle: DOMRect, ball: DOMRect) => {
	  return (
		paddle.left <= ball.right &&
		paddle.right >= ball.left &&
		paddle.top <= ball.bottom &&
		paddle.bottom >= ball.top
	  );
	};
  
	const handleCollision = () => {
	  const ballRect = document
		.getElementById("ball")
		?.getBoundingClientRect() as DOMRect;
	  const playerPaddle = document
		.getElementById("player-paddle")
		?.getBoundingClientRect() as DOMRect;
  
	  if (ballRect === undefined || playerPaddle === undefined)
		return ;
  
	  if (paddleCollision(playerPaddle, ballRect)) {
		let collidePoint =
		  ballRect.y - (playerPaddle.y + playerPaddle.height / 2);
		collidePoint /= playerPaddle.height / 2;
  
		const angleRad = (collidePoint * Math.PI) / 4;
  
		gameSocket.emit("game:ballCountered", angleRad, gameID, sessionContext.userSelf.login42);
  
	  }}
  
	useEffect(() => {
	  if (ballElem.current === null) {
		ballElem.current = document.getElementById("ball");
		gameSocket.on("game:ball-update", (ballUpdate: IBallInfo, player2 : string) => {
		  if (player2 === sessionContext.userSelf.login42) {
			  ballUpdate.position.x = 100 - ballUpdate.position.x;
			  ballUpdate.direction.x *= -1;
		  }
		  setBallInfo(ballUpdate);
		  handleCollision();
		});
  
	  }
	}, []);
  
	useEffect(() => {
	  ballElem.current?.style.setProperty("--x", ballInfo.position.x.toString());
	  ballElem.current?.style.setProperty("--y", ballInfo.position.y.toString());
	});
  
	return <div className={styles.ball} id="ball"></div>;
  };

export default Ball;
