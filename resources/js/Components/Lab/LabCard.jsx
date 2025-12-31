import { router } from "@inertiajs/react";
import RankingBadge from '../../Components/Lab/RankingBadge';
import StarIcon from "./StarIcon";

// 星評価コンポーネント（5つ星表示、小数対応）
const StarRating = ({ rating }) => {
  const maxStars = 5;

  // 各星の塗りつぶし割合を計算（0〜100%）
  const getStarFillPercentage = (index) => {
    if (rating >= index + 1) {
      return 100; // 完全に塗りつぶし
    } else if (rating > index) {
      return (rating - index) * 100; // 部分的に塗りつぶし
    }
    return 0; // 塗りつぶしなし
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxStars)].map((_, index) => (
        <StarIcon 
          key={index}
          fillColor="#F4BB42"
          emptyColor="#E2EDF6"
          fillPercentage={getStarFillPercentage(index)}
        />
      ))}
    </div>
  );
};

const LabCard = ({ routerName, lab }) => {
  // 総合評価を小数第2位までフォーマット
  const formattedReview = lab.overall_avg != null 
    ? Number(lab.overall_avg).toFixed(2) 
    : null;

  // レビュー数を取得（reviews_countまたはreviewsの配列長）
  const reviewCount = lab.reviews_count ?? lab.reviews?.length ?? 0;

  return (
    <div
      className="bg-[#EEF7FB] rounded-lg shadow-md px-4 py-3 hover:shadow-lg transition-shadow cursor-pointer flex items-start gap-4 relative"
      onClick={() => router.get(route(routerName, { lab: lab.id }))}
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
            <StarRating rating={Number(lab.overall_avg)} />
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
