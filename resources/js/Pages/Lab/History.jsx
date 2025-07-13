import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function History() {
    const { lab, editHistory } = usePage().props;

    return (
        <>
            <Head title={`${lab.name} - 編集履歴`} />

            <div>
                <h1>{lab.name} - 編集履歴</h1>
                <p>
                    {lab.faculty?.university?.name} / {lab.faculty?.name}
                </p>

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
                    <Link href={route("labs.show", lab.id)}>
                        <button>研究室詳細に戻る</button>
                    </Link>
                </div>
            </div>
        </>
    );
}