import StarIcon from "./StarIcon";

/**
 * 星評価コンポーネント（5つ星表示、小数対応）
 * @param {Object} props - コンポーネントのprops
 * @param {number} props.rating - 評価値（0〜5の小数）
 * @returns {JSX.Element} コンポーネントのJSX
 */
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
          fillPercentage={getStarFillPercentage(index)}
        />
      ))}
    </div>
  );
};

export default StarRating;
