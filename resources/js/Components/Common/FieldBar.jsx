/**
 * フィールドバーコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {React.ReactNode} [props.left] - 左側に表示する要素
 * @param {React.ReactNode} [props.right] - 右側に表示する要素
 * @param {React.ReactNode} props.children - 中央に表示するコンテンツ
 * @param {string} [props.className=''] - 追加のCSSクラス
 * @returns {JSX.Element} コンポーネントのJSX
 */
const FieldBar = ({ left, right, children, className = "" }) => {
  return (
    <div
      className={`
        flex items-center
        rounded-lg
        bg-[#E2EDF6]
        border border-[#E2EDF6]
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]
        px-4 py-1
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
