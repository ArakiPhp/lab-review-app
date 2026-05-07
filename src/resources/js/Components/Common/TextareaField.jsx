/**
 * テキストエリアフィールドコンポーネント
 * @param {Object} props
 * @param {string} props.value - 値
 * @param {Function} props.onChange - 変更ハンドラ
 * @param {string} [props.placeholder] - プレースホルダー
 * @param {string} [props.size='md'] - サイズ ('sm' | 'md' | 'lg')
 * @param {number} [props.rows=3] - 行数
 * @param {string} [props.className=''] - 追加クラス
 * @returns {JSX.Element}
 */
const TextareaField = ({
  value,
  onChange,
  placeholder,
  size = 'md',
  rows = 3,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-4 py-3 text-lg',
  };

  return (
    <div
      className={`
        rounded-lg
        bg-[#E2EDF6]
        border border-[#E2EDF6]
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 m-0 resize-none"
      />
    </div>
  );
};

export default TextareaField;