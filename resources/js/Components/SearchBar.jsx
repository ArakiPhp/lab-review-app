import searchInputIcon from '../Assets/icons/search/icon-search-input.svg';
import searchButtonIcon from '../Assets/icons/search/icon-search-button.svg';

/**
 * 検索バーコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {string} props.value - 入力値
 * @param {Function} props.onChange - 入力値変更時のコールバック関数
 * @param {Function} props.onSubmit - フォーム送信時のコールバック関数
 * @param {string} [props.placeholder='大学名を入力...'] - プレースホルダーテキスト
 * @returns {JSX.Element} コンポーネントのJSX
 */
const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = '大学名を入力...',
}) => {
  const isDisabled = !value || !value.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    onSubmit?.(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-xl mx-auto'
    >
      <div className='
        flex items-center
        rounded-lg
        bg-[#E2EDF6]
        border border-[#E2EDF6]
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]
        px-4 py-0
      '>
        {/* 左虫眼鏡アイコン */}
        <div className='mr-0.5 flex-shrink-0'>
          <img src={searchInputIcon} alt="" className='w-5 h-5' />
        </div>
        {/* 入力フィールド */}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 text-black placeholder-[#747D8C]"
        />
        {/* 区切り線 + 右側の検索ボタン */}
        <div className='flex items-center'>
          <div className='
            h-6
            border-l border-[#747D8C]
            mx-3
          '></div>
          <button
            type="submit"
            disabled={isDisabled}
            className={`
              flex items-center justify-center
              w-6 h-6
              rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <img src={searchButtonIcon} alt="検索" className='w-6 h-6' />
          </button>
        </div>
      </div>
    </form>
  )
}

export default SearchBar;