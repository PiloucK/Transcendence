import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";
import React, { useEffect, useRef, useState } from 'react';
import { DockGuest } from "../components/Dock/DockGuest";
import userService from "../services/user";

import { errorHandler } from "../errors/errorHandler";

import { useErrorContext } from "../context/ErrorContext";
import { ICoordinates } from "../interfaces/ICoordinates";
import dynamic from "next/dynamic";
import Ball from "../components/Game/Ball";
import PlayerPaddle from "../components/Game/PlayerPaddle";
import OpponentPaddle from "../components/Game/OpponentPaddle";
import Score  from "../components/Game/Score";
import { useSocketContext } from "../context/SocketContext";


const INITIAL_VELOCITY = 0.055;


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
    document.body.style.overflow = "hidden";
    resetBall();
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once

  return (
    <>
        <div className={styles.mainLayout_left_background} />
        <div className={styles.mainLayout_right_background} />
        <Score player={playerScore.current} opponent={opponentScore.current}/>
        <Ball ball={ballPosition}/>
        <PlayerPaddle/>
        <OpponentPaddle ballDirection={ballDirection.current}/>
    </>
  );
};



export default dynamic(() => Promise.resolve(Pong), {
  ssr: false
})