import { useEffect, useState } from "react";
import styles from './OpponentPaddle.module.css'
import { ICoordinates } from "../../interfaces/ICoordinates";

const OpponentPaddle = ({ballDirection} : {ballDirection : ICoordinates}) => {



    useEffect(() => {
      let ballRect = document.getElementById("ball")?.getBoundingClientRect() as DOMRect;
      
      if (ballRect.x >= window.innerWidth / 2 && ballDirection.x > 0) {
        const paddleElem = document.getElementById("opponent-paddle") as HTMLElement;
        let position =  Number(paddleElem.style.getPropertyValue("--position"))

        if (position < ballRect.y / window.innerHeight * 100)
          position++;
        else
          position--;

        paddleElem.style.setProperty("--position", position.toString());
      }
    });
  
    return (
      <div className={styles.paddleRight} id="opponent-paddle"></div>
    );
};

export default OpponentPaddle;
