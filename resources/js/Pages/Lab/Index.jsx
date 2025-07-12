import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Index({ labs, query }) {
  const [search, setSearch] = useState(query || '');

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('universities.index'), { query: search }); // クエリパラメータ付きでGETリクエスト
  };

  return (
    <div>
      <h1>研究室一覧</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="大学名で検索"
        />
        <button type="submit">検索</button>
      </form>
      <div>
        {labs.map((lab) => (
          <div
            key={lab.id}
          >
            <p>{lab.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
