/**
 * アラートモーダル用キャンセルボタンコンポーネント
 * @param {Object} props
 * @param {Function} props.onClick - ボタン押下時のコールバック
 * @param {boolean} [props.disabled=false] - 無効状態
 * @param {string} [props.label='キャンセル'] - ボタンのラベル
 */
const AlertCancelButton = ({ onClick, disabled = false, label = 'キャンセル' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2 bg-[#EEF7FB] text-[#747D8C] shadow-md font-bold rounded-md hover:shadow-lg transition-shadow cursor-pointer min-w-[100px] text-sm"
    >
      {label}
    </button>
  );
};

export default AlertCancelButton;
