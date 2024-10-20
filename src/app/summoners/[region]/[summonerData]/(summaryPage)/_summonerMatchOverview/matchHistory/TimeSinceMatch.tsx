import type { TDetailedMatchHistory } from '@/app/_types/serverActions/serverActions';

type Props = {
  match: TDetailedMatchHistory;
}

const TimeSinceMatch = ({ match }: Props) => {
  const gameEndedDate = new Date(match.info.gameEndTimestamp)

  const gameEndedDateMiliseconds = gameEndedDate.valueOf();
  const currentDateMiliseconds = new Date().valueOf();

  const differenceInMilliseconds = currentDateMiliseconds - gameEndedDateMiliseconds;

  const minutesDiffrence = Math.floor(differenceInMilliseconds / 60000);
  const hoursDifference = Math.floor(minutesDiffrence / 60);
  const daysDifference = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  const monthsDifference = Math.floor(daysDifference / 30);

  const formatTimeSinceMatch = (): string => {
    if (minutesDiffrence < 60) {
      return `${minutesDiffrence > 1 ? `${minutesDiffrence} minutes` : 'a minute'}`;
    }
    else if (hoursDifference < 24) {
      return `${hoursDifference > 1 ? `${hoursDifference} hours` : 'an hour'}`;
    }
    else if (daysDifference <= 30) {
      return `${daysDifference} ${daysDifference > 1 ? 'days' : 'day'}`;
    }
    else {
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