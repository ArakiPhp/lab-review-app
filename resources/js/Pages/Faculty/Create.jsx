import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ university }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('faculty.store', university.id), {
            onSuccess: () => {
                reset('name'); // university_idはリセットしない
                // 成功メッセージはコントローラーから返される
            },
            onError: (errors) => {
                console.log('バリデーションエラー:', errors);
            }
        });
    };

    return (
        <>
            <Head title={`${university.name} - 学部の新規作成`} />
            
            <div>
                <h1>学部の新規作成</h1>
                <p>所属大学: <strong>{university.name}</strong></p>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">学部名 *</label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="学部名を入力してください"
                            required
                        />
                        {errors.name && (
                            <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <button 
                            type="submit" 
                            disabled={processing || !data.name.trim()}
                            style={{
                                padding: '10px 20px',
                                marginRight: '10px',
                                backgroundColor: processing || !data.name.trim() ? '#ccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: processing || !data.name.trim() ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {processing ? '作成中...' : '学部を作成'}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => window.history.back()}
                            disabled={processing}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: processing ? 'not-allowed' : 'pointer'
                            }}
                        >
                            キャンセル
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
