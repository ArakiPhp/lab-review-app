import FirstPlaceIcon from '../../Assets/icons/lab/first.svg';
import SecondPlaceIcon from '../../Assets/icons/lab/second.svg';
import ThirdPlaceIcon from '../../Assets/icons/lab/third.svg';

const BADGE_MAP = {
  1: FirstPlaceIcon,
  2: SecondPlaceIcon,
  3: ThirdPlaceIcon,
};

const RankingBadge = ({ rank }) => {
  const Icon = BADGE_MAP[rank];
  
  if (!Icon) {
    return <div className='w-7 h-7' />;
  }
  
  return (
    <img
      src={Icon}
      alt={`Rank ${rank}`}
      className='w-7 h-7 object-contain'
    />
  );
}

export default RankingBadge;