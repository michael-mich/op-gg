import { FC } from 'react';
import { LuLoader } from 'react-icons/lu';

const Loading: FC = () => {
  return (
    <div className='size-full flex items-center justify-center'>
      <LuLoader className='text-secondGray size-5' />
    </div>
  );
}

export default Loading;