import Image from 'next/image';

type Props = {
  text: string;
  size?: 'large' | 'medium';
}

const NoDataError = ({ text, size = 'large' }: Props) => {
  const isLargeSize = size === 'large';
  const imageSize = isLargeSize ? 64 : 48;

  return (
    <div className='py-4'>
      <Image
        className={`${isLargeSize ? 'size-16' : ''} m-auto mb-2`}
        src={`https://s-lol-web.op.gg/images/icon/icon-nodata${isLargeSize ? '' : '-dark'}.svg`}
        width={imageSize}
        height={imageSize}
        alt='error message'
      />
      <p className={`text-center 
      ${isLargeSize ? 'text-base text-lightMode-secondMediumGray dark:text-darkMode-lighterGray' : 'text-sm text-secondGray dark:text-mediumGrayText'}`}
      >
        {text}
      </p>
    </div>
  );
}

export default NoDataError;