import { router } from "@inertiajs/react";
import RankingBadge from '../../Components/Lab/RankingBadge';
import StarRating from "./Star/StarRating";

/**
 * ソート条件に対応する評価値を取得
 * @param {Object} lab - 研究室オブジェクト
 * @param {string} sort - ソート条件のキー
 * @returns {number|null} 評価値
 */
const getRatingValue = (lab, sort) => {
  if (sort === 'reviews_count') {
    return null; // レビュー数の場合は星評価を表示しない
  }
  
  const ratingMap = {
    overall: lab.overall_avg,
    mentorship_style: lab.avg_mentorship_style,
    lab_atmosphere: lab.avg_lab_atmosphere,
    achievement_activity: lab.avg_achievement_activity,
    constraint_level: lab.avg_constraint_level,
    facility_quality: lab.avg_facility_quality,
    work_style: lab.avg_work_style,
    student_balance: lab.avg_student_balance,
  };
  
  return ratingMap[sort] ?? lab.overall_avg;
};

/**
 * 評価値をフォーマット
 * @param {number|null} value - 評価値
 * @returns {string|null} フォーマットされた評価値
 */
const formatRating = (value) => {
  return value != null ? Number(value).toFixed(2) : null;
};

/**
 * 研究室カードコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {Object} props.lab - 研究室オブジェクト
 * @param {string} props.query - 検索クエリ文字列
 * @param {string} props.sort - ソート条件
 * @returns {JSX.Element} コンポーネントのJSX
 */
const LabCard = ({ lab, query, sort = 'overall' }) => {
  // ソート条件に応じた評価値を取得
  const ratingValue = getRatingValue(lab, sort);
  const formattedReview = formatRating(ratingValue);

  // レビュー数を取得（reviews_countまたはreviewsの配列長）
  const reviewCount = lab.reviews_count ?? lab.reviews?.length ?? 0;

  return (
    <div
      className="bg-[#EEF7FB] rounded-lg shadow-md px-4 py-3 hover:shadow-lg transition-shadow cursor-pointer flex items-start gap-4 relative"
      onClick={() => router.get(route("labs.show", { lab: lab.id, query }))}
    >
      <div className="absolute top-1 left-1">
        <RankingBadge rank={lab.rank} className="flex-shrink-0 text-3xl" />
      </div>
      <div className="ml-6">
        <span className="text-2xl font-bold text-[#747D8C]">
          {lab.name}
        </span>
        {formattedReview && (
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={ratingValue} />
            <span className="text-sm text-[#F4BB42]">
              {formattedReview}
            </span>
          </div>
        )}
      </div>
      {/* 右下にレビュー数を表示 */}
      <div className="absolute bottom-2 right-3">
        <span className="text-sm text-[#747D8C]">
          {reviewCount}件のレビュー
        </span>
      </div>
    </div>
  );
}

export default LabCard;
