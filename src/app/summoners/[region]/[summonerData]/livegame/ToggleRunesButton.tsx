import type { TActiveRuneDisplay } from './page';
import { IoIosArrowDown } from 'react-icons/io';

interface Props extends Pick<TActiveRuneDisplay, 'summonerIndex' | 'teamType'> {
  activeRuneDisplay: TActiveRuneDisplay;
  setActiveRuneDisplay: React.Dispatch<React.SetStateAction<TActiveRuneDisplay>>;
  isActiveRuneDisplayed: boolean;
}

const ToggleRunesButton = ({
  activeRuneDisplay,
  setActiveRuneDisplay,
  isActiveRuneDisplayed,
  summonerIndex,
  teamType
}: Props) => {
  return (
    <td className='text-xs py-2 px-3'>
      <button
        onClick={() => {
          setActiveRuneDisplay((prev) => {
            const clickedSameButton = (
              prev.summonerIndex === summonerIndex
              && prev.teamType === teamType && activeRuneDisplay.clicked
            ) ? false : true;

            return {
              clicked: clickedSameButton,
              summonerIndex,
              teamType,
            }
          })
        }}
        className={`${isActiveRuneDisplayed ? 'bg-lightMode-secondLighterGray border-lightMode-secondLighterGray dark:bg-darkMode-lighterGray dark:border-darkMode-lighterGray' : 'border-lightMode-thirdLighterGray dark:border-lightGrayBackground hover:bg-lightMode-lighterGray dark:hover:bg-darkMode-darkGray'} 
        flex items-center justify-between w-full text-xs rounded border py-1 px-2 transition-colors`}
        type='button'
      >
        <span className={`${isActiveRuneDisplayed ? 'text-white' : 'text-secondGray dark:text-mediumGrayText'}`}>
          Runes
        </span>
        <IoIosArrowDown className={`${isActiveRuneDisplayed ? 'text-white rotate-180' : 'text-lightMode-thirdLighterGray dark:text-[#949ea9]'} transition-transform`} />
      </button>
    </td>
  );
}

export default ToggleRunesButton;