import { useEffect, useState } from 'react';
import { calculateTimeUnit } from '@/app/_lib/utils/utils';
import { TimeUnit } from '@/app/_enums/enums';

type Props = {
  gameLength: number | undefined;
}

const GameTimer = ({ gameLength }: Props) => {
  const initialMinutes = calculateTimeUnit(gameLength, TimeUnit.Minutes);
  const initialSeconds = calculateTimeUnit(gameLength, TimeUnit.Seconds);
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