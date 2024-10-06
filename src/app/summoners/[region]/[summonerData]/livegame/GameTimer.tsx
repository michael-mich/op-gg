import { useEffect, useState } from 'react';

type Props = {
  gameLength: number | undefined;
}

enum TimeUnit {
  Minutes = 'minutes',
  Seconds = 'seconds'
}

const GameTimer = ({ gameLength }: Props) => {
  const calculateTimeUnit = (timeUnit: TimeUnit): number => {
    if (gameLength && gameLength > 0) {
      return timeUnit === TimeUnit.Minutes ? Math.floor(gameLength / 60) : Math.floor(gameLength % 60);
    }
    else {
      return 0;
    }
  }

  const initialMinutes = calculateTimeUnit(TimeUnit.Minutes);
  const initialSeconds = calculateTimeUnit(TimeUnit.Seconds);
  const [timer, setTimer] = useState({ minutes: initialMinutes, seconds: initialSeconds });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds === 59) {
          return {
            minutes: prev.minutes + 1,
            seconds: 0
          };
        }
        else {
          return {
            ...prev,
            seconds: prev.seconds + 1
          };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className='text-xs pl-2'>
      {timer.minutes}:{timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds}
    </span>
  );
}

export default GameTimer;