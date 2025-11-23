import { Head, usePage } from '@inertiajs/react';
import { useState, useCallback, useEffect } from 'react';
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

export default function AppLayout({ children, title }) {
  // ユーザーの認証状態を管理
  const { props } = usePage();
  const isLoggedIn = !!props?.auth?.user;

  // サイドバーの開閉状態を管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const setSidebarOpen = useCallback((open) => setIsSidebarOpen(Boolean(open)), []);

  // 追加: サイドバーが開いている間は、背景のスクロールを防止
  useEffect(() => {
    if (isSidebarOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [isSidebarOpen]);

  // 追加: Escキーでサイドバーを閉じる
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setIsSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-[#EEF5F9]">
      <Head title={title} />
      {/* Header 追加: isSidebarOpen */}
      <Header title={title} onOpenSidebar={() => setSidebarOpen(true)} />

      {/* Main Content Area */}
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