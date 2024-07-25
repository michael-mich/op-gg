'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();
  const summonerTagLine = pathname.slice(-3);
  const summonerName = pathname.replaceAll('/', ' ').split(' ')[3].replace('-', ' ').split(' ')[0].replaceAll('%20', ' ');

  return (
    <>
    </>
  );
}

export default Page;