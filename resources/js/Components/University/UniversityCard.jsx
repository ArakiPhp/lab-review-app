import { router } from "@inertiajs/react";
import TypeBadge from "./TypeBadge";

/**
 * 大学カードコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {Object} props.university - 大学オブジェクト
 * @param {string} [props.query=''] - 検索クエリ文字列
 * @returns {JSX.Element} コンポーネントのJSX
 */
const UniversityCard = ({ university, query = '' }) => {
  return (
    <div
      className="bg-[#EEF7FB] rounded-lg shadow-md px-4 py-3 hover:shadow-lg transition-shadow cursor-pointer flex items-center gap-4"
      onClick={() => router.get(route('faculties.index', { university: university.id, query }))}
    >
      <TypeBadge type={university.type} className="flex-shrink-0 text-3xl" />
      <span className="text-2xl font-bold text-[#747D8C]">
        {university.name}
      </span>
    </div>
  );
}

export default UniversityCard;