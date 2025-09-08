import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

// propsとして新しく追加されたプロパティも受け取る
export default function Show({ 
    lab, 
    overallAverage, 
    averagePerItem, 
    userReview, 
    userOverallAverage, 
    ratingData,
    comments,
    auth,
    userBookmark,
    bookmarkCount
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
                    alert('レビューが削除されました。');
                },
                onError: (error) => {
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

    const handleCreateComment = () => {
        router.get(route('comment.create', { lab: lab.id }));
    };

    const handleEditComment = (commentId) => {
        router.get(route('comment.edit', { comment: commentId }));
    };

    const handleDeleteComment = (commentId) => {
        if (confirm('本当に削除してもよろしいですか？')) {
            router.delete(route('comment.destroy', { comment: commentId }), {
                onSuccess: () => {
                    alert('コメントが削除されました。');
                },
                onError: (error) => {
                    alert('コメントの削除に失敗しました。');
                }
            });
        }
    };

    // 管理者用コメント削除
    const handleAdminDeleteComment = (commentId) => {
        if (confirm('管理者権限でこのコメントを削除してもよろしいですか？')) {
            router.delete(route('admin.comments.destroy', { comment: commentId }), {
                onSuccess: () => {
                    alert('コメントが削除されました（管理者）。');
                },
                onError: (error) => {
                    alert('コメントの削除に失敗しました。');
                }
            });
        }
    };

    // 研究室削除（管理者専用）
    const handleDeleteLab = () => {
        if (confirm(`本当に「${lab.name}」を削除しますか？この操作は取り消せません。`)) {
            router.delete(route('admin.labs.destroy', lab.id), {
                onSuccess: () => {
                    console.log('研究室が削除されました');
                },
                onError: (errors) => {
                    console.error('削除エラー:', errors);
                    alert('削除に失敗しました');
                }
            });
        }
    };

    // ブックマーク追加
    const handleAddBookmark = () => {
        router.post(route('bookmark.store'), {
            lab_id: lab.id
        }, {
            onSuccess: () => {
                alert('ブックマークに追加しました。');
            },
            onError: (error) => {
                alert('ブックマークの追加に失敗しました。');
            }
        });
    };

    // ブックマーク削除
    const handleRemoveBookmark = () => {
        if (confirm('ブックマークを削除してもよろしいですか？')) {
            router.delete(route('bookmark.destroy', { bookmark: userBookmark.id }), {
                onSuccess: () => {
                    alert('ブックマークを削除しました。');
                },
                onError: (error) => {
                    alert('ブックマークの削除に失敗しました。');
                }
            });
        }
    };

    return (
        <div>
            <Head title={`${lab.name}の詳細`} />
            <h1>{lab.name} の詳細ページ</h1>
            
            {/* 研究室一覧に戻るボタン */}
            <div>
                <Link href={route('labs.index', lab.faculty_id)}>
                    <button>研究室一覧に戻る</button>
                </Link>
            </div>
            
            {/* 研究室編集ボタン */}
            <div>
                <Link href={route('lab.edit', lab.id)}>
                    <button>研究室を編集</button>
                </Link>
            </div>
            
            {/* 管理者専用: 研究室削除ボタン */}
            {Boolean(auth?.user?.is_admin) && (
                <div style={{ marginTop: '10px' }}>
                    <button 
                        onClick={handleDeleteLab}
                        style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                    >
                        研究室を削除（管理者）
                    </button>
                </div>
            )}
            
            {/* 編集履歴ボタン */}
            <div>
                <Link href={route('lab.history', lab.id)}>
                    <button>編集履歴を見る</button>
                </Link>
            </div>
            
            {/* ブックマークボタン */}
            {auth && auth.user && (
                <div>
                    {userBookmark ? (
                        <button onClick={handleRemoveBookmark}>
                            ブックマークを削除
                        </button>
                    ) : (
                        <button onClick={handleAddBookmark}>
                            ブックマークに追加
                        </button>
                    )}
                </div>
            )}
            
            {/* ブックマーク数表示 */}
            {bookmarkCount !== undefined && (
                <p>ブックマーク数: {bookmarkCount}</p>
            )}
            
            {/* コメント投稿ボタン */}
            <div>
                <button onClick={handleCreateComment}>
                    コメントを投稿する
                </button>
            </div>
            
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

            <hr />

            {/* コメント一覧 */}
            <h2>コメント</h2>
            {comments && comments.length > 0 ? (
                <div>
                    {comments.map((comment) => (
                        <div key={comment.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                            <p><strong>投稿者:</strong> {comment.user?.name || '匿名'}</p>
                            <p><strong>投稿日:</strong> {new Date(comment.created_at).toLocaleDateString()}</p>
                            <p><strong>内容:</strong> {comment.content}</p>
                            
                            {/* コメントの編集・削除ボタン */}
                            {auth && auth.user && (
                                <div>
                                    {/* 自分のコメントの場合は編集・削除ボタン */}
                                    {auth.user.id === comment.user_id && (
                                        <>
                                            <button onClick={() => handleEditComment(comment.id)}>
                                                編集
                                            </button>
                                            <button onClick={() => handleDeleteComment(comment.id)}>
                                                削除
                                            </button>
                                        </>
                                    )}
                                    
                                    {/* 管理者の場合は他人のコメントも削除可能 */}
                                    {Boolean(auth.user.is_admin) && auth.user.id !== comment.user_id && (
                                        <button 
                                            onClick={() => handleAdminDeleteComment(comment.id)}
                                            style={{
                                                backgroundColor: '#dc2626',
                                                color: 'white',
                                                padding: '4px 8px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginLeft: '5px'
                                            }}
                                        >
                                            削除（管理者）
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>まだコメントがありません。</p>
            )}
        </div>
    );
}