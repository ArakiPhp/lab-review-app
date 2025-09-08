import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index({ labs, faculty }) {
  const { auth } = usePage().props;

  // 学部削除のハンドラー
  const handleDeleteFaculty = () => {
    if (confirm(`本当に「${faculty.name}」を削除しますか？この操作は取り消せません。`)) {
      router.delete(route('admin.faculties.destroy', faculty.id), {
        onSuccess: () => {
          console.log('学部が削除されました');
        },
        onError: (errors) => {
          console.error('削除エラー:', errors);
          alert('削除に失敗しました');
        }
      });
    }
  };

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
      
      {/* 管理者専用: 学部削除ボタン */}
      {auth.user?.is_admin && (
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={handleDeleteFaculty}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            学部を削除（管理者）
          </button>
        </div>
      )}
      
      {/* 編集履歴ボタン */}
      <div>
        <Link href={route('faculty.history', faculty.id)}>
          <button>編集履歴を見る</button>
        </Link>
      </div>
      
      {/* 研究室作成ボタン */}
      <div>
        <Link href={route('lab.create', faculty.id)}>
          <button>研究室を作成</button>
        </Link>
      </div>
      <div>
        {labs.length > 0 ? (
          labs.map((lab) => (
            <div key={lab.id}>
              <Link href={route('labs.show', lab.id)}>
                <p>{lab.name}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>研究室がありません。</p>
        )}
      </div>
    </div>
  );
}