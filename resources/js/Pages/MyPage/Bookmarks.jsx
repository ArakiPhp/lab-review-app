// resources/js/Pages/MyPage/Bookmarks.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Bookmarks({ bookmarks }) {
    const handleRemoveBookmark = (bookmarkId) => {
        if (confirm('ブックマークを解除しますか？')) {
            router.delete(route('mypage.bookmark.remove', bookmarkId));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="ブックマーク済み研究室" />

            <div>
                <h3>ブックマーク済み研究室</h3>
                
                {bookmarks.length === 0 ? (
                    <p>ブックマークした研究室はありません。</p>
                ) : (
                    <div>
                        {bookmarks.map((bookmark) => (
                            <div key={bookmark.id}>
                                <h4>{bookmark.lab.name}</h4>
                                <p>{bookmark.lab.description}</p>
                                <p>ブックマーク日: {new Date(bookmark.created_at).toLocaleDateString('ja-JP')}</p>
                                
                                <button onClick={() => handleRemoveBookmark(bookmark.id)}>
                                    ブックマーク解除
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <Link href={route('mypage.index')}>
                    <button>マイページに戻る</button>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}