import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";

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

export default function Index({ notifications, user }) {
  return (
    <AppLayout title="通知一覧">
      <Head title="通知一覧" />
      <div className="flex flex-col items-center min-h-full">
        <div className="w-full max-w-3xl">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.get(route('mypage.index'))}
              className="px-4 py-2 text-sm rounded-lg"
              style={{ backgroundColor: '#8D9DB3', color: '#FFFFFF', fontWeight: 'bold' }}
            >
              ＜ マイページに戻る
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-[#747D8C]">通知はありません。</p>
          ) : (
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => {
                    const url = getNotificationUrl(notification);
                    if (url) router.get(url);
                  }}
                  className={`py-4 flex gap-6 ${getNotificationUrl(notification) ? "cursor-pointer hover:bg-[#E2EDF6] transition" : ""}`}
                >
                  <div className="flex-shrink-0">
                    <p className="text-[#747D8C]">{new Date(notification.created_at).toLocaleString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#747D8C]">{notification.data?.message || '通知メッセージがありません'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
