import React from 'react';
import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const getTargetRoute = (type, id) => {
  switch (type) {
    case 'App\\Models\\University':
      return route('faculties.index', { university: id });
    case 'App\\Models\\Faculty':
      return route('labs.index', { faculty: id });
    case 'App\\Models\\Lab':
      return route('labs.show', { lab: id });
    default:
      return '#';
  }
};

const getTargetLabel = (type) => {
  switch (type) {
    case 'App\\Models\\University':
      return '大学';
    case 'App\\Models\\Faculty':
      return '学部';
    case 'App\\Models\\Lab':
      return '研究室';
    default:
      return '不明';
  }
};

export default function DeletionRequestIndex({ deletionRequests }) {
  return (
    <AppLayout title="削除依頼一覧">
      <Head title="削除依頼一覧" />
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
          {deletionRequests.length > 0 ? (
            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {deletionRequests.map((req) => (
                <div key={req.id} className="py-4 flex gap-6">
                  <div className="flex-shrink-0">
                    <p className="text-[#747D8C]">
                      {new Date(req.created_at).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#747D8C]">
                      <span
                        onClick={() => router.get(getTargetRoute(req.target_type, req.target_id))}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {req.target?.name ?? '（名称不明）'}
                      </span>
                      （{getTargetLabel(req.target_type)}）への削除依頼
                    </p>
                    <p className="text-[#747D8C]">理由: {req.reason || '（理由なし）'}</p>
                    <p className="text-[#747D8C]">依頼者: {req.requester?.name ?? '（不明）'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#747D8C]">削除依頼はありません。</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
