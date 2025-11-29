import hamburgerIcon from '../Assets/icons/hamburger.svg';

export default function HamburgerMenu({ onOpenSidebar }) {
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