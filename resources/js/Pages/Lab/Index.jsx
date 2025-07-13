import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Index({ labs, faculty }) {
  return (
    <div>
      <Head title={`${faculty.name} - 研究室一覧`} />
      <h1>{faculty.university.name} {faculty.name} - 研究室一覧</h1>
      
      {/* 学部一覧に戻るボタン */}
      <div>
        <Link href={route('faculties.index', faculty.university.id)}>
          <button>学部一覧に戻る</button>
        </Link>
      </div>
      
      {/* 学部編集ボタン */}
      <div>
        <Link href={route('faculty.edit', faculty.id)}>
          <button>学部を編集</button>
        </Link>
      </div>
      
      {/* 編集履歴ボタン */}
      <div>
        <Link href={route('faculty.history', faculty.id)}>
          <button>編集履歴を見る</button>
        </Link>
      </div>
      <div>
        {labs.length > 0 ? (
          labs.map((lab) => (
            <div key={lab.id}>
              <p>{lab.name}</p>
            </div>
          ))
        ) : (
          <p>研究室がありません。</p>
        )}
      </div>
    </div>
  );
}