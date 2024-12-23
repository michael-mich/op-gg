import Image from 'next/image';

type Props = {
  text: string;
}

const NoDataError = ({ text }: Props) => {
  return (
    <div className='py-4'>
      <Image
        className='m-auto mb-2'
        src='https://s-lol-web.op.gg/images/icon/icon-nodata-dark.svg'
        width={100}
        height={100}
        alt='error message'
      />
      <p className='text-center text-sm text-secondGray dark:text-mediumGrayText'>
        {text}
      </p>
    </div>
  );
}

export default NoDataError;