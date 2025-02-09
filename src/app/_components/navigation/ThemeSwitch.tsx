import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';
import { LuLoader } from 'react-icons/lu';

const ThemeSwitch = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const darkTheme = resolvedTheme === 'dark';

  const handleTheme = (): void => {
    setTheme(darkTheme ? 'light' : 'dark');
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <LuLoader className='text-secondGray size-4' />
  }

  return (
    <button
      onClick={handleTheme}
      className='group rounded-md p-3 transition-colors hover:bg-lightGrayBackground'
      type='button'
      aria-label='change color theme'
    >
      {darkTheme ? (
        <FaMoon
          className='max-w-6 text-secondGray transition-colors group-hover:text-white'
          width={25}
          height={25}
        />
      ) : (
        <FaSun
          className='max-w-6 text-secondGray transition-colors group-hover:text-white'
          width={25}
          height={25}
        />
      )}
    </button>
  );
}

export default ThemeSwitch;