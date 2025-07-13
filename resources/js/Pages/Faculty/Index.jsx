import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index() {
    const { faculties, university } = usePage().props;

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