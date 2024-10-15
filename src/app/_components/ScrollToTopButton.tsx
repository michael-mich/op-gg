'use client';

import { useState, useEffect } from 'react';
import { IoIosArrowUp } from 'react-icons/io';

const ScrollToTopButton = () => {
  const [displayButton, setDisplayButton] = useState(false);

  const scrollToTop = (): void => {
    window.scrollTo(0, 0);
  }

  const handleDisplayButton = () => {
    setDisplayButton(window.scrollY > 150);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleDisplayButton);

    return () => {
      window.removeEventListener('scroll', handleDisplayButton);
    }
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`${displayButton ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'} fixed bottom-8 right-8 z-[100] border border-black 
      dark:border-darkMode-lighterGray rounded-md bg-white dark:bg-darkMode-mediumGray p-3.5 transition-all`}
      type='button'
      aria-label='Scroll to top'
    >
      <IoIosArrowUp />
    </button>
  );
}

export default ScrollToTopButton;