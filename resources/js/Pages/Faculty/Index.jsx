import { Head } from "@inertiajs/react";
import AppLayout from '@/Layouts/AppLayout';
import FacultyCard from '../../Components/Faculty/FacultyCard';
import Breadcrumb from '../../Components/Common/Breadcrumb';

/**
 * 学部一覧ページコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {Array} props.faculties - 学部データの配列
 * @param {Object} props.university - 大学オブジェクト
 * @param {string} [props.query=''] - 検索クエリ文字列
 * @returns {JSX.Element} コンポーネントのJSX
 */
const Index = ({ faculties, university, query = '' }) => {
  const hasResults = faculties.length > 0;

  return (
    <AppLayout title={`${university.name}の学部一覧`}>
      <Head title={`${university.name}の学部一覧`} />
      {hasResults ? (
        <div className="flex flex-col items-center min-h-full">
          <div className="w-full flex flex-row items-center justify-between">
            {/* パンくずリスト 左寄せ */}
            <div>
              <Breadcrumb university={university} query={query} />
            </div>
            {/* 学部件数 右寄せ */}
            <p className="text-[#747D8C]">{faculties.length}件の学部</p>
          </div>
          <div className="w-full grid grid-cols-3 gap-6 mt-8 justify-items-center">
            {faculties.map(faculty => (
              <FacultyCard key={faculty.id} faculty={faculty} query={query} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center min-h-full">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#747D8C]">0件の学部</p>
          </div>
        </div>
      )}
    </AppLayout>
  )	
}

export default Index;