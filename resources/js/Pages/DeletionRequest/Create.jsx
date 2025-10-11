import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Create({ target }) {
  const { data, setData, post, processing, errors } = useForm({
    target_id: target.id,
    target_type: target.type,
    reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('deletion_requests.store'));
  };

  return (
    <div>
      <h1>削除依頼フォーム</h1>
      <p>対象: {target.name}（{target.type}）</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reason">削除理由（任意）:</label><br />
          <textarea
            id="reason"
            value={data.reason}
            onChange={(e) => setData('reason', e.target.value)}
          />
          {errors.reason && <div>{errors.reason}</div>}
        </div>

        <button type="submit" disabled={processing}>
          削除依頼を送信
        </button>
      </form>
    </div>
  );
}
    