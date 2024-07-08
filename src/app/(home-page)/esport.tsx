'use client'

import { FC } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getLecSpringSeason } from '../_lib/api';
import { LuLoader } from "react-icons/lu";

type LecSpringSeason = {
  losses: number;
  rank: number;
  team: { acronym: string; image_url: string };
  wins: number;
}

const Esport: FC = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['lec'],
    queryFn: () => getLecSpringSeason()
  });

  if (isLoading) {
    return <LuLoader className='text-icons-gray' />
  }

  if (isError) {
    return <p>Something went wrong</p>
  }

  return (
    <div>
      {(data as Array<LecSpringSeason>).map((data, index) => (
        <div key={index}>
          <div>
            <span>{data.rank}</span>
            <Image
              className='w-auto'
              src={data.team.image_url}
              width={25}
              height={25}
              alt={data.team.acronym}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Esport;