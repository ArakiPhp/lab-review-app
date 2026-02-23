import { Link } from '@inertiajs/react';
import close from '../Assets/icons/sidebar/close.svg';
import home from '../Assets/icons/sidebar/home.svg';
import mypage from '../Assets/icons/sidebar/mypage.svg';
import bookmark from '../Assets/icons/sidebar/bookmark.svg';
import ranking from '../Assets/icons/sidebar/ranking.svg';
import logout from '../Assets/icons/sidebar/logout.svg';
import login from '../Assets/icons/sidebar/login.svg';
import register from '../Assets/icons/sidebar/register.svg';

/**
 * サイドバーコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {boolean} props.isOpen - サイドバーの開閉状態
 * @param {Function} props.onClose - サイドバーを閉じるためのコールバック関数
 * @param {boolean} props.isLoggedIn - ユーザーのログイン状態
 * @param {Function} props.onOpenAuthModal - 認証モーダルを開く関数（引数に'mode'を取る）
 * @returns {JSX.Element} コンポーネントのJSX
 */
const Sidebar = ({ isOpen, onClose, isLoggedIn, onOpenAuthModal }) => {
  const handleLoginClick = () => {
    onClose();
    onOpenAuthModal('login');
  };

  const handleRegisterClick = () => {
    onClose();
    onOpenAuthModal('register');
  };
  
  // メニュー定義
  const items = isLoggedIn
    ? [
        { label: 'ホーム', href: route('home'), icon: home },
        { label: 'マイページ', href: route('mypage.index'), icon: mypage },
        { label: 'ブックマーク', href: route('mypage.bookmarks'), icon: bookmark },
        { label: 'ランキング', href: null, icon: ranking },
        { label: 'ログアウト', href: route('logout'), method: 'post', icon: logout },
      ]
    : [
        { label: 'ホーム', href: route('home'), icon: home },
        { label: '新規登録', onClick: handleRegisterClick, icon: register },
        { label: 'ログイン', onClick: handleLoginClick, icon: login },
        { label: 'ランキング', href: null, icon: ranking },
      ];

  return (
    <>
      <style>{`
        @keyframes text-expand {
          0% {
            letter-spacing: 0;
          }
          100% {
            letter-spacing: 0.05em;
          }
        }
        .text-expand:hover {
          animation: text-expand 0.3s ease-out forwards;
        }
      `}</style>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 transition-opacity duration-300 z-40
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
      />

      {/* 本体 */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`
          fixed right-0 top-0 h-dvh w-[270px] max-w-[90vw] bg-[#EEF5F9] shadow-2xl z-50
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        {/* ヘッダー（バツ印） */}
        <div className="flex items-center justify-end px-4 h-14">
          <button
            type="button"
            onClick={onClose}
            className="p-2"
            aria-label="メニューを閉じる"
            autoFocus
          >
            <img src={close} alt="" className="h-7 w-7 hover:opacity-80 transition" />
          </button>
        </div>

        {/* リスト */}
        <nav className="p-2">
          <ul className="space-y-1">
            {items.map(it => (
              <li key={it.label}>
                {it.href ? (
                  <Link
                    href={it.href}
                    method={it.method}
                    as={it.method ? 'button' : 'a'}
                    className="
                      text-expand text-lg w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg
                      hover: transition
                      text-[#747D8C] font-medium
                    "
                    onClick={onClose}
                  >
                    <img src={it.icon} alt="" className="h-8 w-8" />
                    {it.label}
                  </Link>
                ) : it.onClick ? (
                  <button
                    type='button'
                    onClick={it.onClick}
                    className="
                      text-expand text-lg w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg
                      hover:transition text-[#747D8C] font-medium
                    "
                    >
                      <img src={it.icon} alt="" className="h-8 w-8" />
                      {it.label}
                    </button>
                ) : (
                  <span
                    className="
                      w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg
                      text-gray-400 font-medium cursor-not-allowed
                    "
                  >
                    <img
                      src={it.icon}
                      alt=""
                      className={`${it.label === 'ランキング' ? 'h-8 w-8' : 'h-5 w-5'} opacity-40`}
                    />
                    {it.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;