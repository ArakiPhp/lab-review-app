import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";

/**
 * 学部編集履歴表示コンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {Object} props.faculty - 学部オブジェクト
 * @param {Array} props.editHistory - 編集履歴の配列
 * @param {string} props.query - 検索クエリ文字列
 * @returns {JSX.Element} コンポーネントのJSX
 */
const History = ({ faculty, editHistory, query = '' }) => {
  return(
    <AppLayout title={`${faculty.name}の編集履歴`}>
      <Head title={`${faculty.name}の編集履歴`} />
      <div className="flex flex-col items-center min-h-full">
        <div className="w-full max-w-3xl">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.get(route('faculties.index', { university: faculty.university_id }), { query })}
              className="px-4 py-2 text-sm rounded-lg"
              style={{ backgroundColor: '#8D9DB3 ', color: '#FFFFFF', fontWeight: 'bold' }}
            >
              ＜ 大学に戻る
            </button>
          </div>
          {editHistory.length > 0 ? (
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {editHistory.map((history, index) => (
                <div key={index} className="py-4 flex gap-6">
                  <div className="flex-shrink-0">
                    <p className="text-[#747D8C]">{new Date(history.updated_at).toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#747D8C]">{history.user || "退会したユーザーです"}</p>
                    <p className="text-[#747D8C]">{history.comment || "作成しました。"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#747D8C]">編集履歴がありません。</p>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default History;