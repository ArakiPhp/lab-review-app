import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ faculty }) {
    const { data, setData, put, processing, errors } = useForm({
        name: faculty.name || '',
        comment: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('faculty.update', faculty.id));
    };

    return (
        <>
            <Head title={`${faculty.name} - 編集`} />
            
            <div>
                <h1>{faculty.name} - 編集</h1>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">学部名:</label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <div>{errors.name}</div>}
                    </div>
                    
                    <div>
                        <label htmlFor="comment">編集理由:</label>
                        <textarea
                            id="comment"
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            placeholder="編集理由を入力してください"
                            required
                        />
                        {errors.comment && <div>{errors.comment}</div>}
                    </div>
                    
                    <div>
                        <button type="submit" disabled={processing}>
                            {processing ? '更新中...' : '更新'}
                        </button>
                        
                        <Link href={route('labs.index', faculty.id)}>
                            <button type="button">キャンセル</button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}