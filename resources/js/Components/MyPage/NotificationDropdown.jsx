import { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";
import NotificationIcon from "@/Assets/icons/notification.svg";

/**
 * 通知ベルアイコン + ドロップダウンコンポーネント
 * @param {Object} props
 * @param {Array} props.notifications - 通知オブジェクトの配列
 * @returns {JSX.Element}
 */
const NotificationDropdown = ({ notifications = [] }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	// 未読件数
	const unreadCount = notifications.filter((n) => !n.read_at).length;

	// 直近10件のみ表示
	const latestNotifications = notifications.slice(0, 10);

	// 外側クリックでドロップダウンを閉じる
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// ドロップダウン開閉のトグル
	const toggleDropdown = () => {
		const nextOpen = !isOpen;
		setIsOpen(nextOpen);

		// 開いたときに未読を既読にする
		if (nextOpen && unreadCount > 0) {
			router.post(
				route("notifications.markAsRead"),
				{},
				{ preserveState: true, preserveScroll: true }
			);
		}
	};

	// 経過時間を表示用にフォーマット
	const formatTime = (dateString) => {
		if (!dateString) return "";
		const diff = Date.now() - new Date(dateString).getTime();
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return "たった今";
		if (minutes < 60) return `${minutes}分前`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}時間前`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days}日前`;
		return new Date(dateString).toLocaleDateString("ja-JP");
	};

	/**
	 * 通知に対応する遷移先URLを取得する
	 * @param {Object} notification - 通知オブジェクト
	 * @returns {string|null} 遷移先URL（遷移不可の場合はnull）
	 */
	const getNotificationUrl = (notification) => {
		const data = notification.data || {};
		const type = notification.type || "";

		// ModelChangedNotification（編集通知）
		if (type.endsWith("ModelChangedNotification") && data.action === "edited" && data.model_id) {
			if (data.model_type === "大学") {
				return route("faculties.index", { university: data.model_id });
			}
			if (data.model_type === "学部") {
				return route("labs.index", { faculty: data.model_id });
			}
			if (data.model_type === "研究室") {
				return route("labs.show", { lab: data.model_id });
			}
		}

		// DeletionRequestNotification（削除依頼通知）→ 削除依頼一覧ページへ
		if (type.endsWith("DeletionRequestNotification")) {
			return route("admin.deletion_requests.index");
		}

		return null;
	};

	/**
	 * 通知クリック時のハンドラ
	 * @param {Object} notification - 通知オブジェクト
	 */
	const handleNotificationClick = (notification) => {
		const url = getNotificationUrl(notification);
		if (url) {
			setIsOpen(false);
			router.get(url);
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			{/* ベルアイコン */}
			<button
				type="button"
				onClick={toggleDropdown}
				className="relative cursor-pointer focus:outline-none"
				aria-label="通知"
			>
				<img src={NotificationIcon} alt="通知" className="w-7 h-7" />
				{unreadCount > 0 && (
					<span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full z-10 flex items-center justify-center text-xs font-bold text-white">
						{unreadCount > 99 ? "99+" : unreadCount}
					</span>
				)}
			</button>

			{/* ドロップダウン */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
					{/* ヘッダー */}
					<div className="px-4 py-3 bg-[#EEF5F9]">
						<h3 className="text-sm font-bold text-black">通知</h3>
					</div>
					<div className="h-1 w-full bg-[#EEF5F9] border-b border-gray-200" />

					{/* 通知リスト */}
					<div className="max-h-96 overflow-y-auto">
						{latestNotifications.length === 0 ? (
							<div className="px-4 py-6 text-center bg-[#EEF5F9] text-sm text-gray-400">
								通知はありません
							</div>
						) : (
							latestNotifications.map((notification) => (
								<div
									key={notification.id}
									onClick={() => handleNotificationClick(notification)}
									className={`px-4 py-3 border-b bg-[#EEF5F9] hover:bg-[#E2EDF6] transition ${
										!notification.read_at ? "bg-blue-50" : "border-gray-200"
									} ${getNotificationUrl(notification) ? "cursor-pointer" : ""}`}
								>
									<div className="flex items-start gap-2">
										{/* 未読インジケータ */}
										{!notification.read_at && (
											<span className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full shrink-0" />
										)}
										<div className="flex-1 min-w-0">
											<p className="text-sm text-[#747D8C] break-words">
												{notification.data?.message || "通知メッセージがありません"}
											</p>
											<p className="text-xs text-gray-400 mt-1">
												{formatTime(notification.created_at)}
											</p>
										</div>
									</div>
								</div>
							))
						)}
					</div>

					{/* フッター: すべて見るリンク */}
					{notifications.length > 0 && (
						<div className="px-4 py-2 border-t border-gray-200 bg-[#EEF5F9] text-center">
							<a
								href={route("notifications.index")}
								className="text-sm text-black hover:underline"
							>
								すべての通知を見る
							</a>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default NotificationDropdown;
