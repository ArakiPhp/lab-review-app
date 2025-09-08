import React from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function Index() {
    const { faculties, university, auth } = usePage().props;

    // 大学削除のハンドラー
    const handleDeleteUniversity = () => {
        if (confirm(`本当に「${university.name}」を削除しますか？この操作は取り消せません。`)) {
            router.delete(route('admin.universities.destroy', university.id), {
                onSuccess: () => {
                    console.log('大学が削除されました');
                },
                onError: (errors) => {
                    console.error('削除エラー:', errors);
                    alert('削除に失敗しました');
                }
            });
        }
    };

    return (
        <>
            <Head title={`${university.name} - 学部一覧`} />
            
            <div>
                <h1>{university.name}</h1>
                
                {/* 大学編集ボタン */}
                <div>
                    <Link href={route('university.edit', university.id)}>
                        <button>大学を編集</button>
                    </Link>
                </div>
                
                {/* 管理者専用: 大学削除ボタン */}
                {auth.user?.is_admin && (
                    <div style={{ marginTop: '10px' }}>
                        <button 
                            onClick={handleDeleteUniversity}
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
                            大学を削除（管理者）
                        </button>
                    </div>
                )}
                
                {/* 編集履歴ボタン */}
                <div>
                    <Link href={route('university.history', university.id)}>
                        <button>編集履歴を見る</button>
                    </Link>
                </div>
                
                {/* 学部作成ボタン */}
                <div>
                    <Link href={route('faculty.create', university.id)}>
                        <button>学部を作成</button>
                    </Link>
                </div>
                
                {/* 学部一覧 */}
                <div>
                    {faculties.length > 0 ? (
                        <div>
                            {faculties.map((faculty) => (
                                <div key={faculty.id}>
                                    <Link href={route('labs.index', { university: university.id, faculty: faculty.id })}>
                                        <h3>{faculty.name}</h3>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>学部がまだありません。</p>
                    )}
                </div>
            </div>
        </>
    );
}