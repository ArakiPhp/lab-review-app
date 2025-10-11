import React from 'react';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';

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
    <div>
      <h1>削除依頼一覧</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>対象名</th>
            <th>種別</th>
            <th>理由</th>
            <th>依頼者</th>
            <th>依頼日時</th>
          </tr>
        </thead>
        <tbody>
          {deletionRequests.map((req) => (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>
                <Link href={getTargetRoute(req.target_type, req.target_id)}>
                  {req.target?.name ?? '（名称不明）'}
                </Link>
              </td>
              <td>{getTargetLabel(req.target_type)}</td>
              <td>{req.reason || '（理由なし）'}</td>
              <td>{req.requester?.name ?? '（不明）'}</td>
              <td>{dayjs(req.created_at).format('YYYY/MM/DD HH:mm')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
