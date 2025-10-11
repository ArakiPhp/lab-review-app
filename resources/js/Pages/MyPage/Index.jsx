import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ user, notifications = [] }) {
    const handleDeleteAccount = () => {
        if (confirm('本当に退会しますか？この操作は取り消せません。')) {
            router.delete(route('mypage.delete'));
        }
    };

    // 未読の通知数を計算（read_at が null のもの）
    const unreadCount = notifications.filter(notification => !notification.read_at).length;

    return (
        <AuthenticatedLayout>
            <Head title="マイページ" />

            <div>
                {/* 通知件数とボタンをユーザー種別に応じて表示 */}
                <div style={{ marginBottom: '1em', color: user.is_admin ? 'red' : 'black' }}>
                    <div>未読の通知: {unreadCount}件</div>
                    <Link href={route('notifications.index')}>
                        <button style={{ marginTop: '0.5em' }}>
                            通知一覧を見る
                        </button>
                    </Link>
                </div>

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
