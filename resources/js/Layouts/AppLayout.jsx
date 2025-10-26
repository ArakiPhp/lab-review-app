export default function AppLayout({ children }) {
  return (
    <div className="min-h-dvh flex flex-col bg-[##EEF5F9]">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 bg-[#EEF5F9] flex items-center px-6">
        <h1 className="text-lg font-semibold">ヘッダー領域</h1>
      </header>

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