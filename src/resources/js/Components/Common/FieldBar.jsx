/**
 * フィールドバーコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {React.ReactNode} [props.left] - 左側に表示する要素
 * @param {React.ReactNode} [props.right] - 右側に表示する要素
 * @param {React.ReactNode} props.children - 中央に表示するコンテンツ
 * @param {string} [props.size='md'] - サイズ ('sm' | 'md' | 'lg')
 * @param {string} [props.className=''] - 追加のCSSクラス
 * @returns {JSX.Element} コンポーネントのJSX
 */
const FieldBar = ({ left, right, children, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm', // 認証モーダル用
    md: 'px-4 py-2',         // 標準
    lg: 'px-4 py-3 text-lg', // 大きめ
  };

  return (
    <div
      className={`
        flex items-center
        rounded-lg
        bg-[#E2EDF6]
        border border-[#E2EDF6]
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {left ? (
        <div className="mr-0.5 flex-shrink-0">
          {left}
        </div>
      ) : null}

      <div className="flex-grow min-w-0">
        {children}
      </div>

      {right ? (
        <div className="flex items-center">
          <div className="h-6 mx-3" />
          {right}
        </div>
      ) : null}
    </div>
  );
};

export default FieldBar;
