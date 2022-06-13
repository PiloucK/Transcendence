import { useEffect, useState } from "react";

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

export default PlayerPaddle;