import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import AlertModal from "@/Components/Common/AlertModal";
import { useState } from "react";

/**
 * 退会ページコンポーネント
 * @returns {JSX.Element}
 */
const Withdrawal = () => {
	const [isConfirmOpen, setConfirmOpen] = useState(false);
	const { delete: destroy, processing } = useForm();

	const handleWithdrawal = () => {
		destroy(route("mypage.delete"), {
			onSuccess: () => setConfirmOpen(false),
		});
	};

	return (
		<AppLayout title="退会">
			<Head title="退会" />
			<div className="mt-2">
				<div className="flex items-center justify-between border-b border-black pb-2 w-full">
					<h2 className="text-xl font-bold text-black">退会</h2>
				</div>

				<div className="mt-6 space-y-4 text-[#747D8C]">
					<p>
						退会すると、以下のデータがすべて削除されます。この操作は取り消せません。
					</p>
					<ul className="list-disc list-inside space-y-1">
						<li>アカウント情報（ニックネーム・メールアドレス）</li>
						<li>ブックマーク</li>
						<li>投稿したレビュー・コメント</li>
					</ul>
					<p className="font-semibold text-[#FF0000]">
						本当に退会しますか？
					</p>
				</div>

				<div className="mt-8 flex items-center gap-4">
					<button
						type="button"
						onClick={() => setConfirmOpen(true)}
						className="px-6 py-2 bg-[#FF0000] text-white font-bold rounded-md hover:opacity-80 transition cursor-pointer"
					>
						退会する
					</button>
					<Link
						href={route("mypage.index")}
						className="px-6 py-2 bg-[#EEF7FB] text-[#747D8C] shadow-md font-bold rounded-md hover:shadow-lg transition-shadow"
					>
						マイページに戻る
					</Link>
				</div>
			</div>

			<AlertModal
				isOpen={isConfirmOpen}
				onClose={() => setConfirmOpen(false)}
				title="退会の確認"
				message="退会すると元に戻せません。本当に退会しますか？"
				actionLabel="退会する"
				onAction={handleWithdrawal}
				cancelLabel="キャンセル"
				isProcessing={processing}
			/>
		</AppLayout>
	);
};

export default Withdrawal;
