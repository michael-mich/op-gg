'use client';

import { FC, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';
import Loading from '@/app/_components/loading';

const ThemeSwitch: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const darkTheme = theme === 'dark';

  const handleTheme = (): void => {
    if (darkTheme) {
      setTheme('light');
    }
    else {
      setTheme('dark');
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loading />
  }

  return (
    <button
      onClick={handleTheme}
      className='group rounded-md p-3 transition-colors hover:bg-lightGrayBackground'
      type='button'
      aria-label='change color theme'
    >
      {darkTheme
        ?
        <FaMoon
          className='max-w-6 text-secondGray transition-colors group-hover:text-white'
          width={25}
          height={25}
        />
        :
        <FaSun
          className='max-w-6 text-secondGray transition-colors group-hover:text-white'
          width={25}
          height={25}
        />
      }
    </button>
  );
}

export default ThemeSwitch;