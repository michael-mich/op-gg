import QueueTypes from './QueueTypes';
import SummonerRank from './_summonerRank/SummonerRank';
import SummonerChampionsMastery from '@/app/_components/summonerChampionsMastery/SummonerChampionsMastery';
import { QueueType } from '@/app/_enums/enums';

const Page = () => {
  return (
    <>
      <QueueTypes />
      <div className='mt-2'>
        <div className='w-[332px]'>
          <SummonerRank
            queueType={QueueType.RankedSolo}
            smallDataStyle={false}
          />
          <SummonerRank
            queueType={QueueType.RankedFlex}
            smallDataStyle
          />
          <SummonerChampionsMastery />
        </div>
      </div>
    </>
  );
}

export default Page;