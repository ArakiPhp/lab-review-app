import React from 'react';
import { Head, router } from '@inertiajs/react';

// propsとして 'lab' だけでなく、`overallAverage` と `averagePerItem` も受け取る
export default function Show({ lab, overallAverage, averagePerItem }) {
    const reviewCount = lab.reviews ? lab.reviews.length : 0;

    const itemLabels = {
        mentorship_style: '指導スタイル',
        lab_atmosphere: '雰囲気・文化',
        achievement_activity: '成果・活動',
        constraint_level: '拘束度',
        facility_quality: '設備',
        work_style: '働き方',
        student_balance: '人数バランス',
    };

    const formatAverage = (value) => {
        return value !== null && value !== undefined ? value.toFixed(2) : 'データなし';
    };

    const handleDeleteReview = (reviewId) => {
        if (confirm('本当に削除してもよろしいですか？')) {
            router.delete(route('review.destroy', { review: reviewId }), {
                onSuccess: () => {
                    // 成功時の処理
                    alert('レビューが削除されました。');
                },
                onError: (error) => {
                    // エラー時の処理
                    alert('レビューの削除に失敗しました。');
                }
            });
        }
    };

    return (
        <div>
            <Head title={`${lab.name}の詳細`} />
            <h1>{lab.name} の詳細ページ</h1>
            <p>大学: {lab.faculty?.university?.name}</p>
            <p>学部: {lab.faculty?.name}</p>
            <p>研究室の説明: {lab.description}</p>
            <p>研究室のURL: <a href={lab.url} target="_blank" rel="noopener noreferrer">{lab.url}</a></p>
            <p>教授のURL: <a href={lab.professor_url} target="_blank" rel="noopener noreferrer">{lab.professor_url}</a></p>
            <p>男女比（男）: {lab.gender_ratio_male}</p>
            <p>男女比（女）: {lab.gender_ratio_female}</p>

            <hr />

            <h2>レビュー</h2>
            <p>レビュー数: {reviewCount}</p>
            {/* 新しい総合評価を表示 */}
            <p><strong>総合評価（各項目の平均の平均）: </strong>{formatAverage(overallAverage)}</p>

            <h3>各評価項目の平均:</h3>
            {averagePerItem && Object.keys(averagePerItem).length > 0 ? (
                <ul>
                    {Object.entries(averagePerItem).map(([itemKey, averageValue]) => (
                        <li key={itemKey}>
                            <p>
                                <strong>{itemLabels[itemKey] || itemKey}:</strong>
                                {formatAverage(averageValue)}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>まだ評価データがありません。</p>
            )}
            { lab.reviews && lab.reviews.length > 0 ? (
                <div>
                    {lab.reviews.map((review) => (
                        <button
                            key={review.id}
                            onClick={() => handleDeleteReview(review.id)}
                        >
                            レビューID {review.id}を削除
                        </button>))}
                </div>
            ) : (
                <p>レビューがまだありません。</p>
            )}
        </div>
    );
}