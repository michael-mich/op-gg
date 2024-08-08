import SummonerQueueTypes from './SummonerQueueTypes';
import SummonerRank from './SummonerRank';

const Page = () => {
  return (
    <>
      <SummonerQueueTypes />
      <div>
        <div>
          <SummonerRank />
        </div>
      </div>
    </>
  );
}

export default Page;