
/**
 * ユーザー情報バーコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {string} props.value - 表示するユーザー情報の値
 * @param {Function} props.onOpenEditDialog - 編集モーダルを開くコールバック関数
 * @returns {JSX.Element} コンポーネントのJSX
 */
import FieldBar from '../Common/FieldBar.jsx';
import EditIcon from '../../Assets/icons/edit.svg';

const UserInfoBar = ({ value, onOpenEditDialog }) => {
	return (
		<FieldBar
			right={<img src={EditIcon} alt="編集" onClick={onOpenEditDialog} className="cursor-pointer w-4 h-4" />}
		>
			<div className="truncate text-[#747D8C]">{value}</div>
		</FieldBar>
	);
}

export default UserInfoBar;