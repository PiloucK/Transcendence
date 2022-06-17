import { useEffect, useState } from "react";
import styles from './PaddleLeft.module.css'

const moveSpeed = 0.0085;

const useKeyPress = (targetKey : string) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key } : {key : string}) => {
    if (key === targetKey) setKeyPressed(true);
  };

  const upHandler = ({ key } : {key : string}) => {
    if (key === targetKey) setKeyPressed(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    console.log('lol');
    
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
};


const PlayerPaddle = (  ) => {
    const [playerPosition, setPlayerPosition] = useState(50);
  
    useEffect(() => {
      // document.addEventListener("mousemove", e => {
      //   setPlayerPosition((e.y / window.innerHeight) * 100)
      // })

      // document.addEventListener("keydown", function (event) {
      //   if (event.defaultPrevented) {
      //     return; // Ne devrait rien faire si l'événement de la touche était déjà consommé.
      //   }
      
      //   switch (event.key) {
      //     case "ArrowDown":
      //       setPlayerPosition(prevState => {
      //         if (prevState < 100)
      //           return (prevState + moveSpeed);
      //         else if (prevState + moveSpeed > 100)
      //           return (100);
      //         else
      //           return (prevState);              
      //       });
      //       break;
      //     case "ArrowUp":
      //       setPlayerPosition(prevState => {
      //         if (prevState > 0)
      //           return (prevState - moveSpeed);
      //         else if (prevState - moveSpeed < 100)
      //           return (0);
      //         else
      //           return (prevState);              
      //       });
      //       break;
      //     case "Escape":
      //       // Faire quelque chose pour la touche "esc" pressée.
      //       break;
      //     default:
      //       return; // Quitter lorsque cela ne gère pas l'événement touche.
      //   }
      
      //   event.preventDefault();
      // }, true);
    
    }, []);

    const upPressed = useKeyPress('ArrowUp');
    const downPressed = useKeyPress('ArrowDown')

    
  
    useEffect(() => {

      if (upPressed) {
                    setPlayerPosition(prevState => {
              if (prevState > 0)
                return (prevState - moveSpeed);
              else if (prevState - moveSpeed < 100)
                return (0);
              else
                return (prevState);              
            });
      }
      else if (downPressed) {
                    setPlayerPosition(prevState => {
              if (prevState < 100)
                return (prevState + moveSpeed);
              else if (prevState + moveSpeed > 100)
                return (100);
              else
                return (prevState);              
            });
      }

      const paddleElem = document.getElementById("player-paddle") as HTMLElement;
      paddleElem.style.setProperty("--position", playerPosition.toString());
      
    });

    return (
      <div className={styles.paddleLeft} id="player-paddle"></div>
    );
 };

export default PlayerPaddle;