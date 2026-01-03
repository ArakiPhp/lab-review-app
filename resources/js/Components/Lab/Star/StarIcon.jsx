import { useId } from "react";

/**
 * 星アイコンコンポーネント（グラデーション塗りつぶし対応）
 * @param {Object} props - コンポーネントのprops
 * @param {number} [props.fillPercentage=100] - 塗りつぶし割合（0〜100）
 * @returns {JSX.Element} コンポーネントのJSX
 */
const StarIcon = ({ fillPercentage }) => {
  const id = useId();
  const gradientId = `starGradient-${id}`;
  const fillColor = "#F4BB42";
  const emptyColor = "#E2EDF6";

  return (
    <svg width="16" height="16" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fillPercentage}%`} stopColor={fillColor} />
          <stop offset={`${fillPercentage}%`} stopColor={emptyColor} />
        </linearGradient>
      </defs>
      <path 
        d="M20.4125 1.29884L15.6511 10.953L4.99795 12.5061C3.08753 12.7832 2.32191 15.1384 3.70733 16.4874L11.4146 23.9978L9.5917 34.6072C9.26358 36.5249 11.2834 37.9613 12.975 37.0645L22.5052 32.0551L32.0355 37.0645C33.7271 37.9541 35.7469 36.5249 35.4188 34.6072L33.5959 23.9978L41.3032 16.4874C42.6886 15.1384 41.923 12.7832 40.0125 12.5061L29.3594 10.953L24.598 1.29884C23.7448 -0.421992 21.273 -0.443867 20.4125 1.29884Z" 
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
};

export default StarIcon;
