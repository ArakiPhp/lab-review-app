import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import UserInfoBar from "@/Components/MyPage/UserInfoBar";

const Index = ({ title, user }) => {
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
			<h2 className="text-xl font-bold text-black border-b border-black pb-2 w-full mt-8">ブックマーク済み研究室</h2>
		</AppLayout>
	);
}

export default Index;