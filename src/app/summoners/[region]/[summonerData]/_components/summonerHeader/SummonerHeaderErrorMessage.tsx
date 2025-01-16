import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SummonerHeaderErrorMessage = () => {
  const router = useRouter();

  return (
    <div className='text-center'>
      <Image
        className='size-40 m-auto'
        src='/no-data/jinx-error.svg'
        width={160}
        height={160}
        alt=''
      />
      <p className='-mt-4 mb-2'>
        An error occurred while fetching summoner data!
      </p>
      <button
        onClick={router.refresh}
        className='text-white bg-blue text-sm rounded py-0.5 px-2'
      >
        Try again
      </button>
    </div>
  );
}

export default SummonerHeaderErrorMessage;