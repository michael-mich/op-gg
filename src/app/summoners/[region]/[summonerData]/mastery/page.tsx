import SummonerChampionsMasterySummary from './SummonerChampiosMasterySummary';
import SummonerChampionsMastery from '@/app/_components/summonerChampionsMastery/SummonerChampionsMastery';

const Page = () => {
  return (
    <>
      <SummonerChampionsMasterySummary />
      <SummonerChampionsMastery getTopChampions={false} />
    </>
  )
}

export default Page;