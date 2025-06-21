import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Create({ lab }) {
    const [data, setData] = useState({
        lab_id: lab.id,
        mentorship_style: 3,
        lab_atmosphere: 3,
        achievement_activity: 3,
        constraint_level: 3,
        facility_quality: 3,
        work_style: 3,
        student_balance: 3,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(`/labs/${data.lab_id}/reviews`, data, {
            onSuccess: () => {
                // 成功時の処理
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

    const handleChange = (field, value) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleBack = () => {
        router.get(route('labs.show', { lab: lab.id }));
    };

    return (
        <div>
            <Head title={`${lab.name}のレビュー作成`} />
            <button onClick={handleBack}>
                ← {lab.name}の詳細ページに戻る
            </button>
            <h1>{lab.name} のレビュー作成画面</h1>

            <form onSubmit={handleSubmit}>
                {/* 指導スタイル */}
                <div>
                    <label>指導スタイル: {data.mentorship_style}</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={data.mentorship_style}
                        onChange={(e) => handleChange('mentorship_style', parseInt(e.target.value))}
                    />
                    {errors.mentorship_style && <div>{errors.mentorship_style}</div>}
                </div>

                {/* 雰囲気・文化 */}
                <div>
                    <label>雰囲気・文化: {data.lab_atmosphere}</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={data.lab_atmosphere}
                        onChange={(e) => handleChange('lab_atmosphere', parseInt(e.target.value))}
                    />
                    {errors.lab_atmosphere && <div>{errors.lab_atmosphere}</div>}
                </div>

                {/* 成果・活動 */}
                <div>
                    <label>成果・活動: {data.achievement_activity}</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={data.achievement_activity}
                        onChange={(e) => handleChange('achievement_activity', parseInt(e.target.value))}
                    />
                    {errors.achievement_activity && <div>{errors.achievement_activity}</div>}
                </div>

                {/* 拘束度 */}
                <div>
                    <label>拘束度: {data.constraint_level}</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={data.constraint_level}
                        onChange={(e) => handleChange('constraint_level', parseInt(e.target.value))}
                    />
                    {errors.constraint_level && <div>{errors.constraint_level}</div>}
                </div>

                {/* 設備 */}
                <div>
                    <label>設備: {data.facility_quality}</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={data.facility_quality}
                        onChange={(e) => handleChange('facility_quality', parseInt(e.target.value))}
                    />
                    {errors.facility_quality && <div>{errors.facility_quality}</div>}
                </div>

                {/* 働き方 */}
                <div>
                    <label>働き方: {data.work_style}</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={data.work_style}
                        onChange={(e) => handleChange('work_style', parseInt(e.target.value))}
                    />
                    {errors.work_style && <div>{errors.work_style}</div>}
                </div>

                {/* 人数バランス */}
                <div>
                    <label>人数バランス: {data.student_balance}</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={data.student_balance}
                        onChange={(e) => handleChange('student_balance', parseInt(e.target.value))}
                    />
                    {errors.student_balance && <div>{errors.student_balance}</div>}
                </div>

                {/* 送信ボタン */}
                <div>
                    <button type="submit" disabled={processing}>
                        {processing ? '投稿中...' : 'レビューを投稿'}
                    </button>
                </div>
            </form>
        </div>
    );
}