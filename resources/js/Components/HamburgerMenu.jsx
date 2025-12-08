import hamburgerIcon from '../Assets/icons/hamburger.svg';

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