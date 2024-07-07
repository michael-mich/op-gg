'use client';

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const NotFound: FC = () => {
  const router = useRouter();

  return (
    <section className='w-[380px] py-28 m-auto'>
      <h1 className='text-2xl font-bold text-center text-white mb-6'>
        Please try again
      </h1>
      <p className='text-[15px] text-center text-white leading-[1.1rem]'>
        The page you are looking for is no longer
        available or has been changed to a different page.
      </p>
      <p className='text-[15px] text-center text-white mb-4'>
        Please check the URL.
      </p>
      <p className='text-[15px] text-center text-white mb-16'>
        For further assistance, <span className='text-blue underline'> contact us</span>.
      </p>
      <Image
        className='size-full m-auto'
        src='/not-found-page/image.png'
        width={380}
        height={200}
        alt=''
        aria-hidden='true'
      />
      <div className='flex items-center justify-center gap-3 mt-10'>
        <button
          onClick={router.back}
          className='text-sm text-white bg-blue rounded py-2.5 px-4'
          type='button'
        >
          Previous Page
        </button>
        <Link
          className='w-[100px] text-sm text-center text-white bg-blue rounded py-2.5 px-4'
          href='/'
        >
          Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;