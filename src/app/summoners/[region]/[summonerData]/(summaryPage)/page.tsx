import SummonerRank from './_summonerRank/SummonerRank';
import SummonerChampionsMastery from '../_components/summonerChampionsMastery/SummonerChampionsMastery';
import { QueueType } from '@/app/_enums/enums';
import SummonerMatchOverview from './_summonerMatchOverview/SummonerMatchOverview';

const Page = () => {
  return (
    <>
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
          <SummonerChampionsMastery getTopChampions />
        </div>
        <SummonerMatchOverview />
      </div>
    </>
  );
}

export default Page;