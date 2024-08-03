'use client';

import Image from 'next/image';
import { usePathname, useParams } from 'next/navigation';
import { regionData } from '@/app/_data/regionData';

const SummonerHeader = () => {
  const pathname = usePathname();
  const summonerTagLine = pathname.slice(-3);
  const summonerName = pathname.replaceAll('/', ' ').split(' ')[3].replace('-', ' ').split(' ')[0].replaceAll('%20', ' ');

  const getRegionImage = () => {
    return regionData.find((region) => (region.shorthand === summonerTagLine) ? region.image : null);
  }
  const test = useParams();
  console.log(test);
  return (
    <section>
      <Image
        className='max-w-24'
        src={getRegionImage()!.image}
        width={20}
        height={20}
        alt=''
      />
    </section >
  );
}

export default SummonerHeader;