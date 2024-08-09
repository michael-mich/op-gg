import SummonerQueueTypes from './SummonerQueueTypes';
import SummonerRank from './_summonerRank/SummonerRank';

const Page = () => {
  return (
    <>
      <SummonerQueueTypes />
      <div className='mt-2'>
        <div className='w-[332px]'>
          <SummonerRank />
        </div>
      </div>
    </>
  );
}

export default Page;