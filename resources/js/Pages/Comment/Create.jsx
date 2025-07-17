import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth, lab }) {
    const { data, setData, post, processing, errors } = useForm({
        content: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('comment.store', lab.id));
    };

    return (
        <div>
            <Head title="コメント投稿" />

            <div>
                <h3>研究室: {lab.name}</h3>
                
                <form onSubmit={submit}>
                    <div>
                        <label htmlFor="content">コメント内容</label>
                        <textarea
                            id="content"
                            name="content"
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows="5"
                            cols="50"
                            required
                        />
                        {errors.content && <div>{errors.content}</div>}
                    </div>

                    <div>
                        <button type="submit" disabled={processing}>
                            {processing ? '投稿中...' : 'コメントを投稿'}
                        </button>
                        <a href={route('labs.show', lab.id)}>
                            <button type="button">キャンセル</button>
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}