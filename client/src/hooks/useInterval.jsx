import { useEffect, useRef } from "react";

// Thsis section is mostly copied from video on youtube: https://www.youtube.com/watch?v=UuzcvFVH4DQ&t=410s
// Very helpful explaining creating a Tetris clone in React^

function useInterval(callback, delay) {
  // initialize reference to callback
  // For this application the call back keys on isPlaying which is set to false at firstso the call back does nothing
  const callbackRef = useRef(callback);

  // dependencies: callback
  // Once isPlaying is updated to true the callback will be updated so need update ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // dependencies: delay
  // When delay is changed then setup new interval to run with that new delay
  useEffect(() => {
    if (delay == null) {
      return;
    }

    // Setup interval (i.e., run this pointer function after each delay time)
    const intervalID = setInterval(() => {
      callbackRef.current();
    }, delay);

    // Return cleanup function so interval can be cleared wheneber delay is updated
    return () => clearInterval(intervalID);
  }, [delay]);
}

export default useInterval;
