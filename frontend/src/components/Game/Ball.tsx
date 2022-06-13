import { useEffect } from "react";
import { ICoordinates } from "../../interfaces/ICoordinates";

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

export default Ball;