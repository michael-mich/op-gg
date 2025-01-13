import Image from 'next/image';
import useGameVersionQuery from '@/app/_hooks/queries/useGameVersionQuery';
import { imageEndpoints } from '@/app/_constants/imageEndpoints';
import type { TChampion } from '../_types/apiTypes/apiTypes';

type Props = {
  championData: TChampion | undefined;
  imageSize: 'giant' | 'large' | 'mediumLarge' | 'medium' | 'smallMedium' | 'small';
  isRoundedImage?: boolean;
}

const ChampionAvatar = ({
  championData,
  imageSize,
  isRoundedImage = false,
}: Props) => {
  const { data: newestGameVersion } = useGameVersionQuery();

  const getImageDimension = () => {
    switch (imageSize) {
      case 'giant':
        return 60;
      case 'large':
        return 48;
      case 'mediumLarge':
        return 40;
      case 'medium':
        return 32;
      case 'smallMedium':
        return 24;
      case 'small':
        return 16;
      default:
        return 0;
    }
  }

  return (
    <Image
      className={`${imageSize === 'giant' ? 'size-[60px]' : imageSize === 'large' ? 'size-12 min-w-12 min-h-12' : imageSize === 'mediumLarge' ? 'size-10' : imageSize === 'medium' ? 'size-8 min-w-8 min-h-8' : imageSize === 'smallMedium' ? 'size-6' : 'size-4'}
      ${isRoundedImage ? 'rounded-image' : 'rounded'} object-contain`}
      src={`${imageEndpoints.championImage(newestGameVersion)}${championData?.image.full}`}
      width={getImageDimension()}
      height={getImageDimension()}
      placeholder='blur'
      blurDataURL='/placeholder/question-mark.webp'
      alt={championData?.name || ''}
    />
  );
}

export default ChampionAvatar;