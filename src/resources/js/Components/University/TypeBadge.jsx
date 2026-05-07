import NationalBadge from '../../Assets/icons/university/national.svg';
import PublicBadge from '../../Assets/icons/university/public.svg';
import PrivateBadge from '../../Assets/icons/university/private.svg';

const BADGE_MAP = {
  national: NationalBadge,
  public: PublicBadge,
  private: PrivateBadge,
};

/**
 * 大学種別バッジコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {string} props.type - 大学の種別（national, public, private）
 * @returns {JSX.Element} コンポーネントのJSX
 */
const TypeBadge = ({ type }) => {
  const Icon = BADGE_MAP[type];
  return (
    <img
      src={Icon}
      alt={type}
      className='w-12 h-12 object-contain'
    />
  );
}

export default TypeBadge;