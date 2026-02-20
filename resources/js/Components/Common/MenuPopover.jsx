/**
 * メニューポップオーバーコンポーネント
 * @param {Object} props - コンポーネントのプロパティ
 * @param {string} props.addLabel - 追加ボタンのラベルに表示する文字列
 * @param {Function} props.onAddClick - 「〇〇を追加する」クリック時のハンドラ
 * @param {Function} props.onEditClick - 「編集する」クリック時のハンドラ
 * @param {Function} props.onViewHistoryClick - 「編集履歴を見る」クリック時のハンドラ
 * @returns {JSX.Element} コンポーネントのJSX
 */
const MenuPopover = ({ addLabel, onAddClick, onEditClick, onViewHistoryClick }) => {
  const menuItems = [
    ...(addLabel ? [{ label: addLabel, onClick: onAddClick }] : []),
    { label: '編集する', onClick: onEditClick },
    { label: '編集履歴を見る', onClick: onViewHistoryClick },
    { label: '削除依頼をする', onClick: () => {} },
  ];

  return (
    <div
      className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl overflow-hidden z-10"
      style={{ backgroundColor: '#EEF7FB' }}
    >
      <ul className="py-1">
        {menuItems.map((item, index) => (
          <li
            key={index}
            style={
              index !== menuItems.length - 1
                ? { borderBottom: '1px solid #747D8C' }
                : {}
            }
          >
            <button
              className="w-full px-4 py-3 text-left text-sm"
              style={{ color: '#747D8C', fontWeight: 'bold' }}
              onClick={item.onClick}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuPopover;