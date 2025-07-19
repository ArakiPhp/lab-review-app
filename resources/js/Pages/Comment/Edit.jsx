import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Edit({ comment }) {
    const [content, setContent] = useState(comment.content || '');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.put(route('comment.update', { comment: comment.id }), {
            content: content,
        }, {
            onSuccess: () => {
                // 成功時の処理は既にリダイレクトで処理される
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleCancel = () => {
        router.get(route('labs.show', { lab: comment.lab_id }));
    };

    return (
        <div>
            <Head title="コメントを編集" />
            <h1>コメントを編集</h1>
            
            {/* 研究室詳細に戻るボタン */}
            <div>
                <Link href={route('labs.show', { lab: comment.lab_id })}>
                    <button type="button">研究室詳細に戻る</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="content">コメント内容:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="5"
                        cols="50"
                        maxLength="1000"
                        required
                    />
                    {errors.content && (
                        <div style={{ color: 'red' }}>
                            {errors.content}
                        </div>
                    )}
                </div>

                <div>
                    <button type="submit" disabled={processing}>
                        {processing ? '更新中...' : 'コメントを更新'}
                    </button>
                    <button type="button" onClick={handleCancel} disabled={processing}>
                        キャンセル
                    </button>
                </div>
            </form>

            <div>
                <p>文字数制限: 1000文字まで</p>
                <p>現在の文字数: {content.length}/1000</p>
            </div>
        </div>
    );
}