import { useEffect, useRef, useState } from "react";
import styles from "../PaddleRight.module.css";

const computerLvl = 1; // from 1 to 3 EASY MEDIUM HARD

const ComputerPaddle = () => {
  const paddlePosition = useRef(50);

  const ballSync = useRef(false);
  const speed = 0.01 * computerLvl;

  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  let prevBallX = useRef(0);

  function computerPlaying(delta : number) {
    const ballRect = document
      .getElementById("ball")
      ?.getBoundingClientRect() as DOMRect;
    const ballX = (ballRect.x / window.innerHeight) * 100;
    const ballY = (ballRect.y / window.innerHeight) * 100;

    if (ballRect.x > window.innerWidth / (2 * computerLvl) && prevBallX.current < ballX) {
      const paddleElem = document.getElementById(
        "opponent-paddle"
      ) as HTMLElement;


      if (ballSync.current === false) {
        if (paddlePosition.current != ballY)
          paddlePosition.current +=  speed * delta * (ballY - paddlePosition.current) / 5;
		  
        if (Math.abs(ballY - paddlePosition.current) < 1) {
          ballSync.current = true;
        }
      } else if (ballSync.current === true) {
		paddlePosition.current +=  speed * delta * (ballY - paddlePosition.current);

	  }

      paddleElem.style.setProperty(
        "--position",
        paddlePosition.current.toString()
      );
    }
 else if ( prevBallX.current > ballX) {
	ballSync.current = false;
  }
    prevBallX.current = ballX;
}

  const animate: FrameRequestCallback = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const delta = time - previousTimeRef.current;
      computerPlaying(delta);
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once

  return <div className={styles.paddleRight} id="opponent-paddle"></div>;
};

export default ComputerPaddle;
