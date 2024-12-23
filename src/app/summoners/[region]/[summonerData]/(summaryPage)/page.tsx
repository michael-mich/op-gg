import { QueueType } from '@/app/_enums/match';
import SummonerRank from './_summonerRank/SummonerRank';
import SummonerChampionMastery from '../_components/summonerChampionsMastery/SummonerChampionMastery';
import SummonerMatchOverview from './_summonerMatchOverview/SummonerMatchOverview';

const Page = () => {
  return (
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
        <SummonerChampionMastery getTopChampions />
      </div>
      <SummonerMatchOverview />
    </div>
  );
}

export default Page;