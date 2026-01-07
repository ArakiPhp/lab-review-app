import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import UserInfoBar from "@/Components/MyPage/UserInfoBar";
import LabCard from "@/Components/Lab/LabCard";

const Index = ({ title, user, bookmarks = [] }) => {
	console.log('ブックマーク一覧', bookmarks);
	return (
		<AppLayout title={title}>
			<Head title={title} />

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
			<div className="mt-4 grid gap-4 grid-cols-1">
				{bookmarks.length === 0 ? (
					<p className="text-[#747D8C]">ブックマーク済みの研究室はありません。</p>
				) : (
					bookmarks.map((lab) => (
						<div className="w-full" key={lab.id}>
							<div className="flex flex-col items-center w-full">
								{/* 大学・学部名の表示 */}
								<div className="mb-2 text-lg font-semibold text-[#747D8C] text-center">
									{lab.faculty?.university?.name} {lab.faculty?.name}
								</div>
								<div className="flex justify-center w-full"><div className="max-w-xl w-full"><LabCard lab={lab} /></div></div>
							</div>
						</div>
					))
				)}
			</div>
		</AppLayout>
	);
}

export default Index;