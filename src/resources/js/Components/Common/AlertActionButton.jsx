/**
 * アラートモーダル用アクションボタンコンポーネント
 * @param {Object} props
 * @param {Function} props.onClick - ボタン押下時のコールバック
 * @param {boolean} [props.disabled=false] - 無効状態
 * @param {string} [props.label='削除する'] - ボタンのラベル
 * @param {boolean} [props.isProcessing=false] - 処理中かどうか
 */
const AlertActionButton = ({
  onClick,
  disabled = false,
  label = '削除する',
  isProcessing = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-2 bg-[#EEF7FB] text-[#FF0000] font-bold rounded-md hover:shadow-lg transition-shadow cursor-pointer min-w-[100px] text-sm
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        boxShadow: 'inset 0 0 0 3px #EEF7FB, inset 0 0 0 4px #FF0000, 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
      }}
    >
      {isProcessing ? '処理中...' : label}
    </button>
  );
};

export default AlertActionButton;