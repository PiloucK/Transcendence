import { useEffect, useState } from "react";

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

export default OpponentPaddle;
