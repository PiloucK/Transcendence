import { useEffect, useRef, useState } from "react";
import styles from './PaddleRight.module.css'
import { ICoordinates } from "../../interfaces/ICoordinates";


const ComputerPaddle = ({computerLvl} : {computerLvl : number}) => {
 
  const paddlePosition = useRef(50);

  const movePaddle = useRef(true);

  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  let prevBallX = useRef(0);

  function randomNumberBetween(min : number, max : number) {
    return Math.random() * (max - min) + min;
  }


  function computerPlaying() {
    
    
    const ballRect = document.getElementById("ball")?.getBoundingClientRect() as DOMRect;
    const ballX = ballRect.x / window.innerHeight * 100;
    const ballY = ballRect.y / window.innerHeight * 100;
  
      
    if (ballRect.x >= window.innerWidth / 4 && prevBallX.current < ballX) {
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

    prevBallX.current = ballX;
  }

  const animate : FrameRequestCallback = (time : number)  => {

    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;

    computerPlaying();
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
    }
  }
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
  
    return (
      <div className={styles.paddleRight} id="opponent-paddle"></div>
    );
};

export default ComputerPaddle;
