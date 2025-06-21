import React from 'react';
import { Head, router } from '@inertiajs/react';

// propsとして新しく追加されたプロパティも受け取る
export default function Show({ 
    lab, 
    overallAverage, 
    averagePerItem, 
    userReview, 
    userOverallAverage, 
    ratingData
}) {
    const reviewCount = lab.reviews ? lab.reviews.length : 0;

    // ratingColumnsが空の場合、フォールバック用の配列を使用
    const fallbackRatingColumns = [
        'mentorship_style',
        'lab_atmosphere',
        'achievement_activity',
        'constraint_level',
        'facility_quality',
        'work_style',
        'student_balance',
    ];
    
    const ratingColumns = ratingData?.columns || fallbackRatingColumns;
    const actualRatingColumns = ratingColumns.length > 0 ? ratingColumns : fallbackRatingColumns;

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

    const handleCreateReview = () => {
        router.get(route('review.create', { lab: lab.id }));
    };

    const handleEditReview = () => {
        router.get(route('review.edit', { review: userReview.id }));
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
            
            {/* 全体の平均評価を表示 */}
            <h3>全体の評価（平均）</h3>
            <p><strong>総合評価: </strong>{formatAverage(overallAverage)}</p>

            <h4>各評価項目の平均:</h4>
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

            {/* ユーザーのレビューが存在する場合に表示 */}
            {userReview ? (
                <div>
                    <h3>あなたの投稿したレビュー</h3>
                    <p><strong>総合評価: </strong>{formatAverage(userOverallAverage)}</p>
                    
                    <h4>各評価項目:</h4>
                    <ul>
                        {actualRatingColumns && actualRatingColumns.length > 0 ? (
                            actualRatingColumns.map((column) => {
                                const value = userReview[column];
                                return (
                                    <li key={column}>
                                        <p>
                                            <strong>{itemLabels[column] || column}:</strong>
                                            {value !== null && value !== undefined 
                                                ? (typeof value === 'number' ? value.toFixed(2) : value)
                                                : '未評価'}
                                        </p>
                                    </li>
                                )
                            })
                        ) : (
                            <li>評価項目データがありません</li>
                        )}
                    </ul>
                    
                    {/* ユーザーのレビューにコメントがある場合表示 */}
                    {userReview.comment && (
                        <div>
                            <h4>コメント:</h4>
                            <p>{userReview.comment}</p>
                        </div>
                    )}
                    
                    <div>
                        <button onClick={() => handleDeleteReview(userReview.id)}>
                            このレビューを削除
                        </button>
                        <button onClick={handleEditReview}>
                            レビューを編集する
                        </button>
                    </div>
                </div>
            ) : (
                // レビューが存在しない場合はレビュー投稿ボタンを表示
                <div>
                    <h3>レビューを投稿</h3>
                    <p>まだこの研究室のレビューを投稿していません。</p>
                    <button onClick={handleCreateReview}>
                        レビューを投稿する
                    </button>
                </div>
            )}
        </div>
    );
}