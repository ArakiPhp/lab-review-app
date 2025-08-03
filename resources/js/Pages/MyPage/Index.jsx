import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ user }) {
    const handleDeleteAccount = () => {
        if (confirm('本当に退会しますか？この操作は取り消せません。')) {
            router.delete(route('mypage.delete'));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="マイページ" />

            <div>
                <h3>ユーザー情報</h3>
                <p>名前: {user.name}</p>
                <p>メールアドレス: {user.email}</p>
                <p>登録日: {new Date(user.created_at).toLocaleDateString('ja-JP')}</p>
                
                <Link href={route('mypage.edit')}>
                    <button>編集する</button>
                </Link>
                
                <Link href={route('mypage.bookmarks')}>
                    <button>ブックマーク済み研究室</button>
                </Link>
                
                <button onClick={handleDeleteAccount}>
                    退会する
                </button>
            </div>
        </AuthenticatedLayout>
    );
}