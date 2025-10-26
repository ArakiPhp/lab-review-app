// resources/js/Pages/MyPage/Index.jsx
import AppLayout from '@/Layouts/AppLayout'; // 追加: AppLayoutをインポート
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ user, notifications = [] }) {
    const handleDeleteAccount = () => {
        if (confirm('本当に退会しますか？この操作は取り消せません。')) {
            router.delete(route('mypage.delete'));
        }
    };

    const unreadCount = notifications.filter(n => !n.read_at).length;

    return (
        <AppLayout>
            <Head title="マイページ" />

            <div className="space-y-4">
                <div className="text-gray-800">
                    <div className={user.is_admin ? 'text-red-500' : ''}>
                        未読の通知: {unreadCount}件
                    </div>
                    <Link href={route('notifications.index')}>
                        <button className="mt-2 px-4 py-1 bg-gray-200 rounded-md hover:bg-gray-300">
                            通知一覧を見る
                        </button>
                    </Link>
                </div>

                <h3 className="text-lg font-semibold">ユーザー情報</h3>
                <p>名前: {user.name}</p>
                <p>メールアドレス: {user.email}</p>
                <p>登録日: {new Date(user.created_at).toLocaleDateString('ja-JP')}</p>

                <div className="space-x-2">
                    <Link href={route('mypage.edit')}>
                        <button className="px-3 py-1 border rounded-md hover:bg-gray-100">編集する</button>
                    </Link>

                    <Link href={route('mypage.bookmarks')}>
                        <button className="px-3 py-1 border rounded-md hover:bg-gray-100">ブックマーク済み研究室</button>
                    </Link>

                    <button
                        onClick={handleDeleteAccount}
                        className="px-3 py-1 border rounded-md text-red-600 hover:bg-red-50"
                    >
                        退会する
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
