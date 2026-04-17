import logoPC from '../Assets/logo/header.svg';
import logoMobile from '../Assets/logo/header-mobile.svg';
import HamburgerMenu from './HamburgerMenu';
import { Link } from '@inertiajs/react';

/**
 * ヘッダーコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {string} props.title - ページタイトル
 * @param {Function} props.onOpenSidebar - サイドバーを開くためのコールバック関数
 * @param {React.ReactNode} [props.headerRight] - ヘッダー右側に表示する追加コンテンツ
 * @returns {JSX.Element} コンポーネントのJSX
 */
const Header = ({ title, mobileTitle, onOpenSidebar, headerRight }) => {
  return (
    <header
      className="
        fixed
        top-0
        left-0
        w-full
        z-40
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
        <Link href={route('home')} aria-label="トップページへ">
          <img src={logoPC} alt="App Logo" className="hidden md:block h-9 w-auto" />
          <img src={logoMobile} alt="App Logo" className="md:hidden h-9 w-auto" />
        </Link>
      </div>

      {/* 中央：タイトル */}
      <h1 className="absolute left-1/2 -translate-x-1/2 w-[50%] text-center truncate text-sm md:text-xl font-semibold text-black">
        {mobileTitle && (
          <span className="md:hidden">{mobileTitle}</span>
        )}
        <span className={mobileTitle ? 'hidden md:inline' : ''}>{title}</span>
      </h1>

      {/* 右：追加コンテンツ＋ハンバーガーアイコンメニュー */}
      <div className="flex items-center gap-4">
        {headerRight}
        <HamburgerMenu onOpenSidebar={onOpenSidebar} />
      </div>
    </header>
  );
};

export default Header;
