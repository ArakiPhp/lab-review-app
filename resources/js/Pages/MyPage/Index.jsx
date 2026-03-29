import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import UserInfoBar from "@/Components/MyPage/UserInfoBar";
import LabCard from "@/Components/Lab/LabCard";
import UniversityCard from "@/Components/University/UniversityCard";
import FacultyCard from "@/Components/Faculty/FacultyCard";
import { useState, useRef } from "react";
import CreateUniversityModal from "@/Components/University/CreateUniversityModal";
import EditUserModal from "@/Components/MyPage/EditUserModal";
import NotificationDropdown from "@/Components/MyPage/NotificationDropdown";

/**
 * マイページのトップコンポーネント
 * @param {Object} props - コンポーネントのprops
 * @param {string} props.title - ページタイトル
 * @param {Object} props.user - ユーザー情報オブジェクト
 * @param {Array} [props.bookmarks=[]] - ブックマークされた研究室のリスト
 * @param {Array} [props.notifications=[]] - 通知オブジェクトの配列
 * @returns {JSX.Element} コンポーネントのJSX
 */
const Index = ({ title, user, bookmarks = [], notifications = [], universities = [], faculties = [], createdLabs = [] }) => {
	// 大学作成モーダルの開閉状態
	const [isUniversityModalOpen, setUniversityModalOpen] = useState(false);
	// ユーザー情報編集モーダルの開閉状態
	const [isUserEditModalOpen, setUserEditModalOpen] = useState(false);
	// 横スクロール用インデックス
	const [currentIndex, setCurrentIndex] = useState(0);
	// 大学カルーセル用インデックス
	const [uniIndex, setUniIndex] = useState(0);
	// 学部カルーセル用インデックス
	const [facIndex, setFacIndex] = useState(0);
	// 研究室カルーセル用インデックス
	const [labIndex, setLabIndex] = useState(0);

	const handlePrev = () => {
		setCurrentIndex((prev) => Math.max(prev - 1, 0));
	};
	const handleNext = () => {
		setCurrentIndex((prev) => Math.min(prev + 1, bookmarks.length - 1));
	};

	const handleUniPrev = () => {
		setUniIndex((prev) => Math.max(prev - 1, 0));
	};
	const handleUniNext = () => {
		setUniIndex((prev) => Math.min(prev + 1, universities.length - 1));
	};

	const handleFacPrev = () => {
		setFacIndex((prev) => Math.max(prev - 1, 0));
	};
	const handleFacNext = () => {
		setFacIndex((prev) => Math.min(prev + 1, faculties.length - 1));
	};

	const handleLabPrev = () => {
		setLabIndex((prev) => Math.max(prev - 1, 0));
	};
	const handleLabNext = () => {
		setLabIndex((prev) => Math.min(prev + 1, createdLabs.length - 1));
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

	// 大学カルーセル用タッチスワイプ
	const uniTouchStartX = useRef(0);
	const handleUniTouchStart = (e) => {
		uniTouchStartX.current = e.touches[0].clientX;
	};
	const handleUniTouchEnd = (e) => {
		const touchEndX = e.changedTouches[0].clientX;
		if (touchEndX - uniTouchStartX.current > 50) {
			handleUniPrev();
		} else if (touchEndX - uniTouchStartX.current < -50) {
			handleUniNext();
		}
	};

	// 学部カルーセル用タッチスワイプ
	const facTouchStartX = useRef(0);
	const handleFacTouchStart = (e) => {
		facTouchStartX.current = e.touches[0].clientX;
	};
	const handleFacTouchEnd = (e) => {
		const touchEndX = e.changedTouches[0].clientX;
		if (touchEndX - facTouchStartX.current > 50) {
			handleFacPrev();
		} else if (touchEndX - facTouchStartX.current < -50) {
			handleFacNext();
		}
	};

	// 研究室カルーセル用タッチスワイプ
	const labTouchStartX = useRef(0);
	const handleLabTouchStart = (e) => {
		labTouchStartX.current = e.touches[0].clientX;
	};
	const handleLabTouchEnd = (e) => {
		const touchEndX = e.changedTouches[0].clientX;
		if (touchEndX - labTouchStartX.current > 50) {
			handleLabPrev();
		} else if (touchEndX - labTouchStartX.current < -50) {
			handleLabNext();
		}
	};

	// LabCardを1件だけ表示
	const currentLab = bookmarks[currentIndex];
	const currentUniversity = universities[uniIndex];
	const currentFaculty = faculties[facIndex];
	const currentCreatedLab = createdLabs[labIndex];

	// 大学カルーセル用ホイールスクロール
	const handleUniScroll = (e) => {
		if (universities.length <= 1) return;
		if (e.deltaX > 10 || e.deltaY > 10) {
			handleUniNext();
		} else if (e.deltaX < -10 || e.deltaY < -10) {
			handleUniPrev();
		}
	};

	// 学部カルーセル用ホイールスクロール
	const handleFacScroll = (e) => {
		if (faculties.length <= 1) return;
		if (e.deltaX > 10 || e.deltaY > 10) {
			handleFacNext();
		} else if (e.deltaX < -10 || e.deltaY < -10) {
			handleFacPrev();
		}
	};

	// 研究室カルーセル用ホイールスクロール
	const handleLabScroll = (e) => {
		if (createdLabs.length <= 1) return;
		if (e.deltaX > 10 || e.deltaY > 10) {
			handleLabNext();
		} else if (e.deltaX < -10 || e.deltaY < -10) {
			handleLabPrev();
		}
	};

	// ヘッダー右側に表示する通知ドロップダウン
	const notificationHeaderIcon = (
		<NotificationDropdown notifications={notifications} />
	);

	return (
		<AppLayout title={title} headerRight={notificationHeaderIcon}>
			<Head title={title} />
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
						<UserInfoBar value={user?.name} onOpenEditDialog={() => setUserEditModalOpen(true)} />
					</div>
				</div>

				{/* e-Mailアドレス */}
				<div className="mt-6 mb-4 flex items-center">
					<h3 className="text-lg font-semibold text-[#747D8C] w-40 shrink-0">e-Mailアドレス</h3>
					<div className="w-96">
						<UserInfoBar value={user?.email} onOpenEditDialog={() => setUserEditModalOpen(true)} />
					</div>
				</div>

				{/* パスワード */}
				<div className="mt-6 mb-4 flex items-center">
					<h3 className="text-lg font-semibold text-[#747D8C] w-40 shrink-0">パスワード</h3>
					<div className="w-96">
						<UserInfoBar value="••••••••" onOpenEditDialog={() => setUserEditModalOpen(true)} />
					</div>
				</div>

				{/* 退会 */}
				<div className="mt-6 mb-4 flex items-center">
					<button
						type="button"
						onClick={() => router.get(route('mypage.withdrawal'))}
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

				{/* 作成済み大学 */}
				<div className="flex items-center justify-between border-b border-black pb-2 w-full mt-8">
					<h2 className="text-xl font-bold text-black">作成済み大学</h2>
					<span className="text-sm text-[#747D8C]">
						作成件数: {universities.length}件
					</span>
				</div>
				<div className="mt-4 flex flex-col items-center">
					{universities.length === 0 ? (
						<p className="text-[#747D8C]">作成済みの大学はありません。</p>
					) : (
						<div
							className="flex items-center w-full max-w-2xl"
							onWheel={handleUniScroll}
							onTouchStart={handleUniTouchStart}
							onTouchEnd={handleUniTouchEnd}
						>
							{/* ≪ボタン */}
							<button
								type="button"
								onClick={handleUniPrev}
								disabled={uniIndex === 0}
								className={`text-2xl px-2 text-[#747D8C] hover:text-gray-600 transition ${uniIndex === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}
							>
								≪
							</button>
							<div className="flex-1 flex flex-col items-center">
								<div className="mb-2 text-lg font-semibold text-[#747D8C] text-center">
									{currentUniversity.name}
								</div>
								<div className="flex justify-center w-full">
									<div className="max-w-xl w-full">
										<UniversityCard university={currentUniversity} />
									</div>
								</div>
								<div className="mt-2 text-sm text-[#747D8C] text-center">
									{uniIndex + 1} / {universities.length}
								</div>
							</div>
							{/* ≫ボタン */}
							<button
								type="button"
								onClick={handleUniNext}
								disabled={uniIndex === universities.length - 1}
								className={`text-2xl px-2 text-[#747D8C] hover:text-gray-600 transition ${uniIndex === universities.length - 1 ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}
							>
								≫
							</button>
						</div>
					)}
					<button
						type="button"
						onClick={() => setUniversityModalOpen(true)}
					>
						追加
					</button>
				</div>
				{/* 大学作成モーダル */}
				<CreateUniversityModal isOpen={isUniversityModalOpen} onClose={() => setUniversityModalOpen(false)} />

				{/* ユーザー情報編集モーダル */}
				<EditUserModal isOpen={isUserEditModalOpen} onClose={() => setUserEditModalOpen(false)} user={user} />

				{/* 作成済み学部 */}
				<div className="flex items-center justify-between border-b border-black pb-2 w-full mt-8">
					<h2 className="text-xl font-bold text-black">作成済み学部</h2>
					<span className="text-sm text-[#747D8C]">
						作成件数: {faculties.length}件
					</span>
				</div>
				<div className="mt-4 flex flex-col items-center">
					{faculties.length === 0 ? (
						<p className="text-[#747D8C]">作成済みの学部はありません。</p>
					) : (
						<div
							className="flex items-center w-full max-w-2xl"
							onWheel={handleFacScroll}
							onTouchStart={handleFacTouchStart}
							onTouchEnd={handleFacTouchEnd}
						>
							<button
								type="button"
								onClick={handleFacPrev}
								disabled={facIndex === 0}
								className={`text-2xl px-2 text-[#747D8C] hover:text-gray-600 transition ${facIndex === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}
							>
								≪
							</button>
							<div className="flex-1 flex flex-col items-center">
								<div className="mb-2 text-lg font-semibold text-[#747D8C] text-center">
									{currentFaculty.university?.name}
								</div>
								<div className="flex justify-center w-full">
									<div className="max-w-xl w-full flex justify-center">
										<FacultyCard faculty={currentFaculty} />
									</div>
								</div>
								<div className="mt-2 text-sm text-[#747D8C] text-center">
									{facIndex + 1} / {faculties.length}
								</div>
							</div>
							<button
								type="button"
								onClick={handleFacNext}
								disabled={facIndex === faculties.length - 1}
								className={`text-2xl px-2 text-[#747D8C] hover:text-gray-600 transition ${facIndex === faculties.length - 1 ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}
							>
								≫
							</button>
						</div>
					)}
				</div>

				{/* 作成済み研究室 */}
				<div className="flex items-center justify-between border-b border-black pb-2 w-full mt-8">
					<h2 className="text-xl font-bold text-black">作成済み研究室</h2>
					<span className="text-sm text-[#747D8C]">
						作成件数: {createdLabs.length}件
					</span>
				</div>
				<div className="mt-4 flex flex-col items-center">
					{createdLabs.length === 0 ? (
						<p className="text-[#747D8C]">作成済みの研究室はありません。</p>
					) : (
						<div
							className="flex items-center w-full max-w-2xl"
							onWheel={handleLabScroll}
							onTouchStart={handleLabTouchStart}
							onTouchEnd={handleLabTouchEnd}
						>
							<button
								type="button"
								onClick={handleLabPrev}
								disabled={labIndex === 0}
								className={`text-2xl px-2 text-[#747D8C] hover:text-gray-600 transition ${labIndex === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}
							>
								≪
							</button>
							<div className="flex-1 flex flex-col items-center">
								<div className="mb-2 text-lg font-semibold text-[#747D8C] text-center">
									{currentCreatedLab.faculty?.university?.name} {currentCreatedLab.faculty?.name}
								</div>
								<div className="flex justify-center w-full">
									<div className="max-w-xl w-full">
										<LabCard lab={currentCreatedLab} />
									</div>
								</div>
								<div className="mt-2 text-sm text-[#747D8C] text-center">
									{labIndex + 1} / {createdLabs.length}
								</div>
							</div>
							<button
								type="button"
								onClick={handleLabNext}
								disabled={labIndex === createdLabs.length - 1}
								className={`text-2xl px-2 text-[#747D8C] hover:text-gray-600 transition ${labIndex === createdLabs.length - 1 ? 'opacity-30 cursor-default' : 'cursor-pointer'}`}
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