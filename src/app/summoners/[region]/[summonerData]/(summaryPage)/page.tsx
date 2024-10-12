import QueueTypes from './QueueTypes';
import SummonerRank from './_summonerRank/SummonerRank';
import SummonerChampionsMastery from '@/app/_components/summonerChampionsMastery/SummonerChampionsMastery';
import { QueueType } from '@/app/_enums/enums';
import RecentGames from './_recentGames/RecentGames';

const Page = () => {
  return (
    <>
      <QueueTypes />
      <div className='flex gap-2 mt-2'>
        <div className='flex flex-col gap-2 w-[332px] min-w-[332px]'>
          <SummonerRank
            queueType={QueueType.RankedSolo}
            smallDataStyle={false}
          />
          <SummonerRank
            queueType={QueueType.RankedFlex}
            smallDataStyle
          />
          {/* <SummonerChampionsMastery /> */}
        </div>
        <RecentGames />
      </div>
    </>
  );
}

export default Page;