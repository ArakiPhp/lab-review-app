import { Head } from "@inertiajs/react";
import AppLayout from '@/Layouts/AppLayout';
import LabCard from '../../Components/Lab/LabCard';
import BackButton from '../../Components/Common/BackButton';
import Pagination from "../../Components/Common/Pagination";

/**
 * 研究室一覧ページコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {Object} props.labs - ページネーション付き研究室データ
 * @param {Object} props.faculty - 学部オブジェクト
 * @param {string} props.query - 検索クエリ文字列
 * @returns {JSX.Element} コンポーネントのJSX
 */
const Index = ({ labs, faculty, query}) => {
  const hasResults = labs.data.length > 0;

  return (
    <AppLayout title={`${faculty.university.name} ${faculty.name}`}>
      <Head title={`${faculty.university.name} ${faculty.name}`} />

      {hasResults ? (
        // 1件以上の場合：コンテンツが少なければ戻るボタンは画面下部、多ければスクロール後に表示
        <div className="flex flex-col items-center min-h-full">
          <div className="w-full flex justify-end">
            <p className="text-[#747D8C]">{labs.total}件の研究室</p>
          </div>
          <div className="w-full max-w-xl space-y-6 mt-8">
            {labs.data.map(lab => (
              <LabCard key={lab.id} lab={lab} routerName="labs.show" />
            ))}
          </div>

          {/* ページネーション */}
          <Pagination paginator={labs} />
          
          <div className="mt-auto pt-8 pb-12">
            <BackButton routerName="faculties.index" params={{ query, university: faculty.university }} />
          </div>
        </div>
      ) : (
        // 0件の場合：メッセージを画面中央に、戻るボタンは下部に固定
        <div className="flex flex-col items-center min-h-full">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#747D8C]">0件の研究室</p>
          </div>
          <div className="pt-8 pb-12">
            <BackButton routerName="faculties.index" params={{ query, university: faculty.university }} />
          </div>
        </div>
      )}
    </AppLayout>
  )
}

export default Index;