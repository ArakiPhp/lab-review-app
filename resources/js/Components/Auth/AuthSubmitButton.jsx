/**
 * 認証ボタンコンポーネント
 * @param {Object} props
 * @param {string} props.mode - 'login' | 'register'
 * @param {boolean} [props.disabled=false] - 無効状態
 * @param {string} [props.type='submit'] - ボタンタイプ
 * @returns {JSX.Element} コンポーネントのJSX
 */
const AuthSubmitButton = ({ mode, disabled = false, type = 'submit' }) => {
  const label = mode === 'login' ? 'ログイン' : '新規登録';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        p-1 bg-[#33E1ED] shadow-md rounded-md 
        hover:shadow-lg transition-shadow 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
        <span className="px-14 py-1 block rounded text-white font-bold">
        {label}
      </span>
    </button>
  );
};

export default AuthSubmitButton;