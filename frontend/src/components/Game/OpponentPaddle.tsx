import { useEffect, useRef, useState } from "react";
import styles from './PaddleRight.module.css'
import { io, Socket } from "socket.io-client";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();


const OpponentPaddle = () => {
 
  const paddlePosition = useRef(50);

    return (
      <div className={styles.paddleRight} id="opponent-paddle"></div>
    );
};

export default OpponentPaddle;
