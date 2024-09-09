import QueueTypes from './QueueTypes';
import SummonerRank from './_summonerRank/SummonerRank';
import SummonerChampionsMastery from '@/app/_components/summonerChampionsMastery/SummonerChampionsMastery';
import SummonerLiveGame from '@/app/_components/liveGame/summonerLiveGame/SummonerLiveGame';

const Page = () => {
  return (
    <>
      <SummonerLiveGame />
      <QueueTypes />
      <div className='mt-2'>
        <div className='w-[332px]'>
          <SummonerRank
            queueType={'RANKED_SOLO_5x5'}
            smallDataStyle={false}
          />
          <SummonerRank
            queueType={'RANKED_FLEX_SR'}
            smallDataStyle
          />
          <SummonerChampionsMastery />
        </div>
      </div>
    </>
  );
}

export default Page;