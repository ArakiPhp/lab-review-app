import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';

export default function Index({ universities, query }) {
  const [search, setSearch] = useState(query || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    router.get('/universities', { query: search });
  };

  // ページネーション用の関数
  const goToPage = (page) => {
    const params = { page };
    if (query) {
      params.query = query;
    }
    router.get('/universities', params);
  };

  const goToPreviousPage = () => {
    if (universities.current_page > 1) {
      goToPage(universities.current_page - 1);
    }
  };

  const goToNextPage = () => {
    if (universities.current_page < universities.last_page) {
      goToPage(universities.current_page + 1);
    }
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(universities.last_page);
  };

  // ページ番号の配列を生成（現在のページ前後2ページずつ表示）
  const getPageNumbers = () => {
    const current = universities.current_page;
    const last = universities.last_page;
    const pages = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(last, current + 2);

    // 最初の方のページの場合、後ろを多めに表示
    if (current <= 3) {
      end = Math.min(last, 5);
    }
    
    // 最後の方のページの場合、前を多めに表示
    if (current >= last - 2) {
      start = Math.max(1, last - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div>
      <Head title="大学検索結果" />

      <h1>大学検索</h1>

      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
          placeholder="大学名で検索"
        />
        <button onClick={handleSubmit}>
          検索
        </button>
      </div>

      {query && (
        <p>
          「<strong>{query}</strong>」の検索結果（{universities.total}件）
        </p>
      )}

      {universities.data.length === 0 ? (
        <p>該当する大学は見つかりませんでした。</p>
      ) : (
        <ul>
          {universities.data.map((university) => (
            <li key={university.id}>
              <Link href={route('faculties.index', university.id)}>
                {university.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* ページネーション */}
      {universities.last_page > 1 && (
        <div>
          <p>
            ページ {universities.current_page} / {universities.last_page} 
            （全 {universities.total} 件中 {universities.from} - {universities.to} 件目）
          </p>
          
          <div>
            {/* 最初のページボタン */}
            <button
              onClick={goToFirstPage}
              disabled={universities.current_page === 1}
            >
              ≪
            </button>

            {/* 前のページボタン */}
            <button
              onClick={goToPreviousPage}
              disabled={universities.current_page === 1}
            >
              ＜
            </button>

            {/* 最初のページ番号より前に省略がある場合 */}
            {pageNumbers[0] > 1 && (
              <>
                <button onClick={() => goToPage(1)}>1</button>
                {pageNumbers[0] > 2 && <span>...</span>}
              </>
            )}

            {/* ページ番号ボタン */}
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                disabled={pageNum === universities.current_page}
              >
                {pageNum}
              </button>
            ))}

            {/* 最後のページ番号より後に省略がある場合 */}
            {pageNumbers[pageNumbers.length - 1] < universities.last_page && (
              <>
                {pageNumbers[pageNumbers.length - 1] < universities.last_page - 1 && (
                  <span>...</span>
                )}
                <button onClick={() => goToPage(universities.last_page)}>
                  {universities.last_page}
                </button>
              </>
            )}

            {/* 次のページボタン */}
            <button
              onClick={goToNextPage}
              disabled={universities.current_page === universities.last_page}
            >
              ＞
            </button>

            {/* 最後のページボタン */}
            <button
              onClick={goToLastPage}
              disabled={universities.current_page === universities.last_page}
            >
              ≫
            </button>
          </div>
        </div>
      )}
    </div>
  );
}