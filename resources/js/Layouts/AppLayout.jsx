import { Head } from '@inertiajs/react';
import Header from "../Components/Header"; // 追加

export default function AppLayout({ children, title }) { // 追加: titleをpropsとして受け取る
  return (
    <div className="min-h-dvh flex flex-col bg-[#EEF5F9]">
      <Head title={title} />
      {/* Header */}
      <Header title={title}/>

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
    </div>
  );
}