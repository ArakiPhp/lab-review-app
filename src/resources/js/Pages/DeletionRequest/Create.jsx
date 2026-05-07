import AppLayout from '@/Layouts/AppLayout';
import TextareaField from '@/Components/Common/TextareaField';
import { Head, router, useForm } from '@inertiajs/react';

const typeLabels = {
  university: '大学',
  faculty: '学部',
  lab: '研究室',
};

const Create = ({ target, backUrl, query = '' }) => {
  return (
    <AppLayout title={`削除依頼フォーム - ${target.name}`}>
      <Head title={`削除依頼フォーム - ${target.name}`} />
      <div className="flex flex-col items-center min-h-full">
        <div className="w-full max-w-3xl">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.get(backUrl, { query })}
              className="px-4 py-2 text-sm rounded-lg"
              style={{ backgroundColor: '#8D9DB3 ', color: '#FFFFFF', fontWeight: 'bold' }}
            >
              {`＜ ${typeLabels[target.type] ?? target.type}に戻る`}
            </button>
          </div>
          <p className="text-[#747D8C]">
            掲載情報の削除をご希望の場合は、削除を希望する理由をご記入のうえ、送信してください。
            <br />
            いただいたリクエストは順次確認し、対応いたします。
          </p>
          <DeletionRequestForm target={target} />
        </div>
      </div>
    </AppLayout>
  );
};

const DeletionRequestForm = ({ target}) => {
  const { data, setData, post, processing, errors } = useForm({
    target_id: target.id,
    target_type: target.type,
    reason: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('deletion_requests.store'));
  };
  
  return (
    <form onSubmit={submit} className="mt-6 flex flex-col">
      <div className="flex-1">
        <ErrorSlot message={errors.reason} />
        <TextareaField
          value={data.reason}
          onChange={e => setData('reason', e.target.value)}
          placeholder="削除を希望する理由をご記入ください。"
          size="sm"
          className="mb-2 w-full"
          rows={5}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          disabled={processing}
          className={`p-1 bg-[#33E1ED] shadow-md rounded-md hover:shadow-lg transition-shadow ${processing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="px-14 py-1 block rounded text-white font-bold">
            送信
          </span>
        </button>
      </div>
    </form>
  );
};

const ErrorSlot = ({ message }) => (
  <p className="h-5 text-sm leading-5 text-red-500 overflow-hidden">
    {message ?? '\u00A0'}
  </p>
);

export default Create;
