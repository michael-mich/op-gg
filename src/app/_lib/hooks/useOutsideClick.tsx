import { useEffect, useRef } from 'react';

const useOutsideClick = <T extends HTMLDivElement & HTMLButtonElement>(
  state: boolean,
  setState: React.Dispatch<React.SetStateAction<boolean>>
): React.RefObject<T> => {
  const elementRef = useRef<T>(null);

  const handleOutsideClick = (event: MouseEvent): void => {
    if (elementRef.current && state && !elementRef.current.contains(event.target as T)) {
      setState(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [state]);

  return elementRef;
}

export default useOutsideClick;