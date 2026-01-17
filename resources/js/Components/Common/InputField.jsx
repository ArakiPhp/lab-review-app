import FieldBar from './FieldBar';

/**
 * 入力フィールドコンポーネント
 * @param {Object} props
 * @param {string} props.type - input の type
 * @param {string} props.value - 値
 * @param {Function} props.onChange - 変更ハンドラ
 * @param {string} [props.placeholder] - プレースホルダー
 * @param {string} [props.size='md'] - サイズ ('sm' | 'md' | 'lg')
 * @param {string} [props.className=''] - FieldBar への追加クラス
 * @returns {JSX.Element} コンポーネントのJSX
 */
const InputField = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  size = 'md',
  className = '',
}) => {
  return (
    <FieldBar size={size} className={className}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 m-0"
      />
    </FieldBar>
  );
};

export default InputField;