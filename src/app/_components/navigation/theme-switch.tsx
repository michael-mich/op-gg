'use client';

import { FC, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';
import { LuLoader } from 'react-icons/lu';

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
  }, [])

  if (!mounted) {
    return <LuLoader className='max-w-6 size-auto text-[#9aa4af]' />
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
          className='max-w-6 size-auto text-[#9aa4af] transition-colors group-hover:text-white'
          width={25}
          height={25}
        />
        :
        <FaSun
          className='max-w-6 size-auto text-[#9aa4af] transition-colors group-hover:text-white'
          width={25}
          height={25}
        />
      }
    </button>
  );
}

export default ThemeSwitch;