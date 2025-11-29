import { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import logo from "../Assets/logo/Home.svg";
import SearchBar from "../Components/SearchBar";

export default function Home({ query=''}) {
  const [search, setSearch] = useState(query || '');

  // 検索フォームを送信する関数
  const handleSubmit = e => {
    e.preventDefault();
    router.get('/universities', { query: search });
  }

  return (
    <AppLayout mode="home"> {/* ホームモードをpropsで渡す */}
      <div className="flex flex-col items-center gap-8 pt-24">

        {/* ロゴ */}
        <img src={logo} alt="App Logo" className="h-32 w-auto" />

        {/* 検索フォーム */}
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          onSubmit={handleSubmit}
        />

        {/* 検索メッセージ */}
        <p className="text-[#747D8C]">まずは大学を検索してみましょう。</p>
      </div>
    </AppLayout>
  )
};