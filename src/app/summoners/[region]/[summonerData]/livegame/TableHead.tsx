const columns = [
  '',
  '',
  `S${new Date().getFullYear()}`,
  'Ranked Ratio',
  'Runes',
  'Ban'
];

type Props = {
  blueTeam: boolean;
}

const TableHead = ({ blueTeam }: Props) => {
  const blueText = blueTeam ? 'text-blue' : 'text-red';
  console.log('rere')
  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th
            className={`${index === 0 ? 'flex items-center gap-2 pl-4 pr-3' : 'text-center px-3'} text-xs border-t border-t-almostWhite dark:border-t-darkMode-darkBlue py-2
            ${index === 1 ? 'w-[30px]' : index === 2 ? 'w-[132px]' : index === 3 ? 'w-[124px]' : index === 4 ? 'w-[136px]' : index === 5 ? 'w-[56px]' : 'w-auto'}`}
            scope='col'
            key={index}
          >
            {index === 0 ? (
              <>
                <span className={`${blueText} font-bold`}>{blueTeam ? 'Blue' : 'Red'} Team</span>
                <div className='flex items-center gap-1'>
                  <span className={`${blueText} font-normal`}>Tier Average:</span>
                  <span className={`${blueText} font-bold`}>Diamond</span>
                </div>
              </>
            ) : (
              column
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHead;