import { useParams } from 'next/navigation';
import type { TSummonerPageParams } from '@/app/_types/types';

const SummonerInactive = () => {
  const params = useParams<TSummonerPageParams>()
  const formattedSummonerData = params.summonerData.split('-').join('#');

  return (
    <>
      <h3 className='font-bold text-xl text-center'>
        `{formattedSummonerData}` is not in an active game.
      </h3>
      <p className='text-sm text-center dark:text-darkMode-lighterGray my-2.5'>
        Please try again later if the summoner is currently in game.
      </p>
      <p className='text-sm text-center dark:text-darkMode-lighterGray'>
        (Live Game data for 'Bot' cannot be retrieved from Riot's official API.)
      </p>
    </>
  );
}

export default SummonerInactive;