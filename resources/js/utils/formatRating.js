/**
 * 評価値を小数点以下2桁にフォーマット
 * @param {number|null} value - 評価値
 * @param {string} fallback - 値がnullの場合の代替文字列（デフォルト: null）
 * @returns {string|null} フォーマットされた評価値
 */
export const formatRating = (value, fallback = null) => {
  return value != null ? Number(value).toFixed(2) : fallback;
};
