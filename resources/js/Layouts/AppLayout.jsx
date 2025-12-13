import { Head, usePage } from '@inertiajs/react';
import { useState, useCallback, useEffect } from 'react';
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import HamburgerMenu from '@/Components/HamburgerMenu';

/**
 * アプリケーションのレイアウトコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {React.ReactNode} props.children - レイアウト内に表示するコンテンツ
 * @param {string} props.title - ページタイトル
 * @param {string} [props.mode='default'] - レイアウトモード
 * @returns {JSX.Element} コンポーネントのJSX
 */
const AppLayout = ({ children, title, mode='default' }) => {
  // ユーザーの認証状態を管理
  const { props } = usePage();
  const isLoggedIn = !!props?.auth?.user;

  // サイドバーの開閉状態を管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const setSidebarOpen = useCallback((open) => setIsSidebarOpen(Boolean(open)), []);

  // ホームページかどうか
  const isHome = mode === 'home';

  //  サイドバーが開いている間は、背景のスクロールを防止
  useEffect(() => {
    if (isSidebarOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [isSidebarOpen]);

  //  Escキーでサイドバーを閉じる
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setIsSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-[#EEF5F9]">
      <Head title={title} />

      {/* ホームモード: ハンバーガーアイコンのみを固定表示（サイドバー非表示時のみ） */}
      {isHome ? (
        !isSidebarOpen && (
          <div className="fixed top-4 right-6 z-50">
            <HamburgerMenu onOpenSidebar={() => setSidebarOpen(true)} />
          </div>
        )
      ) : (
        /* デフォルト: フルヘッダー表示 */
        <Header title={title} onOpenSidebar={() => setIsSidebarOpen(true)} />
      )}

      {/* メインコンテンツ領域 */}
      <main className="flex-1 bg-transparent flex">
        <div
          className="
            mx-auto
            w-full
            max-w-container
            px-[clamp(16px,4vw,32px)]
            py-6
            bg-[#EEF5F9]
            flex-1
          "
        >
          {children || <p className="text-gray-400 text-center">メインコンテンツ領域</p>}
        </div>
      </main>
      {/* サイドバー */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default AppLayout;