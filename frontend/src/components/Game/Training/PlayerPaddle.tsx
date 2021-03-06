import { useEffect, useState } from "react";
import styles from '../PaddleLeft.module.css'


const PlayerPaddle = (  ) => {
    const [playerPosition, setPlayerPosition] = useState(50);
  
    useEffect(() => {
      document.addEventListener("mousemove", e => {
        setPlayerPosition((e.y / window.innerHeight) * 100)
      })
	  return () => {
		window.removeEventListener("mousemove", () => {});
	  };
    }, []);
  
    useEffect(() => {
      const paddleElem = document.getElementById("player-paddle") as HTMLElement;
      paddleElem.style.setProperty("--position", playerPosition.toString());
    });

    return (
      <div className={styles.paddleLeft} id="player-paddle"></div>
    );
 };

export default PlayerPaddle;