import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import UserInfoBar from "@/Components/MyPage/UserInfoBar";
import LabCard from "@/Components/Lab/LabCard";
import { useState, useRef } from "react";
import NotificationIcon from "@/Assets/icons/notification.svg";

const Index = ({ title, user, bookmarks = [] }) => {
	// 横スクロール用インデックス
	const [currentIndex, setCurrentIndex] = useState(0);

	const handlePrev = () => {
		setCurrentIndex((prev) => Math.max(prev - 1, 0));
	};
	const handleNext = () => {
		setCurrentIndex((prev) => Math.min(prev + 1, bookmarks.length - 1));
	};

	// 横スクロールもサポート（スワイプやホイール）
	const handleScroll = (e) => {
		if (bookmarks.length <= 1) return;
		if (e.deltaX > 10 || e.deltaY > 10) {
			handleNext();
		} else if (e.deltaX < -10 || e.deltaY < -10) {
			handlePrev();
		}
	};

	// タッチスワイプ対応
	const touchStartX = useRef(0);
	const handleTouchStart = (e) => {
		touchStartX.current = e.touches[0].clientX;
	};
	const handleTouchEnd = (e) => {
		const touchEndX = e.changedTouches[0].clientX;
		if (touchEndX - touchStartX.current > 50) {
			handlePrev();
		} else if (touchEndX - touchStartX.current < -50) {
			handleNext();
		}
	};

	// LabCardを1件だけ表示
	const currentLab = bookmarks[currentIndex];

	// 通知件数（仮で0。必要に応じてprops化してください）
	const notificationCount = 0;

	return (
		<AppLayout title={title}>
			<Head title={title} />
			{/* 通知アイコン（右肩に赤丸バッジ） */}
			<div className="w-full flex justify-end">
				<div className="relative">
					<img src={NotificationIcon} alt="通知" className="w-7 h-7 cursor-pointer" />
					<span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full z-10 flex items-center justify-center text-xs font-bold text-white">
            {0}
          </span>
				</div>
			</div>
			<div className="mt-2">

				{/* 基本情報 */}
				<div className="flex items-center justify-between border-b border-black pb-2 w-full">
					<h2 className="text-xl font-bold text-black">基本情報</h2>
					<span className="text-sm text-[#747D8C]">
						利用開始日: {user?.created_at ? new Date(user.created_at).toLocaleDateString('ja-JP') : ''}
					</span>
				</div>

				{/* ニックネーム */}
				<div className="mt-6 mb-4 flex items-center">
					<h3 className="text-lg font-semibold text-[#747D8C] w-40 shrink-0">ニックネーム</h3>
					<div className="w-96">
						<UserInfoBar value={user?.name} onOpenEditModal={() => {}} />
					</div>
				</div>

				{/* e-Mailアドレス */}
				<div className="mt-6 mb-4 flex items-center">
					<h3 className="text-lg font-semibold text-[#747D8C] w-40 shrink-0">e-Mailアドレス</h3>
					<div className="w-96">
						<UserInfoBar value={user?.email} onOpenEditModal={() => {}} />
					</div>
				</div>

				{/* パスワード */}
				<div className="mt-6 mb-4 flex items-center">
					<h3 className="text-lg font-semibold text-[#747D8C] w-40 shrink-0">パスワード</h3>
					<div className="w-96">
						<UserInfoBar value="••••••••" onOpenEditModal={() => {}} />
					</div>
				</div>

				{/* 退会 */}
				<div className="mt-6 mb-4 flex items-center">
					<button
						type="button"
						onClick={() => {}}
						className="text-lg font-semibold text-[#747D8C] hover:underline cursor-pointer text-left"
					>
						退会
					</button>
				</div>

				{/* ブックマーク済み研究室 */}
				<div className="flex items-center justify-between border-b border-black pb-2 w-full mt-8">
					<h2 className="text-xl font-bold text-black">ブックマーク済み研究室</h2>
					<span className="text-sm text-[#747D8C]">保存済み: {bookmarks.length}件</span>
				</div>
				<div className="mt-4 flex flex-col items-center">
					{bookmarks.length === 0 ? (
						<p className="text-[#747D8C]">ブックマーク済みの研究室はありません。</p>
					) : (
						<div
							className="flex items-center w-full max-w-2xl"
							onWheel={handleScroll}
							onTouchStart={handleTouchStart}
							onTouchEnd={handleTouchEnd}
						>
							{/* ≪ボタン */}
							<button
								type="button"
								onClick={handlePrev}
								disabled={currentIndex === 0}
								className={`text-2xl px-2 text-[#747D8C] hover:text-gray-600 transition ${currentIndex === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}
							>
								≪
							</button>
							<div className="flex-1 flex flex-col items-center">
								{/* 大学・学部名の表示 */}
								<div className="mb-2 text-lg font-semibold text-[#747D8C] text-center">
									{currentLab.faculty?.university?.name} {currentLab.faculty?.name}
								</div>
								<div className="flex justify-center w-full">
									<div className="max-w-xl w-full">
										<LabCard lab={currentLab} />
									</div>
								</div>
								<div className="mt-2 text-sm text-[#747D8C] text-center">
									{currentIndex + 1} / {bookmarks.length}
								</div>
							</div>
							{/* ≫ボタン */}
							<button
								type="button"
								onClick={handleNext}
								disabled={currentIndex === bookmarks.length - 1}
								className={`text-2xl px-2 text-[#747D8C] hover:text-gray-600 transition ${currentIndex === bookmarks.length - 1 ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}
							>
								≫
							</button>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	);
};

export default Index;