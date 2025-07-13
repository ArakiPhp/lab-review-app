import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function History() {
    const { faculty, editHistory } = usePage().props;

    return (
        <>
            <Head title={`${faculty.name} - 編集履歴`} />

            <div>
                <h1>{faculty.name} - 編集履歴</h1>

                {/* 編集履歴一覧 */}
                <div>
                    {editHistory.length > 0 ? (
                        <div>
                            {editHistory.map((history, index) => (
                                <div key={index}>
                                    <h3>編集 #{editHistory.length - index}</h3>
                                    <p>
                                        <strong>編集者:</strong> {history.user}
                                    </p>
                                    <p>
                                        <strong>編集日時:</strong>{" "}
                                        {new Date(
                                            history.updated_at
                                        ).toLocaleString("ja-JP")}
                                    </p>
                                    <p>
                                        <strong>編集理由:</strong>{" "}
                                        {history.comment || "作成しました。"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>編集履歴がありません。</p>
                    )}
                </div>

                {/* 戻るリンク */}
                <div>
                    <Link href={route("labs.index", faculty.id)}>
                        <button>研究室一覧に戻る</button>
                    </Link>
                </div>
            </div>
        </>
    );
}