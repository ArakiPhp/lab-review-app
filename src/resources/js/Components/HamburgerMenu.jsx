import hamburgerIcon from '../Assets/icons/hamburger.svg';

/**
 * ハンバーガーメニューボタンコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {Function} props.onOpenSidebar - サイドバーを開くためのコールバック関数
 * @returns {JSX.Element} コンポーネントのJSX
 */
const HamburgerMenu = ({ onOpenSidebar }) => {
  return (
    <button
      onClick={onOpenSidebar}
      className="ml-auto flex items-center"
      aria-label="メニューを開く"
    >
      <img
        src={hamburgerIcon}
        alt="メニュー"
        className="h-7 w-7 hover:opacity-80 transition"
      />
    </button>
  );
}

export default HamburgerMenu;