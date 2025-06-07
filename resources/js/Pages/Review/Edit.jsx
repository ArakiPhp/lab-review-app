import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Edit({ review }) {
    const [data, setData] = useState({
        lab_id: review.mentorship_style,
        mentorship_style: review.mentorship_style,
        lab_atmosphere: review.lab_atmosphere,
        achievement_activity: review.achievement_activity,
        constraint_level: review.constraint_level,
        facility_quality: review.facility_quality,
        work_style: review.work_style,
        student_balance: review.student_balance,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.put(route('review.update', { review: review.id }), data, {
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

    return (
        <div>
            <Head title={`${review.lab.name}のレビュー編集`} />
            <h1>{review.lab.name} のレビュー編集画面</h1>

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
                        {processing ? '更新中...' : 'レビューを更新'}
                    </button>
                </div>
            </form>
        </div>
    );
}
