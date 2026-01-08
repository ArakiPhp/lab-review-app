import { Head } from "@inertiajs/react";
import AppLayout from '@/Layouts/AppLayout';
import UniversityCard from '../../Components/University/UniversityCard';
import Pagination from "../../Components/Common/Pagination";
import Breadcrumb from "../../Components/Common/Breadcrumb";

/**
 * 大学一覧ページコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {Object} props.universities - ページネーション付き大学データ
 * @param {string} props.query - 検索クエリ文字列
 * @returns {JSX.Element} コンポーネントのJSX
 */
const Index = ({ universities, query}) => {
  const hasResults = universities.data.length > 0;

  return (
    <AppLayout title={`「${query}」を含む大学一覧`}>
      <Head title={`「${query}」を含む大学一覧`} />

      {hasResults ? (
        // 1件以上の場合：コンテンツが少なければ戻るボタンは画面下部、多ければスクロール後に表示
        <div className="flex flex-col items-center min-h-full">
          <div className="w-full flex flex-row items-center justify-between">
            {/* パンくずリスト */}
            <div>
              <Breadcrumb query={query} />
            </div>
            {/* 検索結果件数 */}
            <p className="text-[#747D8C]">{universities.total}件の検索結果</p>
          </div>
          <div className="w-full max-w-xl space-y-6 mt-8">
            {universities.data.map(university => (
              <UniversityCard key={university.id} university={university} query={query} />
            ))}
          </div>

          {/* ページネーション */}
          <Pagination paginator={universities} />
        </div>
      ) : (
        // 0件の場合：メッセージを画面中央に、戻るボタンは下部に固定
        <div className="flex flex-col items-center min-h-full">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#747D8C]">0件の検索結果</p>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

export default Index;