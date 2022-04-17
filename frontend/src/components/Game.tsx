import { useReducer, useEffect, useRef } from "react";
import { useContext } from "react";
import React from "react";
import styles from "../styles/game.module.css";

enum MovingBoxActionKind {
  start = "start",
  stop = "stop",
  reset = "reset",
  tick = "tick",
}

interface MovingBoxAction {
  type: MovingBoxActionKind;
  payload: number;
}

interface MovingBoxState {
  pos: number;
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case "start":
      return { ...state, isRunning: true };
    case "stop":
      return { ...state, isRunning: false };
    case "reset":
      return { isRunning: false, time: 0 };
    case "tick":
      return { ...state, time: state.time + 1 };
    default:
      throw new Error();
  }
}

export const Game = () => {
  // const [state, dispatch] = useReducer(reducer, initialState);
  // const idRef = useRef(0);

  // useEffect(() => {
  //   if (!state.isRunning) {
  //     return;
  //   }
  //   idRef.current = setInterval(() => dispatch({type: 'tick'}), 1000);
  //   return () => {
  //     clearInterval(idRef.current);
  //     idRef.current = 0;
  //   };
  // }, [state.isRunning]);

  return (
    <div>
      {/* {state.time}s */}
      {/* <button onClick={() => dispatch({ type: 'start' })}>
        Start
      </button>
      <button onClick={() => dispatch({ type: 'stop' })}>
        Stop
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button> */}
    </div>
  );
};
