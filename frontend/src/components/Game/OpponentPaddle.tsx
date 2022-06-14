import { useEffect, useRef, useState } from "react";
import styles from './OpponentPaddle.module.css'
import { ICoordinates } from "../../interfaces/ICoordinates";


const computerLvl = 3; // peut aller de 1 a 3 EASY MEDIUM HARD

const OpponentPaddle = ({ballDirection} : {ballDirection : ICoordinates}) => {
  
  const paddlePosition = useRef(50);

  const movePaddle = useRef(true);

  function randomNumberBetween(min : number, max : number) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    
    let ballRect = document.getElementById("ball")?.getBoundingClientRect() as DOMRect;
      
    if (ballRect.x >= window.innerWidth / 4 && ballDirection.x > 0) {
      const paddleElem = document.getElementById("opponent-paddle") as HTMLElement;
      const ballY = ballRect.y / window.innerHeight * 100;

      // if the ball is out of range
      if (paddlePosition.current - randomNumberBetween(5, 20 - computerLvl * 5) > ballY || paddlePosition.current + randomNumberBetween(5, 25 - computerLvl * 5) < ballY)
        movePaddle.current = true;

      if (movePaddle.current) {

        if (paddlePosition.current < ballY)
          paddlePosition.current++;
        else if (paddlePosition.current > ballY)
          paddlePosition.current--;
        
        // if ball Y position is aligned with paddle Y
        if (Math.abs(ballY - paddlePosition.current) < 1)
          movePaddle.current = false;
      }

      paddleElem.style.setProperty("--position", paddlePosition.current.toString());
    }
  });
  
    return (
      <div className={styles.paddleRight} id="opponent-paddle"></div>
    );
};

export default OpponentPaddle;
