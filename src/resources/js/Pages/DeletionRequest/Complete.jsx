import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";

const Complete = () => {
	return (
		<AppLayout title="削除依頼送信完了">
			<div className="flex flex-col items-center min-h-full">
				<div className="w-full max-w-3xl">
					<p className="text-[#747D8C]">
						削除依頼をお送りいただき、ありがとうございました。<br />
						いただいた内容を確認し、妥当と判断した場合は速やかに削除対応を行います。<br />
						しばらくお待ちください。
					</p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() =>router.get(route('home'))}
              className="px-4 py-2 text-sm text-[#747D8C] bg-transparent"
            >
              ホームへ戻る
            </button>
           </div>
         </div>
       </div>
     </AppLayout>
   );
};

export default Complete;