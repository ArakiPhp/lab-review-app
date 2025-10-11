import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ notifications, user }) {
    return (
        <AuthenticatedLayout>
            <Head title="通知一覧" />

            <div>
                <h2>通知一覧</h2>
                {notifications.length === 0 ? (
                    <p>通知はありません。</p>
                ) : (
                    <ul>
                        {notifications.map((notification) => (
                            <li key={notification.id}>
                                {notification.data?.message || '通知メッセージがありません'}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
