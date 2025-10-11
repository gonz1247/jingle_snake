import { useEffect, useRef } from "react";

// Thsis section is mostly copied from video on youtube: https://www.youtube.com/watch?v=UuzcvFVH4DQ&t=410s
// Very helpful explaining creating a Tetris clone in React^

function useInterval(callback, delay) {
  const callbackRef = useRef(callback);

  // dependencies: callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // dependencies: delay
  useEffect(() => {
    if (delay == null) {
      return;
    }

    // Setup interval
    const intervalID = setInterval(() => {
      callbackRef.current();
    }, delay);

    // Return cleanup function
    return () => clearInterval(intervalID);
  }, [delay]);
}

export default useInterval;
