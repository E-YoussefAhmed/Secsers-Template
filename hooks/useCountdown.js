import React, { useState, useEffect } from "react";

export default function useCountdown() {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [minsLeft, setMinsLeft] = useState(0);
  useEffect(() => {
    let timeout;
    if (secondsLeft <= 0) {
      if (minsLeft <= 0) {
        return;
      } else {
        timeout = setTimeout(() => {
          setSecondsLeft(59);
          setMinsLeft(minsLeft - 1);
        }, 1000);
      }
    } else {
      timeout = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [secondsLeft, minsLeft]);

  function startSeconds(seconds) {
    setSecondsLeft(seconds);
  }
  function startMins(mins) {
    setMinsLeft(mins);
  }

  return { secondsLeft, minsLeft, startMins, startSeconds };
}
