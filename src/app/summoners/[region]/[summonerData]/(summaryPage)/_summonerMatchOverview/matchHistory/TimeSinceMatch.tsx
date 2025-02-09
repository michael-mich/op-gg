import { getDifferenceBetweenCurrentDate } from '@/app/_utils/utils';
import type { TMatchAndSummonerProps } from './MatchHistory';

const TimeSinceMatch = ({ match }: TMatchAndSummonerProps) => {
  const {
    monthsDifference,
    daysDifference,
    diffBetweenDateInMilliseconds
  } = getDifferenceBetweenCurrentDate(match?.info.gameEndTimestamp || 0);
  const gameEndedDate = new Date(match?.info.gameEndTimestamp || 0);

  const minutesDiffrence = Math.floor(diffBetweenDateInMilliseconds / 60000);
  const hoursDifference = Math.floor(minutesDiffrence / 60);

  const formatTimeSinceMatch = (): string => {
    if (minutesDiffrence < 60) {
      return `${minutesDiffrence > 1 ? `${minutesDiffrence} minutes` : 'a minute'}`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference > 1 ? `${hoursDifference} hours` : 'an hour'}`;
    } else if (daysDifference <= 30) {
      return `${daysDifference} ${daysDifference > 1 ? 'days' : 'day'}`;
    } else {
      return `${monthsDifference > 1 ? `${monthsDifference} months` : 'a month'}`;
    }
  }

  return (
    <time
      dateTime={`${gameEndedDate.getFullYear()}-${gameEndedDate.getMonth() + 1}-${gameEndedDate.getDate()}`}
      className='block text-xs text-lightMode-secondLighterGray dark:text-darkMode-lighterGray'
    >
      {formatTimeSinceMatch()} ago
    </time>
  );
}

export default TimeSinceMatch;