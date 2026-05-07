import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const ERROR_MESSAGES = {
  400: { title: '不正なリクエスト',     description: 'リクエストが正しくありません。' },
  401: { title: '認証エラー',           description: 'このページを表示するにはログインが必要です。' },
  403: { title: 'アクセス禁止',         description: 'このページへのアクセス権限がありません。' },
  404: { title: 'ページが見つかりません', description: 'お探しのページは存在しないか、移動された可能性があります。' },
  500: { title: 'サーバーエラー',       description: 'サーバー内部でエラーが発生しました。しばらく時間をおいてから再度お試しください。' },
  503: { title: 'サービス利用不可',     description: 'ただいまメンテナンス中です。しばらくお待ちください。' },
};

const Error = ({ status }) => {
  const { title, description } = ERROR_MESSAGES[status] ?? {
    title: 'エラーが発生しました',
    description: '予期せぬエラーが発生しました。',
  };

  return (
    <AppLayout title={`${status} - ${title}`}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <p className="text-8xl font-semibold text-[#747D8C]">{status}</p>
        <h1 className="text-2xl font-semibold text-[#747D8C]">{title}</h1>
        <p className="text-[#747D8C]">{description}</p>
        <Link
          href="/"
          className="text-[#747D8C] font-medium"
        >
          ホームへ戻る
        </Link>
      </div>
    </AppLayout>
  );
};

export default Error;
