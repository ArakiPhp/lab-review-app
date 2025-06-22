import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('university.store'), {
            onSuccess: () => {
                reset();
                // 成功メッセージはコントローラーから返される
            },
            onError: (errors) => {
                // エラーは自動的にerrorsオブジェクトに設定される
                console.log('バリデーションエラー:', errors);
            }
        });
    };

    return (
        <>
            <Head title="大学の新規作成" />
            
            <div>
                <h1>大学の新規作成</h1>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">大学名 *</label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="大学名を入力してください（最大50文字）"
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
                            {processing ? '作成中...' : '大学を作成'}
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