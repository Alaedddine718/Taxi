import { useEffect, useState } from "react";

/**
 * useClock
 * @param {"real" | "simulado"} mode
 * @param {number} speedFactor   ej: 60 => 1s real = 60s simulados
 */
export function useClock({ mode = "simulado", speedFactor = 60 } = {}) {
  const [state, setState] = useState(() => {
    if (mode === "real") {
      const now = new Date();
      return { now, simulatedSeconds: 0 };
    } else {
      return { now: null, simulatedSeconds: 0 };
    }
  });

  useEffect(() => {
    let startReal = Date.now();

    const interval = setInterval(() => {
      if (mode === "real") {
        setState({ now: new Date(), simulatedSeconds: 0 });
      } else {
        const nowReal = Date.now();
        const deltaRealSeconds = (nowReal - startReal) / 1000;
        startReal = nowReal;

        setState((prev) => ({
          now: null,
          simulatedSeconds: prev.simulatedSeconds + deltaRealSeconds * speedFactor,
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, speedFactor]);

  if (mode === "real") {
    const { now } = state;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const pad = (n) => String(n).padStart(2, "0");

    const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const formattedLabel = `${pad(day)}/${pad(month)}/${year} – ${formattedTime}`;

    const secondsOfDay = hours * 3600 + minutes * 60 + seconds;
    const percentageOfDay = (secondsOfDay / 86400) * 100;

    return {
      mode,
      day,
      hours,
      minutes,
      seconds,
      formattedTime,
      formattedLabel,
      percentageOfDay,
    };
  } else {
    const { simulatedSeconds } = state;
    const totalSeconds = Math.floor(simulatedSeconds);
    const secondsPerDay = 24 * 60 * 60;

    const dayIndex = Math.floor(totalSeconds / secondsPerDay);
    const day = dayIndex + 1;

    const secondsOfDay = totalSeconds % secondsPerDay;
    const hours = Math.floor(secondsOfDay / 3600);
    const minutes = Math.floor((secondsOfDay % 3600) / 60);
    const seconds = secondsOfDay % 60;
    const pad = (n) => String(n).padStart(2, "0");

    const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    const formattedLabel = `Día simulado ${day} – ${formattedTime}`;
    const percentageOfDay = (secondsOfDay / secondsPerDay) * 100;

    return {
      mode,
      day,
      hours,
      minutes,
      seconds,
      formattedTime,
      formattedLabel,
      percentageOfDay,
    };
  }
}
