import logo from '../Assets/logo/header.svg';
import hamburgerIcon from '../Assets/icons/hamburger.svg';
import { Link } from '@inertiajs/react';

const Header = ({ title, onOpenSidebar }) => { // 追加: onOpenSidebar を受け取る
  return (
    <header
      className="
        relative
        h-14
        flex
        items-center
        justify-between
        px-6
        bg-[#EEF5F9]
        after:content-['']
        after:absolute
        after:bottom-0
        after:left-0
        after:h-[3px]
        after:w-full
        after:bg-[linear-gradient(to_right,rgba(226,145,140,0.8),rgba(215,145,232,0.8),rgba(118,192,235,0.8))]
      "
    >
      {/* 左：ロゴ */}
      <div className="flex items-center">
        <Link href={route('labs.home')} aria-label="トップページへ">
          <img src={logo} alt="App Logo" className="h-9 w-auto" />
        </Link>
      </div>

      {/* 中央：タイトル */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-black">
        {title}
      </h1>

      {/* 右：ハンバーガー onClickにonOpenSidebarを追加 */}
      <button
        className="ml-auto flex items-center"
        aria-label="メニューを開く"
        onClick={onOpenSidebar}
      >
        <img
          src={hamburgerIcon}
          alt="メニュー"
          className="h-7 w-7 hover:opacity-80 transition"
        />
      </button>
    </header>
  );
};

export default Header;
