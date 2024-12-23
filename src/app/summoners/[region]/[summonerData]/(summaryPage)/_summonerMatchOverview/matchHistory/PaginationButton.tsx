import type {
  InfiniteData,
  FetchNextPageOptions,
  InfiniteQueryObserverResult
} from '@tanstack/react-query';
import type { TDetailedMatchHistory } from '@/app/_types/apiTypes/customApiTypes';
import type { TSetState } from '@/app/_types/tuples';
import { CircularProgress } from '@nextui-org/react';

type Props = {
  isFetchingNextPage: boolean;
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<InfiniteQueryObserverResult<InfiniteData<Array<TDetailedMatchHistory> | undefined, unknown>, Error>>;
  setMatchHistoryCount: TSetState<number>;
}

const PaginationButton = ({
  isFetchingNextPage,
  fetchNextPage,
  setMatchHistoryCount
}: Props) => {
  return (
    <button
      onClick={() => {
        fetchNextPage();
        setMatchHistoryCount(prev => prev + 20);
      }}
      className={`${isFetchingNextPage && 'pointer-events-none'} flex justify-center w-full text-sm 
      bg-white dark:bg-darkMode-mediumGray border border-lightMode-thirdLighterGray 
      dark:border-lightGrayBackground rounded py-2 mt-2 transition-colors 
      hover:bg-lightMode-thirdLighterGray hover:dark:bg-darkMode-secondDarkGray`}
      type='button'
    >
      {isFetchingNextPage ? (
        <CircularProgress aria-label='match history' size='sm' />
      ) : (
        'Show more'
      )}
    </button>
  );
}

export default PaginationButton;