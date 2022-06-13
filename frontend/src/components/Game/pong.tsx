import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";
import React, { useEffect, useRef, useState } from 'react';
import { DockGuest } from "../components/Dock/DockGuest";
import userService from "../services/user";

import io from "socket.io-client";

import { errorHandler } from "../errors/errorHandler";

import getConfig from "next/config";
import { useErrorContext } from "../context/ErrorContext";
import { ICoordinates } from "../interfaces/ICoordinates";
const { publicRuntimeConfig } = getConfig();
const socket = io(
  `http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.WEBSOCKETS_PORT}`,
  { transports: ["websocket"] }
);




const INITIAL_VELOCITY = 0.055;

const PlayerPaddle = (  ) => {
  const [playerPosition, setPlayerPosition] = useState(50);

  useEffect(() => {
    document.addEventListener("mousemove", e => {
      setPlayerPosition((e.y / window.innerHeight) * 100)
    })
  }, []);

  useEffect(() => {
    const paddleElem = document.getElementById("player-paddle") as HTMLElement;
    paddleElem.style.setProperty("--position", playerPosition.toString());
  });

  return (
    <div className="paddle left" id="player-paddle"></div>
  );
};

const OpponentPaddle = () => {
  const [opponentPosition, setOpponentPosition] = useState(50);

  useEffect(() => {
    document.addEventListener("mousemove", e => {
      setOpponentPosition((e.y / window.innerHeight) * 100)
    })
  }, []);

  useEffect(() => {
    const paddleElem = document.getElementById("opponent-paddle") as HTMLElement;
    paddleElem.style.setProperty("--position", opponentPosition.toString());
  });

  return (
    <div className="paddle right" id="opponent-paddle"></div>
  );
};

const Ball = ({ ball } : { ball : ICoordinates}) => {

    useEffect(() => {      
      const ballElem = document.getElementById("ball") as HTMLElement;
      ballElem.style.setProperty("--x", ball.x.toString());
      ballElem.style.setProperty("--y", ball.y.toString());
    });

  return (
    <div className="ball" id="ball"></div>
  );
};

const PlayerScore = ({score} : {score : number}) => {
  return (
    <div id="player-score">{score}</div>
  );
};

const OpponentScore = ({score} : {score : number}) => {
  return (
    <div id="opponent-score">{score}</div>
  );
};

const Scores = ({player, opponent} : {player : number, opponent : number}) => {
  return (
    <div className="score">
      <PlayerScore score={player}/>
      <OpponentScore score={opponent}/>
    </div>
  );
};

const Pong = () => {
  const [ballPosition, setBallPosition] = useState<ICoordinates>({x: 50, y: 50});
  
  let playerScore = useRef(0);
  let opponentScore = useRef(0);
  
  let ballDirection = useRef<ICoordinates>({x: 0.75, y: 0.5});
  let ballVelocity = INITIAL_VELOCITY;

  const ballRadiusWidthRatio = window.innerHeight / window.innerWidth;
  const ballRadiusHeightRatio = window.innerHeight / window.innerHeight;

  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  function randomNumberBetween(min : number, max : number) {
    return Math.random() * (max - min) + min;
  }

  const resetBall = () => {
    setBallPosition({x: 50, y: 50});
    ballDirection.current.x =  0;
    while (Math.abs(ballDirection.current.x) <= 0.2 || Math.abs(ballDirection.current.x) >= 0.9) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      ballDirection.current = {x: Math.cos(heading), y: Math.sin(heading)};
    }
  }

  const paddleCollision = (paddle : DOMRect, ball : DOMRect) => {
    return (
        paddle.left <= ball.right &&
        paddle.right >= ball.left &&
        paddle.top <= ball.bottom &&
        paddle.bottom >= ball.top
    )
  }

  const updateScore = (ballRect: DOMRect) => {
    if (ballRect?.left <= 0)
      opponentScore.current++;
    else if (ballRect?.right >= window.innerWidth)
      playerScore.current++;
  }

  const handleCollision = () => {
    let ballRect = document.getElementById("ball")?.getBoundingClientRect() as DOMRect;

    let playerRect = document.getElementById("player-paddle")?.getBoundingClientRect() as DOMRect;
    let opponentRect = document.getElementById("opponent-paddle")?.getBoundingClientRect() as DOMRect;

    let paddleBorderRatio = playerRect.right / window.innerWidth * 100;

    let currentPaddle = ballRect.x < window.innerWidth / 2 ? playerRect : opponentRect;

    if (ballRect?.bottom > window.innerHeight) {
      ballDirection.current.y *= -1
      setBallPosition(prevState => ({x: prevState.x, y: 100 - ballRadiusHeightRatio}))
    }
    else if (ballRect?.top < 0) {
      ballDirection.current.y *= -1
      setBallPosition(prevState => ({x: prevState.x, y: ballRadiusHeightRatio}))
    }
    else if (paddleCollision(currentPaddle, ballRect)) {

      ballDirection.current.x *= -1;

      if (currentPaddle === playerRect)
        setBallPosition(prevState => ({x: paddleBorderRatio + ballRadiusWidthRatio, y: prevState.y}))
      else 
        setBallPosition(prevState => ({x: 100 - paddleBorderRatio - ballRadiusWidthRatio, y: prevState.y}))

    }
    else if (ballRect?.left <= 0 || ballRect?.right >= window.innerWidth) {
      updateScore(ballRect);
      resetBall();
    }
  }


  const animate : FrameRequestCallback = (time : number)  => {
    if (previousTimeRef.current != 0) {
      const deltaTime = time - previousTimeRef.current;
      handleCollision();

      setBallPosition(prevState => ({
          x : prevState.x + ballDirection.current.x * ballVelocity * deltaTime,
          y : prevState.y + ballDirection.current.y * ballVelocity * deltaTime
      }));
      
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }
  
  useEffect(() => {
    resetBall();
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once


  return (
    <div className="game">
        <Scores player={playerScore.current} opponent={opponentScore.current}/>
        <Ball ball={ballPosition}/>
        <PlayerPaddle/>
        <OpponentPaddle/>

    </div>
  );
};
