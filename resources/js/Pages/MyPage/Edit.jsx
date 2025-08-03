import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('mypage.update'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="ユーザー情報編集" />

            <div>
                <h3>ユーザー情報編集</h3>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>名前</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p>{errors.name}</p>}
                    </div>

                    <div>
                        <label>メールアドレス</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <p>{errors.email}</p>}
                    </div>

                    <button type="submit" disabled={processing}>
                        {processing ? '更新中...' : '更新する'}
                    </button>
                </form>

                <Link href={route('mypage.index')}>戻る</Link>
            </div>
        </AuthenticatedLayout>
    );
}